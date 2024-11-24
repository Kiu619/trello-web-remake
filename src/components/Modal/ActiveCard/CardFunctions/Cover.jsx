import styled from '@emotion/styled'
import CancelIcon from '@mui/icons-material/Cancel'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import { Box, Button, Grid, IconButton, Popover, Typography } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator } from '~/utils/validators'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

function Cover({ callApiUpdateCard, card }) {
  const [anchorEl, setAnchorEl] = useState(null)
  // Hàm mở Popover, lưu trữ tham chiếu DOM của thành phần kích hoạt vào anchorEl
  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const openPopover = Boolean(anchorEl)
  const id = openPopover ? 'card-cover-popover' : undefined


  const colors = [
    { color: '#61BD4F', name: 'green' },
    { color: '#F2D600', name: 'yellow' },
    { color: '#FF9F1A', name: 'orange' },
    { color: '#EB5A46', name: 'red' },
    { color: '#C377E0', name: 'purple' },
    { color: '#0079BF', name: 'blue' },
    { color: '#51E898', name: 'light-green' },
    { color: '#C4C9CC', name: 'gray' }
  ]

  const onUploadCardCover = (event) => {
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])

    // Gọi API...
    toast.promise(
      callApiUpdateCard(reqData).finally(() => event.target.value = ''),
      {
        pending: 'Uploading...'
      }
    )

    handleClosePopover()
  }

  const handleRemoveCover = async () => {
    callApiUpdateCard({ cover: '' })
    handleClosePopover()
  }

  const handleColorSelect = async (color) => {
    const url = `https://dummyimage.com/3000x1000/${color.slice(1)}/000000&text=+`
    callApiUpdateCard({ cover: url })
    handleClosePopover()
  }

  const isImageFile = (fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'jfif']
    const fileExtension = fileName.split('.').pop().toLowerCase()
    return imageExtensions.includes(fileName)
  }

  return (
    <>
      <SidebarItem onClick={(e) => handleOpenPopover(e)}><TaskAltOutlinedIcon fontSize="small" />Cover</SidebarItem>

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
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Cover</Typography>
            <IconButton size="small" onClick={handleClosePopover}>
              <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} />
            </IconButton>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#7e8b9a', mb: 1 }}>Colors</Typography>
            <Grid container spacing={1}>
              {colors.map((color, index) => (
                <Grid item xs={3} key={index}>
                  <Box
                    sx={{ width: '100%', height: '40px', bgcolor: color.color, cursor: 'pointer', borderRadius: 1 }}
                    onClick={() => handleColorSelect(color.color)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#7e8b9a', mb: 1 }}>Attachments</Typography>
            {/* Ảnh ở attachments nếu có  */}

            <Grid container spacing={1}>
              {card?.attachments?.filter(attachment => isImageFile(attachment.fileType)).map((attachment, index) => (
                <Grid item xs={3} key={index}>
                  <img
                    src={attachment.url}
                    alt={attachment.fileType}
                    style={{ width: '100%', height:'40px', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => callApiUpdateCard({ cover: attachment.url })}
                  />
                </Grid>
              ))}
            </Grid>

            <Button component='label' variant="contained" sx={{ width: '100%', bgcolor: '#0079bf', mb: 2 }}>
                            Upload a cover image
              <VisuallyHiddenInput type="file"
                onChange={onUploadCardCover}
              />
            </Button>
            <Button variant="text" color="error" fullWidth
              onClick={handleRemoveCover}
            >
                            Remove
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  )
}

export default Cover