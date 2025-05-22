import { Box, Divider, Avatar as MuiAvatar, Popover, Tooltip, Typography } from '@mui/material'
import { useState, lazy, Suspense } from 'react'

// Sử dụng lazy load cho component UserActivities
const UserActivities = lazy(() => import('./Modal/UserActivities/UserActivities'))

const Avatar = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isShowModalUserActivities, setIsShowModalUserActivities] = useState(false)

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const openPopover = Boolean(anchorEl)
  const id = openPopover ? 'user-popover' : undefined

  return (
    <>
      <Tooltip title={user?.displayName}>
        <MuiAvatar
          sx={{
            width: { xs: 28, sm: 34 },
            height: { xs: 28, sm: 34 },
            margin: { xs: 0.5, sm: 0 },
            cursor: 'pointer'
          }}
          alt={user?.displayName}
          src={user?.avatar}
          onClick={handleOpenPopover}
        />
      </Tooltip>

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
        disableEnforceFocus
        disableAutoFocus
        disableRestoreFocus
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <MuiAvatar
              sx={{ width: 50, height: 50, mr: 2 }}
              src={user?.avatar}
              alt={user?.displayName}
            />
            <Box>
              <Typography variant="h6">
                {user?.displayName || 'Kiu Nguyễn'}
              </Typography>
              <Typography variant="body2">
                @{user?.username || 'kiunguyn42'}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            '&:hover': {
              opacity: '0.8'
            }
          }}>
            <Typography
              sx={{
                padding: '10px 10px 0 10px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onClick={() => {
                setIsShowModalUserActivities(true)
                handleClosePopover()
              }}
            >
              View member&apos;s board activity
            </Typography>
          </Box>
        </Box>
      </Popover>

      {isShowModalUserActivities && (
        <Suspense fallback={<div>Loading...</div>}>
          <UserActivities
            isShowModalUserActivities={isShowModalUserActivities}
            setIsShowModalUserActivities={setIsShowModalUserActivities}
            user={user}
          />
        </Suspense>
      )}
    </>
  )
}

export default Avatar