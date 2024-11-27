import { useState, forwardRef } from 'react'
import {
  Box,
  Typography,
  Tooltip,
  Popover,
  Button,
  Avatar,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useForm } from 'react-hook-form'
import { createNewNotificationAPI } from '~/apis'
import { socketIoIntance } from '~/socketClient'
import AutoCompleteSearchUser from '~/components/SearchInput/AutoCompleteSearchUser'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

// Wrap AutoCompleteSearchUser with forwardRef
const ForwardedAutoComplete = forwardRef((props, ref) => (
  <AutoCompleteSearchUser {...props} />
))

ForwardedAutoComplete.displayName = 'ForwardedAutoComplete'

function InviteBoardUser() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const currentUser = useSelector(selectCurrentUser)
  const currentBoard = useSelector(selectCurrentActiveBoard)

  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined

  const { handleSubmit, reset } = useForm()

  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) {
      setAnchorPopoverElement(event.currentTarget)
    } else {
      handleClosePopover()
    }
  }

  const handleClosePopover = () => {
    setAnchorPopoverElement(null)
    setSelectedUser(null)
    reset()
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
  }

  const submitInviteUserToBoard = async () => {
    if (!selectedUser) {
      toast.error('Please select a user to invite')
      return
    }

    try {
      if (selectedUser.email === currentUser.email) {
        toast.error('You cannot invite yourself to the board')
        return
      }

      if (currentBoard.ownerIds.includes(selectedUser._id) || currentBoard.memberIds.includes(selectedUser._id)) {
        toast.error('This user is already in the board')
        return
      }

      setLoading(true)
      // Create notification
      createNewNotificationAPI({
        type: 'inviteUserToBoard',
        userId: selectedUser._id,
        details: {
          boardId: currentBoard._id,
          boardTitle: currentBoard.title,
          senderId: currentUser._id,
          senderName: currentUser.username,
          status: 'PENDING'
        }
      }).then(() => {
        toast.success('Invitation sent successfully!')
        socketIoIntance.emit('FE_FETCH_NOTI', { userId: selectedUser._id })
      })

      handleClosePopover()
    } catch (error) {
      // toast.error(error.message || 'Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Tooltip title="Invite user to this board!">
        <Button
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            padding: { xs: '4px 8px', sm: '6px 16px' },
            '&:hover': {
              borderColor: 'white',
              opacity: 0.8
            }
          }}
        >
          {!isMobile && 'Invite'}
        </Button>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isMobile ? 'center' : 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isMobile ? 'center' : 'right'
        }}
      >
        <form onSubmit={handleSubmit(submitInviteUserToBoard)}>
          <Box sx={{
            p: { xs: '10px 15px 15px 15px', sm: '15px 20px 20px 20px' },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: { xs: '280px', sm: '320px' }
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '14px', sm: '16px' }
              }}
            >
              Invite User To This Board
            </Typography>

            <ForwardedAutoComplete
              width="100%"
              variant='popover'
              value={selectedUser}
              onUserSelect={handleUserSelect}
            />

            {selectedUser && (
              <Box sx={{
                p: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                textAlign: { xs: 'center', sm: 'left' }
              }}>
                <Avatar
                  src={selectedUser.avatar}
                  alt={selectedUser.displayName}
                  sx={{
                    width: { xs: 40, sm: 50 },
                    height: { xs: 40, sm: 50 },
                    borderRadius: '50%'
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    textAlign: { xs: 'center', sm: 'left' }
                  }}
                >
                  {selectedUser.displayName} ({selectedUser.email})
                </Typography>
              </Box>
            )}

            <Box sx={{
              alignSelf: 'flex-end',
              width: '100%',
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'flex-end' }
            }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !selectedUser}
                sx={{
                  position: 'relative',
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px'
                    }}
                  />
                ) : 'Invite'}
              </Button>
            </Box>
          </Box>
        </form>
      </Popover>
    </Box>
  )
}

export default InviteBoardUser