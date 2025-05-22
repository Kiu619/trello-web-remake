import { FormatAlignLeft } from '@mui/icons-material'
import CancelIcon from '@mui/icons-material/Cancel'
import { Box, Modal, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchUserActivitiesAPI } from '~/apis'
import ActivityItem from '~/components/ActivityItem'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

const UserActivities = ({ isShowModalUserActivities, setIsShowModalUserActivities, user }) => {
  const handleCloseModal = () => {
    setIsShowModalUserActivities(false)
  }

  const board = useSelector(selectCurrentActiveBoard)
  const [activities, setActivities] = useState([])
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetchUserActivitiesAPI({
          userId: user?._id,
          boardId: board?._id
        })
        setActivities(res || [])
      } catch (error) {
        setActivities([])
      }
    }
    if (isShowModalUserActivities && user?._id && board?._id) {
      fetchActivity()
    }
  }, [isShowModalUserActivities, user?._id, board?._id])

  return (
    <Modal
      disableScrollLock
      open={isShowModalUserActivities}
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: 'auto' }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '86%',
          maxWidth: '700px',
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '20px 20px',
          margin: '50px auto',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FormatAlignLeft className='primary-icon' />
            <Typography sx={{ fontWeight: 'bold' }} variant="h6">
              {user?.displayName}
            </Typography>
          </Box>
          <CancelIcon color="error" sx={{ cursor: 'pointer', '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>
        <Box>
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <ActivityItem key={index} activity={activity} handleCloseModal={handleCloseModal} />
            ))
          ) : (
            <Typography>No activities found</Typography>
          )}
        </Box>
      </Box>
    </Modal>
  )
}

export default UserActivities