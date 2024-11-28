import { useEffect, useState } from 'react'
import moment from 'moment'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { useDispatch, useSelector } from 'react-redux'
import { createNewNotificationAPI, markAsReadAllNotificationAPI } from '~/apis'
import { selectCurrentNotifications, updateBoardInvitationAPI, fetchNotificationsAPI, markAsReadAll, updateBoardRequestAPI } from '~/redux/notifications/notificationsSlice'
import _ from 'lodash'

import { socketIoIntance } from '~/socketClient'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { Link, useNavigate } from 'react-router-dom'
import { Attachment, Comment, TaskAltOutlined } from '@mui/icons-material'

const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [newNotification, setNewNotification] = useState(false)
  const navigate = useNavigate()
  const notifications = useSelector(selectCurrentNotifications)
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  // Kiểm tra có thông báo mới chưa đọc
  useEffect(() => {
    const hasUnread = notifications?.some(notification => !notification.isRead)
    setNewNotification(hasUnread)
  }, [notifications])

  // Handle opening notifications dropdown and marking as read
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
    if (newNotification) {
      dispatch(markAsReadAll())
      markAsReadAllNotificationAPI()
      setNewNotification(false)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    dispatch(fetchNotificationsAPI())

    const handleFetchNotifications = (userId) => {
      if (userId?.userId === currentUser._id) {
        dispatch(fetchNotificationsAPI())
      }
    }

    socketIoIntance.on('BE_FETCH_NOTI', handleFetchNotifications)

    return () => {
      socketIoIntance.off('BE_FETCH_NOTI', handleFetchNotifications)
    }
  }, [dispatch, currentUser._id])

  const updateBoardRequest = (status, notificationId, senderId, boardId, boardTitle) => {
    dispatch(updateBoardRequestAPI({ status, notificationId })).then((res) => {
      if (res.payload.details.status === BOARD_INVITATION_STATUS.ACCEPTED) {
        createNewNotificationAPI({
          type: 'acceptedRequestToJoinBoard',
          userId: senderId,
          details: {
            boardId: boardId,
            boardTitle: boardTitle
          }
        }).then(() => {
          socketIoIntance.emit('FE_FETCH_NOTI', { userId: senderId })
        })
      }
    })
  }

  const updateBoardInvitation = (status, notificationId) => {
    dispatch(updateBoardInvitationAPI({ status, notificationId })).then((res) => {
      if (res.payload.details.status === BOARD_INVITATION_STATUS.ACCEPTED) {
        setTimeout(() => {
          navigate(`/board/${res.payload.details.boardId}`)
        }, 1234)
      }
    })
  }

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          variant={newNotification ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon sx={{
            color: newNotification ? 'yellow' : 'white'
          }} />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {(!notifications || notifications.length === 0) && <MenuItem sx={{ minWidth: 200 }}>No notifications.</MenuItem>}

        {_.orderBy(notifications, ['createdAt'], ['desc']).map((notification, index) => {
          let notificationContent
          switch (notification.type) {
          case 'inviteUserToBoard':
            notificationContent = (
              <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box><GroupAddIcon fontSize="small" /></Box>
                  <Box><strong>{notification?.details?.senderName}</strong> had invited you to join the board <strong>{notification.details.boardTitle}</strong></Box>
                </Box>

                {notification?.details?.status === BOARD_INVITATION_STATUS.PENDING &&
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        className="interceptor-loading"
                        type="submit"
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        className="interceptor-loading"
                        type="submit"
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification._id)}
                      >
                        Reject
                      </Button>
                    </Box>
                }

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  {notification?.details?.status === BOARD_INVITATION_STATUS.ACCEPTED &&
                      <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />}
                  {notification?.details?.status === BOARD_INVITATION_STATUS.REJECTED &&
                      <Chip icon={<NotInterestedIcon />} label="Rejected" color="error" size="small" />}
                </Box>
              </Box>
            )
            break

          case 'mention':
            notificationContent = (
              <Box onClick={handleClose} sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link to={`/board/${notification?.details?.boardId}/card/${notification?.details?.cardId}`} style={{ textDecoration: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme => theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    <Comment />
                    <Box>
                      <strong>{notification?.details?.senderName}</strong> had mentioned you in the card <strong>{notification?.details?.cardTitle}</strong> in the board <strong>{notification?.details?.boardTitle}</strong>
                    </Box>
                  </Box>
                </Link>
              </Box>
            )
            break

          case 'dueDateInCard':
            notificationContent = (
              <Box onClick={handleClose} sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link to={`/board/${notification?.details?.boardId}/card/${notification?.details?.cardId}`} style={{ textDecoration: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme => theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    <WatchLaterOutlinedIcon />
                    <Box>
                      <strong>{notification?.details?.senderName}</strong> had set a due date in the card <strong>{notification?.details?.cardTitle}</strong> in the board <strong>{notification?.details?.boardTitle}</strong>
                    </Box>
                  </Box>
                </Link>
              </Box>
            )
            break

          case 'assignment':
            notificationContent = (
              <Box onClick={handleClose} sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link to={`/board/${notification?.details?.boardId}/card/${notification?.details?.cardId}`} style={{ textDecoration: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme => theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    <TaskAltOutlined />
                    <Box>
                      You have been assigned to the card <strong>{notification?.details?.cardTitle}</strong> in the board <strong>{notification?.details?.boardTitle}</strong> by <strong>{notification?.details?.senderName}</strong>
                    </Box>
                  </Box>
                </Link>
              </Box>
            )
            break

          case 'attachmentInCard':
            notificationContent = (
              <Box onClick={handleClose} sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link to={`/board/${notification?.details?.boardId}/card/${notification?.details?.cardId}`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme => theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    <Attachment />
                    <Box>
                      <strong>{notification?.details?.senderName}</strong> had upload an attachment <strong>{notification?.details?.attachmentName}</strong> in the card <strong>{notification?.details?.cardTitle}</strong> in the board <strong>{notification?.details?.boardTitle}</strong>
                    </Box>
                  </Box>
                </Link>
              </Box>
            )
            break

          case 'acceptedRequestToJoinBoard':
            notificationContent = (
              <Box onClick={handleClose} sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link to={`/board/${notification?.details?.boardId}`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme => theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    <GroupAddIcon />
                    <Box>
                      Your request to join the board <strong>{notification?.details?.boardTitle}</strong> has been accepted
                    </Box>
                  </Box>
                </Link>
              </Box>
            )
            break

          case 'requestToJoinBoard':
            notificationContent = (
              <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box><GroupAddIcon fontSize="small" /></Box>
                  <Box><strong>{notification?.details?.senderName}</strong> had requested to join the board <strong>{notification.details.boardTitle}</strong></Box>
                </Box>

                {notification?.details?.status === BOARD_INVITATION_STATUS.PENDING &&
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        className="interceptor-loading"
                        type="submit"
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => updateBoardRequest(BOARD_INVITATION_STATUS.ACCEPTED, notification._id, notification.details.senderId, notification.details.boardId, notification.details.boardTitle)}
                      >
                        Accept
                      </Button>
                      <Button
                        className="interceptor-loading"
                        type="submit"
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => updateBoardRequest(BOARD_INVITATION_STATUS.REJECTED, notification._id)}
                      >
                        Reject
                      </Button>
                    </Box>
                }

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  {notification?.details?.status === BOARD_INVITATION_STATUS.ACCEPTED &&
                      <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />}
                  {notification?.details?.status === BOARD_INVITATION_STATUS.REJECTED &&
                      <Chip icon={<NotInterestedIcon />} label="Rejected" color="error" size="small" />}
                </Box>
              </Box>
            )
            break

          default:
          }

          return (
            <Box key={index}>
              <MenuItem sx={{
                minWidth: 200,
                maxWidth: 360,
                overflowY: 'auto'
              }}>
                {notificationContent}
              </MenuItem>
              <Box sx={{ mr: 2, textAlign: 'right' }}>
                <Typography variant="span" sx={{ fontSize: '13px' }}>
                  {moment(notification.createdAt).format('llll')}
                </Typography>
              </Box>
              {index !== (notifications?.length - 1) && <Divider />}
            </Box>
          )
        })}

      </Menu>
    </Box>
  )
}

export default Notifications