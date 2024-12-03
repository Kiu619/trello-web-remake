import { useState } from 'react'
import {
  Drawer,
  IconButton,
  useMediaQuery,
  Box,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AutoCompleteSearchBoard from './AutoCompleteSearchBoard'
import CancelIcon from '@mui/icons-material/Cancel'

const MobileSearchWrapper = (props) => {
  const isMobile = useMediaQuery('(max-width:975px)')
  const [open, setOpen] = useState(false)

  if (!isMobile) {
    return <AutoCompleteSearchBoard {...props} />
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.2)'
          }
        }}
      >
        <SearchIcon />
      </IconButton>

      <Drawer
        id="board-search-drawer"
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            width: '335px',
            maxWidth: '100%'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* <Typography variant="h6" sx={{ mb: 2 }}>
            Search Boards
          </Typography> */}
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, alignItems: 'center' }}>
            <Typography variant="h6">Search Boards</Typography>
            <Box sx={{
              position: 'absolute',
              top: '12px',
              right: '10px',
              cursor: 'pointer'
            }}>
              <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleClose} />
            </Box>
          </Box>
          <AutoCompleteSearchBoard
            {...props}
            variant="popover"
            customStyles={{ width: '100%' }}
          />
        </Box>
      </Drawer>
    </>
  )
}

export default MobileSearchWrapper