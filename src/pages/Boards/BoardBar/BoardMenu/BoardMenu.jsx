import CancelIcon from '@mui/icons-material/Cancel'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DoDisturbOutlinedIcon from '@mui/icons-material/DoDisturbOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { Box, Divider, Drawer, IconButton, List, ListItem, Typography } from '@mui/material'
import { useState } from 'react'
import AboutThisBoard from './AboutThisBoard'
import ContentCopy from '@mui/icons-material/ContentCopy'
import { useConfirm } from 'material-ui-confirm'
import { deleteBoardAPI, leaveBoardAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { socketIoIntance } from '~/socketClient'
import OpenClose from './OpenClose'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import Copy from './Copy'
const BoardMenu = ({ board, currentUser }) => {

  const [anchorEl, setAnchorEl] = useState(null)
  const [showAboutBoard, setShowAboutBoard] = useState(false)
  const open = Boolean(anchorEl)

  const navigate = useNavigate()

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setShowAboutBoard(false)
  }

  const handleAboutBoardClick = () => {
    setShowAboutBoard(true)
  }

  const confirmLeaveBoard = useConfirm()

  const handleLeaveBoard = () => {
    handleMenuClose()
    confirmLeaveBoard({
      title: 'Leave this board?',
      description: 'Are you sure? You will no longer have access to this board.'
    })
      .then(() => {
        leaveBoardAPI(board._id).then((res) => {
          if (res) {
            navigate('/boards')
            setTimeout(() => {
              socketIoIntance.emit('batch', { boardId: board._id })
            }, 2000)
          }
        })
      })
      .catch(() => {
        // User cancel
      })
  }

  const confirmDeleteBoard = useConfirm()

  const handleDeleteBoard = () => {
    handleMenuClose()
    confirmDeleteBoard({
      title: 'Delete this board?',
      description: `This will delete the entire column "${board.title}". Are you sure?`
    })
      .then(() => {
        // deleteBoardAPI(board._id).then((res) => {
        //   toast.success(res?.deleteResult)
        // })
        deleteBoardAPI(board._id).then((res) => {
          if (res) {
            navigate('/boards')
            setTimeout(() => {
              socketIoIntance.emit('batch', { boardId: board._id })
            }, 2000)
          }
        })
      })
      .catch(() => {
        // User cancel
      })
  }

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MoreHorizOutlinedIcon sx={{ color: 'white' }} />
      </IconButton>
      <Drawer
        id="board-menu"
        anchor="right"
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            width: '335px',
            maxWidth: '100%'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, alignItems: 'center' }}>
          <Typography variant="h6">Menu</Typography>
          <Box sx={{
            position: 'absolute',
            top: '12px',
            right: '10px',
            cursor: 'pointer'
          }}>
            <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleMenuClose} />
          </Box>
        </Box>
        <List sx={{ width: 335 }}>

          <Divider />

          <ListItem
            onClick={handleAboutBoardClick}
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
              <InfoOutlinedIcon className='primary-icon' />
              About this board
            </Box>
          </ListItem>

          <Divider />

          {board?.isClosed === false && (
            <Copy board={board} handleMenuClose={handleMenuClose} />
          )}

          <Divider />

          {board?.ownerIds.includes(currentUser._id) && (<OpenClose board={board} handleMenuClose={handleMenuClose} />)}

          <Divider />

          {!board?.ownerIds.includes(currentUser._id) && (
            <ListItem
              onClick={handleLeaveBoard}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  color: 'error.dark',
                  '& .danger-icon': {
                    color: 'error.dark'
                  }
                }
              }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
              >
                <LogoutOutlinedIcon className='danger-icon' />
                Leave board
              </Box>
            </ListItem>)}

          <Divider />

          {board?.ownerIds.includes(currentUser._id) && (
            <ListItem
              onClick={handleDeleteBoard}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  color: 'error.dark',
                  '& .danger-icon': {
                    color: 'error.dark'
                  }
                }
              }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
              >
                <DeleteOutlineIcon className='danger-icon' />
                Delete board
              </Box>
            </ListItem>
          )}

        </List>
      </Drawer>
      {showAboutBoard && (
        <AboutThisBoard currentUser={currentUser} board={board} showAboutBoard={showAboutBoard} setShowAboutBoard={setShowAboutBoard} />
      )}
    </>
  )
}

export default BoardMenu
