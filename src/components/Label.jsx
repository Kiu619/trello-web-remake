import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewLabelAPI, updateLabelAPI, deleteLabelAPI } from '~/apis'
import { selectCurrentActiveBoard, addLabelToBoard, updateBoardLabel, deleteLabelFromBoard } from '~/redux/activeBoard/activeBoardSlice'
import CreateEditLabel from './Dialog/CreateEditLabel'
import { selectActiveCard } from '~/redux/activeCard/activeCardSlice'


const Label = ({
  onLabelSelect,
  onLabelCreate,
  onLabelEdit,
  onLabelDelete,
  showCheckbox = false
}) => {
  const [searchText, setSearchText] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingLabel, setEditingLabel] = useState(null)

  const board = useSelector(selectCurrentActiveBoard)
  const activeCard = useSelector(selectActiveCard)
  const dispatch = useDispatch()

  // Lấy labels từ currentActiveBoard thay vì labelSlice
  const labels = board?.labels || []

  const filteredLabels = labels.filter(label =>
    label?.title?.toLowerCase().includes(searchText.toLowerCase())
  )

  // Kiểm tra xem label có trong activeCard hay không
  const isLabelInCard = (label) => {
    if (!activeCard || !activeCard.labelIds) return false
    return activeCard.labelIds.includes(label._id)
  }

  const handleCreateLabel = async (newLabelData) => {
    try {
      const response = await createNewLabelAPI(newLabelData)
      dispatch(addLabelToBoard(response))

      // Callback cho component cha nếu cần
      onLabelCreate?.(response)

      // Đóng dialog
      setIsCreateDialogOpen(false)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating label:', error)
    }
  }

  const handleEditLabel = async (updatedLabelData) => {
    try {
      const response = await updateLabelAPI(editingLabel._id, updatedLabelData)
      dispatch(updateBoardLabel(response))

      // Callback cho component cha nếu cần
      onLabelEdit?.(response)

      // Đóng dialog và reset state
      setIsEditDialogOpen(false)
      setEditingLabel(null)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating label:', error)
    }
  }

  const handleDeleteLabel = async (labelId) => {
    try {
      await deleteLabelAPI(labelId)
      dispatch(deleteLabelFromBoard(labelId))

      // Callback cho component cha nếu cần
      onLabelDelete?.(labelId)

      // Đóng dialog và reset state
      setIsEditDialogOpen(false)
      setEditingLabel(null)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting label:', error)
    }
  }

  const handleOpenEditDialog = (label) => {
    setEditingLabel(label)
    setIsEditDialogOpen(true)
  }

  const handleLabelToggle = (label) => {
    if (!activeCard) return

    const isInCard = isLabelInCard(label)
    let updatedLabelIds

    if (isInCard) {
      // Nếu label đã có trong card, xóa nó
      updatedLabelIds = activeCard.labelIds.filter(labelId => labelId !== label._id)
    } else {
      // Nếu label chưa có trong card, thêm vào
      updatedLabelIds = activeCard.labelIds ? [...activeCard.labelIds, label._id] : [label._id]
    }
    onLabelSelect?.(updatedLabelIds)
  }

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Search Input */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search labels..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {/* Labels Section */}
      <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, color: '#5e6c84', fontWeight: 600 }}>
        Labels
      </Typography>

      {/* Label List */}
      <Box sx={{ mb: 2 }}>
        {filteredLabels.map((label) => {
          const isInCard = isLabelInCard(label)
          return (
            <Box
              key={label._id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1,
                p: 1,
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#e4e6ea'
                }
              }}
            >
              {/* Checkbox - chỉ hiển thị khi showCheckbox=true */}
              {showCheckbox && (
                <Checkbox
                  checked={isInCard}
                  onChange={() => handleLabelToggle(label)}
                  sx={{
                    color: '#5e6c84',
                    '&.Mui-checked': {
                      color: '#0079bf'
                    },
                    mr: 1
                  }}
                />
              )}

              {/* Label Display */}
              <Box
                sx={{
                  flex: 1,
                  height: 32,
                  backgroundColor: label.color,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  px: 1,
                  mr: 1,
                  position: 'relative'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenEditDialog(label)
                }}
                // onClick={() => showCheckbox && handleLabelToggle(label)}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontWeight: 600,
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  {label.title}
                </Typography>
              </Box>

              {/* Edit Button */}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenEditDialog(label)
                }}
                sx={{
                  color: '#5e6c84',
                  '&:hover': { backgroundColor: '#ddd' }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          )
        })}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Create New Label Button */}
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setIsCreateDialogOpen(true)}
        sx={{
          borderColor: '#ddd',
          color: '#5e6c84',
          '&:hover': {
            borderColor: '#ccc',
            backgroundColor: '#f4f5f7'
          }
        }}
      >
        Create a new label
      </Button>

      {/* Create Label Dialog */}
      <CreateEditLabel
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateLabel}
        boardId={board._id}
        mode="create"
      />

      {/* Edit Label Dialog */}
      <CreateEditLabel
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setEditingLabel(null)
        }}
        onSubmit={handleEditLabel}
        onDelete={handleDeleteLabel}
        boardId={board._id}
        mode="edit"
        initialData={editingLabel}
      />
    </Box>
  )
}

export default Label