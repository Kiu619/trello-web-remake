import { Container } from "@mui/material"
import { cloneDeep, isEmpty } from "lodash"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { moveCardToDifferentColumnAPI, updateBoardDetailsAPI, updateColumnDetailsAPI } from "~/apis"
import AppBar from "~/components/AppBar/AppBar"
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner"
import ActiveCard from "~/components/Modal/ActiveCard/ActiveCard"
import { fetchBoardDetailsAPI, selectCurrentActiveBoard, updateCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice"
import BoardBar from "./BoardBar/BoardBar"
import BoardContent from "./BoardContent/BoardContent"
import { updateRecentBoards, updateUserAPI } from "~/redux/user/userSlice"


function Board() {
  const dispatch = useDispatch()
  // Dùng State của Redux Toolkit thay cho useState
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)
  const {boardId} = useParams()

  useEffect( () => {
    // tạm thời fix cứng boardId, sau này sẽ lấy từ params bằng react-router-dom 
    // const boardId = '667aff87bc4c766e82037b5d'
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [boardId, dispatch])

  useEffect(() => {
    let timeoutId;
    
    if (!isEmpty(board)) {
      timeoutId = setTimeout(() => {
        dispatch(updateRecentBoards(board))
        dispatch(updateUserAPI({ boardId: board._id, forRecent: true }))
      }, 2000) // delay 2 seconds
    }
  
    // Cleanup function để tránh memory leak
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [board, dispatch])

  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsId = dndOrderedColumns.map(c => c._id)

    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsId
    dispatch(updateCurrentActiveBoard(newBoard))

    // Call API to update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsId })
  }

  const moveCardInTheSameColumns = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(c => c._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))

    // Call API to update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /**
* Khi di chuyển card sang Column khác:
* B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (Hiểu bản chất là xóa cái _id của Card ra khỏi
mång)
* B2: cập nhật mảng cardOrderIds của Column tiếp theo (Hiểu bản chất là thêm _id của Card vào mảng)
* B3: Cập nhật lại trường columnId mới của cái Card đã kéo
* => Làm một API support riêng.
*/
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {

    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))


    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds[0].includes('-placeholder-card')) {
      prevCardOrderIds = prevCardOrderIds.filter(cardId => !cardId.includes('-placeholder-card'))
    }
    // Call API to update board
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,

      prevCardOrderIds: prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }


  if (isEmpty(board)) {
    return <PageLoadingSpinner/>
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* Modal Active Card check đóng mở bằng redux*/}
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
} 

export default Board
