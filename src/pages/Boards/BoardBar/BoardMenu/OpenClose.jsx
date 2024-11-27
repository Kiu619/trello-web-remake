import DoDisturbOutlinedIcon from '@mui/icons-material/DoDisturbOutlined'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import { Box, ListItem } from '@mui/material'
import { cloneDeep } from 'lodash'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { openClosedBoardAPI, updateBoardDetailsAPI } from '~/apis'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { socketIoIntance } from '~/socketClient'

const OpenClose = ({ board, handleMenuClose }) => {

  const dispatch = useDispatch()

  const handleReOpenBoard = () => {
    onUpdateOpenCloseBoard(false)
    handleMenuClose()
  }

  const handleCloseBoard = () => {
    onUpdateOpenCloseBoard(true)
    handleMenuClose()
  }

  const onUpdateOpenCloseBoard = (value) => {
    // Call API to update column title
    const updateData = { isClosed: value }
    openClosedBoardAPI(board._id, updateData).then((res) => {
      const newBoard = cloneDeep(board)
      newBoard.isClosed = value

      newBoard.columns.forEach(column => {
        column.isClosed = value
      })
      dispatch(updateCurrentActiveBoard(newBoard))

      if (value === true) {
        toast.success('Board closed successfully')
      }
      if (value === false) {
        toast.success('Board re-opened successfully')
      }

      setTimeout(() => {
        socketIoIntance.emit('batch', { boardId: board._id })
      }, 2000)
    })
    // dispatch(updateCurrentActiveBoard(newBoard))
  }
  return (
    <>
      {board?.isClosed === true ? (
        <ListItem
          onClick={handleReOpenBoard}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.main',
              '& .primary-icon': {
                color: 'primary.main'
              }
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <RotateRightIcon className='primary-icon' />
            Re-open
          </Box>
        </ListItem>
      ) : (
        <ListItem
          onClick={handleCloseBoard}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              color: 'error.dark',
              '& .danger-icon': {
                color: 'error.dark'
              }
            }
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DoDisturbOutlinedIcon className='danger-icon' />
            Close board
          </Box>
        </ListItem>
      )}
    </>
  )
}

export default OpenClose
