import styled from '@emotion/styled'
import { Box, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import DoDisturbOutlinedIcon from '@mui/icons-material/DoDisturbOutlined'
import { updateColumnDetailsAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { socketIoIntance } from '~/socketClient'
import { useDispatch } from 'react-redux'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

const OpenClose = ({ column, board, handleClose }) => {
  const dispatch = useDispatch()

  const handleReOpenColumn = () => {
    onUpdateOpenCloseColumn(false)
    handleClose()
  }

  const handleCloseColumn = () => {
    onUpdateOpenCloseColumn(true)
    handleClose()
  }

  const onUpdateOpenCloseColumn = (value) => {
    // Call API to update column title
    const updateData = { isClosed: value }
    updateColumnDetailsAPI(column._id, updateData).then((res) => {
      // toast.success(res?.updateResult)
      // toast.success('Update column title successfully')
    })


    // Update redux
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(c => c._id === column._id)
    if (columnToUpdate) {
      columnToUpdate.isClosed = value
    }
    setTimeout(() => {
      socketIoIntance.emit('batch', { boardId: board._id })
    }, 2000)
    dispatch(updateCurrentActiveBoard(newBoard))
  }

  return (
    <>
      {column?.isClosed === true ? (
        <MenuItem onClick={handleReOpenColumn}
          sx={{
            '&:hover': {
              color: 'primary.main',
              '& .move-column-icon': {
                color: 'primary.main'
              }
            }
          }}
        >
          <ListItemIcon>
            <RotateRightIcon className="move-column-icon" fontSize="small" />
          </ListItemIcon>
          <ListItemText>Re-open</ListItemText>
        </MenuItem>
      ) : (
        <MenuItem onClick={handleCloseColumn}
          sx={{
            '&:hover': {
              color: 'error.dark',
              '& .remove-icon': {
                color: 'error.dark'
              }
            }
          }}
        >
          <ListItemIcon>
            <DoDisturbOutlinedIcon className="remove-icon" fontSize="small" />
          </ListItemIcon>
          <ListItemText>Close</ListItemText>
        </MenuItem>
      )}
    </>
  )
}

export default OpenClose