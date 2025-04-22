import { DndContext, DragOverlay, closestCenter, defaultDropAnimationSideEffects, getFirstCollision, pointerWithin, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Box, useMediaQuery } from '@mui/material'
import { cloneDeep, isEmpty } from 'lodash'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
import { generatePlaceholderCard } from '~/utils/formmatters'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import ListColumns from './ListColumns/ListColumns'
import { socketIoIntance } from '~/socketClient'
import { useTheme } from '@emotion/react'
import { useDebounceFn } from '~/customHooks/useDebounceFn'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'COLUMN',
  CARD: 'CARD'
}

const BoardContent = memo((props) => {
  const { board, moveColumns, moveCardInTheSameColumns, moveCardToDifferentColumn } = props

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnBeforeDrop, setOldColumnBeforeDrop] = useState(null)

  const lastOverId = useRef(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const BOARD_BAR_HEIGHT = isMobile ? '100px' : '62px'

  useEffect(() => {
    if (board?.columns) {
      const columns = board.columns
      setOrderedColumns(columns)
    }
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(c => c.cards?.map(c => c._id)?.includes(cardId))
  }

  const moveCardBetWeenColumns = (
    active,
    over,
    activeColumn,
    overColumn,
    overCardId,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns((prevColumns) => {
      const overCardIndex = overColumn.cards.findIndex(c => c._id === overCardId)
      const isBeLowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBeLowOverItem ? 1 : 0
      let newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn.cards.length + 1

      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)

      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(c => c._id !== activeDraggingCardId)
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(c => c._id)
      }

      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(c => c._id !== activeDraggingCardId)
        const rebuild_activeDraggingCardData = { ...activeDraggingCardData, columnId: overColumn._id }
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        nextOverColumn.cards = nextOverColumn.cards.filter(c => !c.FE_PlaceholderCard)
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(c => c._id)
      }

      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnBeforeDrop._id,
          nextOverColumn._id,
          nextColumns
        )
      }

      return nextColumns
    })
  }

  const handleDragStart = (e) => {
    setActiveDragItemId(e?.active?.id)
    setActiveDragItemType(e?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(e?.active?.data?.current)

    if (e?.active?.data?.current?.columnId) {
      const column = findColumnByCardId(e?.active?.id)
      setOldColumnBeforeDrop(column)
    }
  }

  const handleDragOver = (e) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = e
    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn || overColumn.isClosed) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetWeenColumns(
        active,
        over,
        activeColumn,
        overColumn,
        overCardId,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }

  const debouncedEmitBatch = useDebounceFn(() => {
    socketIoIntance.emit('batch', { boardId: board._id })
  }, 2300)

  const handleDragEnd = (e) => {
    const { active, over } = e

    if (!active || !over) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn || overColumn.isClosed) return

      if (oldColumnBeforeDrop._id !== overColumn._id) {
        moveCardBetWeenColumns(
          active,
          over,
          activeColumn,
          overColumn,
          overCardId,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {
        const oldCardIndex = oldColumnBeforeDrop.cards.findIndex(c => c._id === activeDragItemId)
        const newCardIndex = overColumn.cards.findIndex(c => c._id === overCardId)
        const dndOrderedCards = arrayMove(oldColumnBeforeDrop?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(c => c._id)

        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns)
          const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
          if (nextOverColumn) {
            nextOverColumn.cards = dndOrderedCards
            nextOverColumn.cardOrderIds = dndOrderedCardIds
          }
          return nextColumns
        })

        moveCardInTheSameColumns(dndOrderedCards, dndOrderedCardIds, oldColumnBeforeDrop._id)
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        setOrderedColumns(dndOrderedColumns)
        moveColumns(dndOrderedColumns)
      }
    }

    debouncedEmitBatch()

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnBeforeDrop(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCenter({ ...args })
    }
    const poiterIntersections = pointerWithin(args)
    if (!poiterIntersections?.length) {
      return
    }

    let overId = getFirstCollision(poiterIntersections, 'id')
    if (!overId) return
    if (overId) {
      const checkColumn = orderedColumns.find(c => c._id === overId)
      if (checkColumn) {
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(c => {
            return (c.id !== overId) && (checkColumn.cardOrderIds.includes(c.id) || c.id === overId)
          })[0]?.id
        }).id
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType, orderedColumns])

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: (theme) => `calc(100vh - ${theme.trelloCustom.appBarHeight} - ${BOARD_BAR_HEIGHT})`,
          display: 'flex',
          p: '10px 0'
        }}>
          <ListColumns columns={orderedColumns} />
          <DragOverlay dropAnimation={dropAnimation}>
            {activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
              <Column column={activeDragItemData} />
            )}
            {activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
              <Card card={activeDragItemData} />
            )}
          </DragOverlay>
        </Box>
      </DndContext>
    </>
  )
})

export default BoardContent