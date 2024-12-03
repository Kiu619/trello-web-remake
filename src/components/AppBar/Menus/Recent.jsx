import { Box, Typography } from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { ExpandMore } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { selectRecentBoards } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

function Recent({ currentUser, isMobile }) {
  const recentBoardsFromRedux = useSelector(selectRecentBoards)
  const recentBoards = useMemo(() => recentBoardsFromRedux || [], [recentBoardsFromRedux])
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Button
        // sx={{ color: theme => theme.palette.text.primary }}
        sx={{ color: isMobile ? theme => theme.palette.text.primary : 'white' }}
        id="basic-button-recent"
        aria-controls={open ? 'basic-menu-recent' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMore />}
      >
        Recent
      </Button>
      <Menu
        id="basic-menu-recent"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-recent'
        }}
      >
        {recentBoards.map((board, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              navigate(`/board/${board._id}`)
              handleClose()
            }}
          >
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1.5, width: 200, overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}>
              <Box>
                <Typography
                  variant='body2'
                  component='div'
                  sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%'
                  }}
                >
                  {board.title || 'Unnamed Board'}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ color: 'text.secondary' }}
                >
                  {board.ownerIds.includes(currentUser?._id) ? 'Your board' : 'Collaborator board'}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default Recent
