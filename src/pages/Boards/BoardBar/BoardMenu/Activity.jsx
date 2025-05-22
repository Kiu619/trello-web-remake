import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import { Box, Divider, Drawer, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { fetchBoardActivityAPI } from '~/apis'
import ActivityItem from '~/components/ActivityItem'

const Activity = ({ board, showActivity, setShowActivity }) => {
  const [activities, setActivities] = useState([])

  useEffect(() => {
    const fetchActivity = async () => {
      const res = await fetchBoardActivityAPI(board._id)
      setActivities(res)
    }
    fetchActivity()
  }, [board._id])

  return (
    <Drawer
      id="activity"
      anchor="right"
      open={showActivity}
      onClose={() => setShowActivity(false)}
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
        <Box sx={{
          position: 'absolute',
          top: '12px',
          left: '10px',
          cursor: 'pointer'
        }}>
          <ArrowBackIosNewOutlinedIcon onClick={() => setShowActivity(false)} />
        </Box>

        <Typography variant="h6">Activity</Typography>
      </Box>
      <Divider />

      <Box sx={{ maxHeight: 'calc(100vh - 56px)', overflow: 'auto' }}>
        {activities.map((activity, index) => (
          <ActivityItem key={index} activity={activity} />
        ))}
      </Box>
    </Drawer>
  )
}

export default Activity
