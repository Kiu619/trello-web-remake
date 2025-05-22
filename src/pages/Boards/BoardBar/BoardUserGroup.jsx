import { useState } from 'react'
import {
  Box,
  Tooltip,
  Popover,
  useTheme,
  useMediaQuery
} from '@mui/material'
import Avatar from '~/components/Avatar'

function BoardUserGroup({ boardUsers = [], limit = 5 }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Adjust limit for mobile view
  const effectiveLimit = isMobile ? 5 : limit

  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'board-all-users-popover' : undefined

  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  return (
    <Box sx={{
      display: 'flex',
      gap: '4px',
      alignItems: 'center'
    }}>
      {boardUsers.map((user, index) => {
        if (index < effectiveLimit) {
          return (
            <Avatar key={index} user={user} />
          )
        }
        return null
      })}

      {boardUsers.length > effectiveLimit && (
        <Tooltip title="Show more">
          <Box
            aria-describedby={popoverId}
            onClick={handleTogglePopover}
            sx={{
              width: { xs: 28, sm: 36 },
              height: { xs: 28, sm: 36 },
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: { xs: '12px', sm: '14px' },
              fontWeight: '500',
              borderRadius: '50%',
              color: 'white',
              backgroundColor: '#a4b0be'
            }}
          >
            +{boardUsers.length - effectiveLimit}
          </Box>
        </Tooltip>
      )}

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{
          p: { xs: 1, sm: 2 },
          maxWidth: '235px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 0.5, sm: 1 }
        }}>
          {boardUsers.map((user, index) => (
            <Avatar key={index} user={user} />
          ))}
        </Box>
      </Popover>
    </Box>
  )
}

export default BoardUserGroup
