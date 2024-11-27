/* eslint-disable react/no-unescaped-entities */
import { Avatar, Box, Button, Card, Typography } from '@mui/material'
import { Lock } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { createNewNotificationAPI, fetchRequestToJoinBoardStatusAPI } from '~/apis'
import { socketIoIntance } from '~/socketClient'
import { useEffect, useState } from 'react'

const PrivateBoard = ({ board }) => {
  const currentUser = useSelector(selectCurrentUser)
  const [isSendRequest, setIsSendRequest] = useState(false)

  // useEffect(() => {
  //   fetchRequestToJoinBoardStatusAPI(board._id).then(res => {
  //     if (res?.details?.status === 'PENDING') {
  //       setIsSendRequest(true)
  //     }
  //   })
  // }, [board._id])


  const handleSendRequest = () => {
    board?.ownerIds.forEach(ownerId => {
      createNewNotificationAPI({
        type: 'requestToJoinBoard',
        userId: ownerId,
        details: {
          boardId: board._id,
          boardTitle: board.title,
          senderId: currentUser._id,
          senderName: currentUser.username,
          status: 'PENDING'
        }
      }).then(() => {
        setIsSendRequest(true)
        socketIoIntance.emit('FE_FETCH_NOTI', { userId: ownerId })
      })
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'center',
        height: (theme) => `calc(100vh - ${theme.trelloCustom.appBarHeight})`,
        backgroundColor: '#1F2937'
      }}
    >
      <Card
        sx={{
          borderRadius: 2,
          mt: 10,
          height: 'fit-content',
          maxWidth: 400,
          padding: 3,
          textAlign: 'center',
          backgroundColor: '#2D3748',
          color: 'white'
        }}
      >
        {/* Icon Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 3
          }}
        >
          <Avatar sx={{ bgcolor: '#1565c0', color: 'white' }}><Lock /></Avatar>
        </Box>

        {/* Title */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          This board is private
        </Typography>

        {/* Description */}
        <Typography variant="body1" color="white" gutterBottom>
        Send a request to this board's admins to get access. If you're approved to join, you'll receive an email.
        </Typography>

        {/* User Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginY: 3
          }}
        >
          <Avatar
            src={currentUser?.avatar}
            sx={{ mr: 2 }}
          >
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {currentUser?.displayName}
            </Typography>
            <Typography variant="body2" color="white">
              {currentUser?.email}
            </Typography>
          </Box>
        </Box>

        {/* Buttons */}
        <Box>
          <Button
            className='interceptor-loading'
            disabled={isSendRequest}
            onClick={handleSendRequest}
            variant="contained"
            sx={{
              backgroundColor: '#1565c0',
              '&:hover': { backgroundColor: '#2563EB' },
              width: '100%',
              // textTransform: 'none',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            {isSendRequest ? 'Request sent' : 'Send request'}
          </Button>
        </Box>
        <Box marginTop={2}>
          <Typography
            variant="body2"
            color="gray"
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            Switch account
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}

export default PrivateBoard
