import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material'
import { useState, useEffect } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'


const predefinedColors = [
  '#61BD4F', // Green
  '#F2D600', // Yellow
  '#FF9F1A', // Orange
  '#EB5A46', // Red
  '#C377E0', // Purple
  '#0079BF', // Blue
  '#00C2E0', // Light Blue
  '#51E898', // Light Green
  '#FF78CB', // Pink
  '#344563' // Dark Gray
]

const CreateEditLabel = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  boardId,
  mode = 'create',
  initialData = null
}) => {

  const [newLabelText, setNewLabelText] = useState('')
  const [selectedColor, setSelectedColor] = useState('#61BD4F')

  // Reset form khi dialog mở/đóng hoặc khi initialData thay đổi
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setNewLabelText(initialData.title || '')
        setSelectedColor(initialData.color || '#61BD4F')
      } else {
        setNewLabelText('')
        setSelectedColor('#61BD4F')
      }
    }
  }, [isOpen, mode, initialData])

  const handleSubmit = async () => {
    if (newLabelText.trim()) {
      const labelData = {
        title: newLabelText.trim(),
        color: selectedColor
      }

      // Thêm boardId cho create mode
      if (mode === 'create') {
        labelData.boardId = boardId
      }

      // Gọi function từ component cha
      await onSubmit?.(labelData)

      // Reset form chỉ khi create thành công
      if (mode === 'create') {
        setNewLabelText('')
        setSelectedColor('#61BD4F')
      }
    }
  }

  const handleDelete = () => {
    if (mode === 'edit' && initialData?._id) {
      onDelete?.(initialData._id)
    }
  }

  const handleClose = () => {
    onClose()
    // Reset form khi đóng
    setNewLabelText('')
    setSelectedColor('#61BD4F')
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: 'transparent'
          }
        }
      }}
    >
      <DialogTitle>
        {mode === 'create' ? 'Create Label' : 'Edit Label'}
      </DialogTitle>
      <Box sx={{
        position: 'absolute',
        top: '12px',
        right: '10px',
        cursor: 'pointer'
      }}>
        <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleClose} />
      </Box>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Label name"
          fullWidth
          variant="outlined"
          value={newLabelText}
          onChange={(e) => setNewLabelText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newLabelText.trim()) {
              handleSubmit()
            }
          }}
          sx={{ mb: 3 }}
        />

        {/* Color Preview */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Preview
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: 40,
              backgroundColor: selectedColor,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              px: 2
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#fff',
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {newLabelText || 'Label name'}
            </Typography>
          </Box>
        </Box>

        {/* Color Picker */}
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Select a color
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {predefinedColors.map((color) => (
            <Box
              key={color}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: color,
                borderRadius: 1,
                cursor: 'pointer',
                border: selectedColor === color ? '3px solid #0079bf' : '2px solid transparent',
                '&:hover': {
                  opacity: 0.8
                }
              }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {mode === 'edit' && (
            <Button 
              onClick={handleDelete}
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
          )}

          <Box sx={{ ml: 'auto' }}>
            <Button onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!newLabelText.trim()}
            >
              {mode === 'create' ? 'Create' : 'Save'}
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default CreateEditLabel