import ContentCopy from '@mui/icons-material/ContentCopy'
import { Box, Button, ListItem, Popover, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { copyBoardAPI } from '~/apis'

const Copy = ({ board, handleMenuClose }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [boardTitle, setBoardTitle] = useState(board.title || '')
  const navigate = useNavigate()

  const openPopover = Boolean(anchorEl)
  const id = openPopover ? 'copy-card-popover' : undefined

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const handleCopyBoard = () => {
    copyBoardAPI(board._id, { title: boardTitle }).then((res) => {
      if (res) {
        handleClosePopover()
        handleMenuClose()
        setTimeout(() => {
          navigate(`/board/${res.insertedId}`)
        }, 2000)
      }
    })
  }

  return (
    <>
      <ListItem
        onClick={handleOpenPopover}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            color: 'primary.main',
            '& .primary-icon': {
              color: 'primary.main'
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ContentCopy className='primary-icon' />
          Copy board
        </Box>
      </ListItem>

      <Popover
        id={id}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography sx={{ textAlign: 'center', width: '100%', fontSize: '30px', fontWeight: 600 }}>
            Copy
          </Typography>

          <Typography sx={{ fontWeight: 600, mt: 2 }}>Title</Typography>
          <TextField
            fullWidth
            variant='outlined'
            size="small"
            placeholder='Enter title'
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            sx={{
              '& label': {},
              '& .MuiOutlinedInput-root': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
                '& fieldset': { borderColor: 'primary.main' }
              },
              '& .MuiOutlinedInput-root:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
                '& fieldset': { borderColor: 'primary.main' }
              },
              '& .MuiOutlinedInput-root.Mui-focused': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
                '& fieldset': { borderColor: 'primary.main' }
              },
              '& .MuiOutlinedInput-input': {
                px: '6px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }
            }}
          />
          <Typography sx={{ fontWeight: 100, mt: 2 }}>Comments, and members will not be copied to the new board.</Typography>
          <Button
            variant='contained'
            size='small'
            color='info'
            sx={{ mt: 2, width: '100%' }}
            onClick={handleCopyBoard}
            disabled={!boardTitle}
            className='interceptor-loading'
          >
            Copy
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default Copy