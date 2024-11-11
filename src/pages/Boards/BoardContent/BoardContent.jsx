import { DndContext, DragOverlay, closestCenter, defaultDropAnimationSideEffects, getFirstCollision, pointerWithin, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Box } from '@mui/material';
import { cloneDeep, isEmpty } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors';
import { generatePlaceholderCard } from '~/utils/formmatters';
import Column from './ListColumns/Column/Column';
import Card from './ListColumns/Column/ListCards/Card/Card';
import ListColumns from './ListColumns/ListColumns';

// import { io } from "socket.io-client"
// import { BACKEND_URL } from "~/utils/constants"

// const socket = io(`${BACKEND_URL}`);

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'COLUMN',
  CARD: 'CARD'
}


function BoardContent(props) {
  // const openRedux = useSelector(state => state.modal.isOpen)

  const { board, moveColumns,
    moveCardInTheSameColumns, moveCardToDifferentColumn } = props

  // yêu cầu chuột di chuyển ít nhất 10px mới bắt đầu kéo
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  // sensors: dùng để xác định vị trí của con trỏ chuột
  const sensors = useSensors(mouseSensor, touchSensor)
  // const sensors = useMemo(() => useSensors(mouseSensor, touchSensor), [mouseSensor, touchSensor]);

  const [orderedColumns, setOrderedColumns] = useState([])


  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnBeforeDrop, setOldColumnBeforeDrop] = useState(null)

  // điểm va chạm cuối cùng trong thuật toán phát hiện va chạm
  const lastOverId = useRef(null)

  useEffect(() => {
    if (board?.columns) {
      // columns đã được sắp xếp ở component lớn nhất
      const columns = (board.columns)
      setOrderedColumns(columns)
      // console.log('board content columns', columns)
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
      // Tìm vi trí của cái overCard trong column đích (nơi cardActive sẽ được thả vào)
      const overCardIndex = overColumn.cards.findIndex(c => c._id === overCardId)

      const isBeLowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBeLowOverItem ? 1 : 0

      let newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn.cards.length + 1

      // clone mangr orderColumnsState cũ ra 1 mảng mới để xử lý data rồi set lại cho state
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)

      //nextActiveColumn: Column mà card đang kéo thuộc về
      if (nextActiveColumn) {
        // Xóa cardActive khỏi activeColumn
        nextActiveColumn.cards = nextActiveColumn.cards.filter(c => c._id !== activeDraggingCardId)

        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        //cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(c => c._id)
      }

      if (nextOverColumn) {
        //Kiểm tra xem cardActive đã tồn tại trong overColumn chưa (nếu có thì cần xóa nó trước)
        nextOverColumn.cards = nextOverColumn.cards.filter(c => c._id !== activeDraggingCardId)
        //phải rebuild lại activeDraggingCardData với columnId mới
        const rebuild_activeDraggingCardData = { ...activeDraggingCardData, columnId: overColumn._id }

        // Thêm cardActive vào trong overColumn tại vị trí mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        //Xóa cái Placeholder nếu có
        nextOverColumn.cards = nextOverColumn.cards.filter(c => !c.FE_PlaceholderCard)


        //cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(c => c._id)
      }

      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnBeforeDrop._id,
          nextOverColumn._id,
          nextColumns)
      }

      // Trả về mảng columns mới sau khi đã xử lý dữ liệu
      return nextColumns
    })
  }

  const handleDragStart = (e) => {
    // console.log('handleDragStart', e)
    setActiveDragItemId(e?.active?.id)
    setActiveDragItemType(e?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(e?.active?.data?.current)
    // console.log('activeDragItemData', e?.active?.data?.current)

    //Nếu kéo card thì phải Lưu lại column cũ trước khi kéo
    if (e?.active?.data?.current?.columnId) {
      const column = findColumnByCardId(e?.active?.id)
      setOldColumnBeforeDrop(column)
    }
  }

  const handleDragOver = (e) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = e
    if (!active || !over) return
    // console.log('handleDragOver', e)

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active

    const { id: overCardId } = over
    //Tìm 2 cái columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    //Đây là đoạn code xử lý lúc kéo {handleDragOver}, còn xử lý lúc kéo xong thì là {handleDragEnd}
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

  const handleDragEnd = (e) => {
    // console.log('handleDragEnd', e)
    const { active, over } = e

    if (!active || !over) return

    //Xử LÝ KÉO CARD
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over
      //Tìm 2 cái columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      if (oldColumnBeforeDrop._id !== overColumn._id) {
        // console.log('xử lý kéo card qua column khác')
        // Xử lý kéo card qua column khác
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
        // Xử lý kéo card trong cùng 1 column
        //Lấy vị trí cũ của card đang kéo
        const oldCardIndex = oldColumnBeforeDrop.cards.findIndex(c => c._id === activeDragItemId)
        //Lấy vị trí mới của card đang kéo
        const newCardIndex = overColumn.cards.findIndex(c => c._id === overCardId)
        // Dùng arrayMove của dnd kit để sắp xếp lại mảng card ban đầu
        const dndOrderedCards = arrayMove(oldColumnBeforeDrop?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(c => c._id)

        // Cập nhật lại vị trí của card sau khi kéo
        setOrderedColumns((prevColumns) => {
          // clone mangr orderColumnsState cũ ra 1 mảng mới để xử lý data rồi set lại cho state
          const nextColumns = cloneDeep(prevColumns)
          // Tìm overColumn trong mảng columns mới
          const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
          // Cập nhật lại mảng cards của overColumn sau khi đã kéo card
          if (nextOverColumn) {
            // Cập nhật lại mảng cards và cardOrderIds của overColumn sau khi đã kéo card
            nextOverColumn.cards = dndOrderedCards
            nextOverColumn.cardOrderIds = dndOrderedCardIds
          }
          return nextColumns
        })

        moveCardInTheSameColumns(dndOrderedCards, dndOrderedCardIds, oldColumnBeforeDrop._id)
      }
      
    }

    //Xử LÝ KÉO COLUMN
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        // lấy vị trí cũ của column đang kéo
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // lấy vị trí mới của column đang kéo
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        // Dùng arrayMove của dnd kit để sắp xếp lại mảng column ban đầu
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        // Cập nhật lại vị trí của column sau khi kéo
        setOrderedColumns(dndOrderedColumns)

        moveColumns(dndOrderedColumns)
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

      }
    }
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

  // Fix lỗi khi kéo card ra khỏi column
  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCenter({ ...args })
    }
    //Tìm các điểm giao nhau, va cạm - intersections với con trỏ
    const poiterIntersections = pointerWithin(args)
    if (!poiterIntersections?.length) {
      return
    }

    // const intersections = poiterIntersections?.length > 0 ?
    //   poiterIntersections :
    //   rectIntersection(args)

    // Tìm overId đầu tiên trong các intersections
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

    //Nếu overId là null thì trả về mảng rỗng - tránh crash
    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType, orderedColumns])

  return (

    <>
      <DndContext
        //Sử dụng sensors để xác định vị trí của con trỏ chuột
        sensors={sensors}
        // sensors={openRedux ? [] : sensors}
        //Thuật toán phát hiện va chạm
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: (theme) => `calc(100vh - ${theme.trelloCustom.appBarHeight} - ${theme.trelloCustom.boardBarHeight})`,
          display: 'flex',
          p: '10px 0'
          // alignItems: 'center',
        }}>

          <ListColumns
            columns={orderedColumns}
          />
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
}

export default BoardContent
