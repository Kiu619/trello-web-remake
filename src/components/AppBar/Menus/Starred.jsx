import { ExpandMore } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectStarredBoards } from '~/redux/user/userSlice'

function Starred({ currentUser }) {
  const starredBoardsFromRedux = useSelector(selectStarredBoards)
  const starredBoards = useMemo(() => starredBoardsFromRedux || [], [starredBoardsFromRedux])
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClickBoard = (boardId) => {
    navigate(`/board/${boardId}`)
    handleClose()
  }

  return (
    <Box>
      <Button
        sx={{ color: 'white' }}
        id="basic-button-starred"
        aria-controls={open ? 'basic-menu-starred' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMore />}
      >
        Starred
      </Button>
      <Menu
        id="basic-menu-starred"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-starred'
        }}
      >
        {starredBoards.map((board, index) => (
          <MenuItem key={index} onClick={() => handleClickBoard(board._id)}>
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

export default Starred
