import { Box, Container } from '@mui/material'
import { cloneDeep, isEmpty } from 'lodash'
import { useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { moveCardToDifferentColumnAPI, updateBoardDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { fetchBoardDetailsApiRedux, selectActiveBoardError, selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { updateRecentBoards, updateUserAPI } from '~/redux/user/userSlice'
import { hideModalActiveCard, showModalActiveCard } from '~/redux/activeCard/activeCardSlice'
import { socketIoIntance } from '~/socketClient'
import PrivateBoard from './PrivateBoard'
import InvaldUrl from '../ErrorPages/InvalidUrl'

function Board() {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const error = useSelector(selectActiveBoardError)
  const { boardId: fullBoardId, cardId: fullCardId } = useParams()

  const boardId = useMemo(() => fullBoardId.substring(0, 24), [fullBoardId])
  const cardId = useMemo(() => fullCardId?.substring(0, 24), [fullCardId])

  useEffect(() => {
    dispatch(fetchBoardDetailsApiRedux(boardId))

    const handleBatch = (receivedBoardId) => {
      if (receivedBoardId === boardId) {
        dispatch(fetchBoardDetailsApiRedux(boardId))
      }
    }

    const handleCardCopyInSameBoard = (receivedBoardId) => {
      if (receivedBoardId === boardId) {
        dispatch(fetchBoardDetailsApiRedux(boardId))
      }
    }

    socketIoIntance.on('batch', handleBatch)
    socketIoIntance.on('copyCardInSameBoard', handleCardCopyInSameBoard)

    return () => {
      socketIoIntance.off('batch', handleBatch)
      socketIoIntance.off('copyCardInSameBoard', handleCardCopyInSameBoard)
    }
  }, [boardId, dispatch])

  useEffect(() => {
    if (cardId) {
      dispatch(showModalActiveCard())
    } else {
      dispatch(hideModalActiveCard())
    }
  }, [cardId, dispatch])

  useEffect(() => {
    let timeoutId

    if (!isEmpty(board) && !board.forShare) {
      timeoutId = setTimeout(() => {
        dispatch(updateRecentBoards(board))
        dispatch(updateUserAPI({ boardId: board._id, forRecent: true }))
      }, 1000)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, dispatch])

  const moveColumns = useCallback((dndOrderedColumns) => {
    const dndOrderedColumnsId = dndOrderedColumns.map(c => c._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsId
    dispatch(updateCurrentActiveBoard(newBoard))
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsId })
  }, [board, dispatch])

  const moveCardInTheSameColumns = useCallback((dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(c => c._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }, [board, dispatch])

  const moveCardToDifferentColumn = useCallback((currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds[0].includes('-placeholder-card')) {
      prevCardOrderIds = prevCardOrderIds.filter(cardId => !cardId.includes('-placeholder-card'))
    }
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds: prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }, [board, dispatch])

  if (error) {
    return (
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        <AppBar />
        <InvaldUrl />
      </Container>
    )
  }

  if (isEmpty(board)) {
    return <PageLoadingSpinner />
  }

  const boardContent = (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <ActiveCard />
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardInTheSameColumns={moveCardInTheSameColumns}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )

  const boardForShareContent = (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <PrivateBoard board={board} />
    </Container>
  )

  return (
    <>
      {(board?.forShare && board?.type === 'private') ? boardForShareContent : boardContent}
    </>
  )
}

export default Board