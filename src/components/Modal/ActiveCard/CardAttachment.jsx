/* eslint-disable react/no-unescaped-entities */
import {
  AttachFile as AttachFileIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  MoreHoriz as MoreHorizIcon
} from '@mui/icons-material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditNoteIcon from '@mui/icons-material/EditNote'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import { useState } from 'react'
import FileDownloadHandler from '~/components/AttachmentFunctions/FileDownloadHandler'
import FilePreview from '~/components/AttachmentFunctions/FilePreview'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'

// Styled components
const FilePreviewBox = styled(Box)(({ theme }) => ({
  width: 50,
  height: 40,
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  fontSize: '0.8rem',
  fontWeight: '600'
}))

const AttachmentItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    cursor: 'pointer'
  },
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1)
}))

const ToggleButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#000'
}))

const CardAttachment = ({ currentUser, currentBoard, column, activeCard, attachments = [], onAddCardAttachment, onEditCardAttachment }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [showAllAttachments, setShowAllAttachments] = useState(false)
  const [openPop, setOpenPop] = useState(null)
  const [newAttachmentTitleValue, setNewAttachmentTitleValue] = useState('')

  const displayedAttachments = showAllAttachments
    ? attachments
    : attachments.slice(0, 4)

  const handleMoreClick = (event, file) => {
    setAnchorEl(event.currentTarget)
    setSelectedFile(file)
    setNewAttachmentTitleValue(file.filename)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedFile(null)
    setNewAttachmentTitleValue('')
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    const attachmentToDelete = { ...selectedFile, action: 'DELETE' }
    onEditCardAttachment(attachmentToDelete)
    setDeleteDialogOpen(false)
    handleMenuClose()
  }

  const handleAttachmentClick = (file) => {
    setSelectedFile(file)
    setPreviewDialogOpen(true)
  }

  const handleOpenPopover = (event) => {
    setOpenPop(event.currentTarget)
  }

  const handleClosePopover = () => {
    setOpenPop(null)
  }

  const handleEditAttachment = () => {
    if (newAttachmentTitleValue.trim() || newAttachmentTitleValue !== selectedFile.filename) {
      const attachmentToEdit = { ...selectedFile, filename: newAttachmentTitleValue }
      onEditCardAttachment({ ...attachmentToEdit, action: 'EDIT' })
      setNewAttachmentTitleValue('')
      handleClosePopover()
    }
  }

  const toggleAttachmentsDisplay = () => {
    setShowAllAttachments(!showAllAttachments)
  }

  const openPopover = Boolean(openPop)
  const id = openPopover ? 'simple-popover' : undefined

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AttachFileIcon />
          <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>
              Attachment
          </Typography>
        </Box>
        {activeCard?.isClosed === false && column?.isClosed === false && (currentBoard?.memberIds?.includes(currentUser?._id) || currentBoard?.ownerIds?.includes(currentUser?._id)) && (
          <Button
            sx={{ alignSelf: 'flex-end' }}
            component="label"
            variant="contained"
            color="info"
            size="small"
          >
              Add
            <VisuallyHiddenInput type="file" onChange={onAddCardAttachment} />
          </Button>
        )}
      </Box>

      <List sx={{ ml: 2 }}>
        {displayedAttachments.map((file) => (
          <AttachmentItem
            key={file._id}
            onClick={() => handleAttachmentClick(file)}
            secondaryAction={
              activeCard?.isClosed === false && column?.isClosed === false && (currentBoard?.memberIds?.includes(currentUser?._id) || currentBoard?.ownerIds?.includes(currentUser?._id)) && (
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMoreClick(e, file)
                  }}
                >
                  <MoreHorizIcon />
                </IconButton>
              )
            }
          >
            {file?.fileType === 'jpg' || file?.fileType === 'jpeg' || file?.fileType === 'png' || file?.fileType === 'gif' || file?.fileType === 'jfif'
              ? <img src={file.url} alt={file.filename} style={{ width: 50, height: 40, borderRadius: 5, marginRight: 16 }} />
              : <FilePreviewBox>{file?.fileType.toUpperCase()}</FilePreviewBox>
            }
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ fontWeight: '550' }}>
                  {file.filename}
                </Typography>
              }
              secondary={
                <Typography>
                    Added {moment(file.uploadedAt).format('llll')}
                </Typography>
              }
            />
          </AttachmentItem>
        ))}

        {attachments.length > 4 && (
          <ToggleButton
            onClick={toggleAttachmentsDisplay}
            startIcon={showAllAttachments ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            variant="text"
            size="small"
          >
            {showAllAttachments ? 'Show fewer attachments' : `View all attachments (${attachments.length})`}
          </ToggleButton>
        )}
      </List>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem>
          <Button
            onClick={(e) => handleOpenPopover(e)}
            startIcon={<EditNoteIcon />}
            variant="contained"
            size="small"
            color="info"
            sx={{ width: '100%', justifyContent: 'flex-start' }}
          >
              Edit
          </Button>
        </MenuItem>
        <MenuItem>
          <FileDownloadHandler
            file={selectedFile}
            onDownloadComplete={handleMenuClose}
          />
        </MenuItem>
        <MenuItem>
          <Button
            onClick={handleDeleteClick}
            startIcon={<DeleteOutlineIcon />}
            variant="contained"
            size="small"
            color="error"
            sx={{ width: '100%', color: theme => theme.palette.mode === 'dark' ? '#000' : '#fff', justifyContent: 'flex-start' }}
          >
              Delete
          </Button>
        </MenuItem>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Attachment</DialogTitle>
        <DialogContent>
            Are you sure you want to delete "{selectedFile?.filename}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
          </Button>
        </DialogActions>
      </Dialog>

      <FilePreview
        file={selectedFile}
        open={previewDialogOpen}
        onClose={() => {
          setPreviewDialogOpen(false)
          setSelectedFile(null)
        }}
      />

      <Popover
        id={id}
        open={openPopover}
        anchorEl={openPop}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography sx={{ textAlign: 'center', width: '100%', fontSize: '30px', fontWeight: 600 }}>Edit attachment</Typography>
          <Typography sx={{ fontWeight: 450 }}>File name</Typography>
          <TextField
            fullWidth
            variant='outlined'
            size="small"
            value={newAttachmentTitleValue}
            onChange={(e) => setNewAttachmentTitleValue(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
                '& fieldset': { borderColor: 'primary.main' }
              },
              '& .MuiOutlinedInput-root:hover': {
                '& fieldset': { borderColor: 'primary.main' }
              },
              '& .MuiOutlinedInput-root.Mui-focused': {
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
          <Button onClick={handleEditAttachment} variant="contained" size='small' color='info' sx={{ mt: 1, width: '100%' }}>Edit</Button>
        </Box>
      </Popover>
    </Box>
  )
}

export default CardAttachment