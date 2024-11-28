import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import { Avatar, Box, Button, Divider, Drawer, FormControl, FormHelperText, MenuItem, Popover, Select, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import BoardDescriptionMdEditor from './BoardDescriptionMdEditor'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'
import { addBoardAdminAPI, removeBoardAdminAPI } from '~/apis'
import { fetchBoardDetailsApiRedux, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { socketIoIntance } from '~/socketClient'
import { useConfirm } from 'material-ui-confirm'
import { cloneDeep } from 'lodash'

const AboutThisBoard = ({ currentUser, board, showAboutBoard, setShowAboutBoard }) => {

  const [anchorEl, setAnchorEl] = useState(null)
  const openPopover = Boolean(anchorEl)
  const id = openPopover ? 'add-admin-popover' : undefined

  const [errorMessage, setErrorMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState('')

  const dispatch = useDispatch()

  const FE_CardMembers = board?.memberIds.map(memberId => board?.FE_allUsers.find(user => user._id === memberId))

  const handleOpenPopover = useCallback((event) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClosePopover = useCallback(() => {
    setAnchorEl(null)
    setSelectedUser('')
  }, [])

  const handleUserChange = useCallback((event) => {
    setSelectedUser(event.target.value)
  }, [])

  const handleAddAdmin = async () => {
    try {
      const res = await addBoardAdminAPI(board._id, { userId: selectedUser })
      if (res) {
        dispatch(fetchBoardDetailsApiRedux(board._id))
        setTimeout(() => {
          socketIoIntance.emit('batch', { boardId: board._id })
        }, 1234)
        handleClosePopover()
      }
    } catch (error) {
      toast.error('Failed to add admin')
    }
  }

  const handleRemoveAdmin = async (ownerId) => {
    try {
      const res = await removeBoardAdminAPI(board._id, { userId: ownerId })
      if (res) {
        const newBoard = cloneDeep(board)
        newBoard.owners = newBoard.owners.filter(owner => owner._id !== ownerId)
        dispatch(updateCurrentActiveBoard(newBoard))

        setTimeout(() => {
          socketIoIntance.emit('batch', { boardId: board._id })
        }, 2000)

        toast.success('Admin removed successfully')
      }
    } catch (error) {
      toast.error('Failed to remove admin')
    }
  }

  return (
    <>
      <Drawer
        id="about-board"
        anchor="right"
        open={showAboutBoard}
        onClose={() => setShowAboutBoard(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            width: '335px',
            maxWidth: '100%'
            // position: 'relative'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, alignItems: 'center' }}>
          <Box sx={{
            position: 'absolute',
            top: '12px',
            left: '10px',
            cursor: 'pointer'
          }}>
            <ArrowBackIosNewOutlinedIcon onClick={() => setShowAboutBoard(false)} />
          </Box>

          {/* Add the content for the "About this board" section here */}
          <Typography variant="h6">About this board</Typography>
        </Box>
        <Divider />

        <Box sx={{ m: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonOutlineOutlinedIcon />
            Admins
          </Box>
          {board?.isClosed === false && board?.ownerIds.includes(currentUser._id) && (
            <AddCircleOutlinedIcon
              onClick={handleOpenPopover}
              color='info' sx={{ cursor: 'pointer' }}
            />
          )}
        </Box>
        {board?.owners?.map((owner, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }} >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2, mb: 2 }}>
              <Avatar
                src={owner.avatar}
                alt={owner.displayName}
                sx={{ width: 60, height: 60 }}
              >
                {!owner.avatar && (owner.displayName?.charAt(0).toUpperCase() || 'U')}
              </Avatar>
              <Box>
                <Typography variant='h6'>
                  {owner.displayName || 'Unnamed User'}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ color: 'text.secondary' }}
                >
                  @{owner.username}
                </Typography>
              </Box>
            </Box>
            {owner._id !== currentUser._id && board?.isClosed === false && board?.creator === currentUser._id && (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}
                onClick={() => handleRemoveAdmin(owner._id)}
              >
                <RemoveCircleIcon
                  color='info' sx={{ cursor: 'pointer' }}
                />
              </Box>
            )}
          </Box>
        ))}

        {/* Description */}
        <Box sx={{ mx: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BoardDescriptionMdEditor currentUser={currentUser} board={board} />
        </Box>
      </Drawer>

      <Popover
        id={id}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography sx={{ textAlign: 'center', width: '100%', fontSize: '30px', fontWeight: 600 }}>
            Select user
          </Typography>

          <FormControl fullWidth error={!!errorMessage}>
            <Select
              value={selectedUser}
              onChange={handleUserChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Select column' }}
              disabled={FE_CardMembers.length === 0}
            >
              <MenuItem value="">
                <em>Select user</em>
              </MenuItem>
              {FE_CardMembers?.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      src={user.avatar}
                      alt={user.displayName}
                      sx={{ width: 32, height: 32 }}
                    >
                      {!user.avatar && (user.displayName?.charAt(0).toUpperCase() || 'U')}
                    </Avatar>
                    <Box>
                      <Typography variant='body2' component='div'>
                        {user.displayName || 'Unnamed User'}
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{ color: 'text.secondary' }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errorMessage && (
              <FormHelperText>{errorMessage}</FormHelperText>
            )}
          </FormControl>

          <Button
            color="info"
            variant="contained"
            size="small"
            fullWidth
            sx={{ mt: 2 }}
            disabled={selectedUser === ''}
            onClick={handleAddAdmin}
          >
            Add
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default AboutThisBoard
