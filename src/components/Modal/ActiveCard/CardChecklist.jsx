import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import { Box, Button, Checkbox, FormControlLabel, IconButton, LinearProgress, Popover, TextField, Tooltip, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import { useState } from 'react'
import { toast } from 'react-toastify'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'

const CardChecklist = ({ currentUser, currentBoard, column, activeCard, cardMemberIds = [], cardChecklist, onUpdateChecklist, onUpdateChecklistItem }) => {
  const FE_CardMembers = cardMemberIds.map(memberId => currentBoard?.FE_allUsers.find(user => user._id === memberId))

  const [newItem, setNewItem] = useState('')

  const [isEdit, setIsEdit] = useState(null)
  const [isAddItem, setIsAddItem] = useState(false)

  const handleInputChange = (e) => {
    setNewItem(e.target.value)
  }

  //Card Checklist
  const onUpdateCheckListTitle = (value) => {
    if (value.trim() !== '') {
      const incomingChecklistInfo = {
        checklistId: cardChecklist._id,
        title: value,
        items: cardChecklist.items,
        action: 'UPDATE'
      }
      onUpdateChecklist(incomingChecklistInfo)
    }
  }

  //Popover
  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteChecklistId, setDeleteChecklistId] = useState(null)
  // Hàm mở Popover xoá checklist
  const handleOpenPopover = (event, checklistId) => {
    setAnchorEl(event.currentTarget)
    setDeleteChecklistId(checklistId)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
    setDeleteChecklistId(null)
  }

  const openPopover = Boolean(anchorEl)
  const id = openPopover ? 'simple-popover' : undefined

  const handleDeleteChecklist = (checklistId) => {
    const incomingChecklistInfo = {
      checklistId: checklistId,
      action: 'DELETE'
    }
    onUpdateChecklist(incomingChecklistInfo)
    handleClosePopover()
  }

  // Card Checklist Items
  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      setNewItem('')
      setIsAddItem(false)
      const incomingChecklistItemInfo =
      {
        checklistId: cardChecklist._id,
        title: newItem,
        action: 'ADD'
      }
      setTimeout(() =>
        onUpdateChecklistItem(incomingChecklistItemInfo), 500)
    }
  }

  const onUpdatChecklistItemTitle = (itemId, value) => {
    if (value.trim() !== '' && value.trim() !== cardChecklist.items?.find(item => item._id === itemId).title) {
      const incomingChecklistItemInfo =
      {
        checklistId: cardChecklist._id,
        itemId: itemId,
        action: 'UPDATE',
        items: cardChecklist.items,
        title: value,
        isChecked: cardChecklist.items?.find(item => item._id === itemId).isChecked,
        assignedTo: cardChecklist.items?.find(item => item._id === itemId).assignedTo
      }
      onUpdateChecklistItem(incomingChecklistItemInfo)
    }
  }

  const handleCheckboxChange = (itemId) => {
    const item = cardChecklist.items.find(item => item._id === itemId)
    if (item.assignedTo.length === 0 || item.assignedTo.includes(currentUser._id) || currentBoard.ownerIds.includes(currentUser._id)) {
      const incomingChecklistItemInfo =
      {
        checklistId: cardChecklist._id,
        itemId: itemId,
        action: 'UPDATE',
        items: cardChecklist.items,
        title: item.title,
        isChecked: !item.isChecked,
        assignedTo: item.assignedTo
      }
      onUpdateChecklistItem(incomingChecklistItemInfo)
    } else {
      toast.info('You are not assigned to this item.')
    }
  }

  const deleteChecklistItem = (itemId) => {
    const incomingChecklistItemInfo =
    {
      checklistId: cardChecklist._id,
      itemId: itemId,
      action: 'DELETE',
      items: cardChecklist.items.filter(item => item._id !== itemId)
    }
    onUpdateChecklistItem(incomingChecklistItemInfo)
  }

  const calculateProgress = () => {
    const checkedItems = cardChecklist.items.filter(item => item.isChecked).length
    return (checkedItems / cardChecklist.items.length) * 100
  }

  // Popover assign member
  const [checklistItemIdToAssign, setChecklistItemIdToAssign] = useState(null)
  const [assignedMemberIds, setAssignedMemberIds] = useState([])
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-assign-users-popover' : undefined

  const handleUpdateAssignedMembers = (user, itemId) => {
    const item = cardChecklist.items.find(item => item._id === itemId)
    const incomingChecklistItemInfo = {
      checklistId: cardChecklist._id,
      itemId: itemId,
      action: 'UPDATE',
      items: cardChecklist.items,
      title: item.title,
      isChecked: item.isChecked,
      assignedTo: [...item.assignedTo]
    }

    // Kiểm tra xem user đã được assign hay chưa
    const userIndex = incomingChecklistItemInfo.assignedTo.indexOf(user._id)

    if (userIndex !== -1) {
      // Nếu user đã được assign thì xoá user đó khỏi danh sách assignedTo
      incomingChecklistItemInfo.assignedTo.splice(userIndex, 1)
    } else {
      // Ngược lại thì thêm user vào danh sách assignedTo
      incomingChecklistItemInfo.assignedTo.push(user._id)
      incomingChecklistItemInfo.assignMember = user
      incomingChecklistItemInfo.board = currentBoard
      incomingChecklistItemInfo.cardChecklist = cardChecklist
    }
    // console.log('incomingChecklistItemInfo', incomingChecklistItemInfo)
    onUpdateChecklistItem(incomingChecklistItemInfo)
    handleTogglePopover()
  }

  const handleOpenAssignMemberPopover = (itemId) => {
    setChecklistItemIdToAssign(itemId)
    setAssignedMemberIds(cardChecklist.items.find(item => item._id === itemId).assignedTo)
  }

  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <TaskAltOutlinedIcon />
        {column?.isClosed === false && activeCard?.isClosed === false && (activeCard?.memberIds?.includes(currentUser?._id) || currentBoard?.ownerIds?.includes(currentUser?._id)) ? (
          <ToggleFocusInput
            inputFontSize='22px'
            value={cardChecklist.title}
            onChangedValue={onUpdateCheckListTitle}
          />)
          : (
            <Typography variant="h5" sx={{ fontWeight: '600', fontSize: '22px' }}>{activeCard?.title}</Typography>
          )}
        {column?.isClosed === false && activeCard?.isClosed === false && currentBoard.ownerIds.includes(currentUser._id) && (
          <IconButton
            sx={{
              ml: 'auto',
              mr: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.27)'
              },
              padding: 0.3,
              bgcolor: 'rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => {
              e.stopPropagation(),
              handleOpenPopover(e, cardChecklist._id)
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        )}
      </Box>
      <LinearProgress variant="determinate" value={calculateProgress()} />

      {cardChecklist.items?.map((item, index) => (
        <Box sx={{
          display: 'flex',
          width: '100%',
          mt: 1
        }} key={index}>
          <FormControlLabel
            sx={{}}
            control={
              <Checkbox
                disabled={(!activeCard?.memberIds?.includes(currentUser?._id) && !currentBoard?.ownerIds?.includes(currentUser?._id)) || activeCard?.isClosed === true || column?.isClosed === true}
                checked={item.isChecked}
                onChange={() => handleCheckboxChange(item._id)}
              />
            }
          />
          {((activeCard?.memberIds?.includes(currentUser?._id) || currentBoard?.ownerIds?.includes(currentUser?._id)) && column?.isClosed === false && activeCard?.isClosed === false && isEdit === index) ? (
            <Box
              onBlur={() => setIsEdit(null)}
              sx={{ width: '100%' }}
            >
              <ToggleFocusInput
                value={item.title}
                onChangedValue={(value) => onUpdatChecklistItemTitle(item._id, value)}
                autoFocus
              />
            </Box>
          ) : (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                '.icon-buttons': {
                  display: 'flex'
                }
              },
              width: '100%',
              cursor: 'pointer',
              borderRadius: 2,
              justifyContent: 'space-between'
            }} onClick={() => setIsEdit(index)}>
              <Typography sx={{ ml: 1, fontWeight: 'bold' }}>{item?.title}</Typography>
              {(column?.isClosed === false && activeCard?.isClosed === false && currentBoard.ownerIds.includes(currentUser._id)) && (
                <Box className="icon-buttons" sx={{
                  display: 'none',
                  alignItems: 'center'
                }}>
                  <IconButton
                    sx={{
                      ml: 'auto',
                      mr: 1,
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.27)'
                      },
                      padding: 0.3,
                      bgcolor: 'rgba(0, 0, 0, 0.2)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenAssignMemberPopover(item._id)
                      handleTogglePopover(e)
                    }}
                  >
                    <PersonAddAltIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      ml: 'auto',
                      mr: 1,
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.27)'
                      },
                      padding: 0.3,
                      bgcolor: 'rgba(0, 0, 0, 0.2)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteChecklistItem(item._id)
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>)
              }
            </Box>
          )}
        </Box>
      ))}

      {isAddItem && (
        <Box>
          <TextField
            fullWidth
            variant='outlined'
            size="small"
            placeholder="Add an item"
            value={newItem}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddItem()
              }
            }}
            onChange={handleInputChange}
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
              },
              mt: 1,
              borderRadius: 2
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1
            }}
          >
            <Button onClick={() => setIsAddItem(false)} variant="contained"
              sx={{
                mt: 1, height: '30px', bgcolor: 'transparent',
                color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black'
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddItem} variant="contained" color="info" sx={{ mt: 1, height: '30px' }}>
              Add
            </Button>
          </Box>
        </Box>
      )}
      {(activeCard?.memberIds?.includes(currentUser?._id) || currentBoard?.ownerIds?.includes(currentUser?._id)) && column?.isClosed === false && (activeCard?.isClosed === false && !isAddItem) && (
        <Button onClick={() => setIsAddItem(true)} variant="contained" color="info" sx={{ mt: 1, height: '30px' }}>
          Add an item
        </Button>
      )}
      {/* Xoá checklist */}
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
          <Typography>Delete checklist?</Typography>
          <Typography variant="body2" color="textSecondary">
            Deleting a checklist is forever. There is no undo.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClosePopover} sx={{ mr: 1 }}>Cancel</Button>
            <Button onClick={() => handleDeleteChecklist(deleteChecklistId)} color="error" variant="contained">
              Delete checklist
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Popover assign member */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: '260px', display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {FE_CardMembers.map((user, index) =>
            <Tooltip title={user?.displayName} key={index}>
              <Badge
                sx={{ cursor: 'pointer' }}
                overlap="rectangular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  assignedMemberIds.includes(user?._id) &&
                  <CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }}
                  />}
                onClick={() => handleUpdateAssignedMembers(user, checklistItemIdToAssign)}
              >
                <Avatar
                  sx={{ width: 34, height: 34 }}
                  alt={user?.displayName}
                  src={user?.avatar}
                />
              </Badge>
            </Tooltip>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default CardChecklist