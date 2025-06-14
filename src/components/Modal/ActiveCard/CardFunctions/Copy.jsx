import React, { useState } from 'react'
import { Box, Button, FormControl, FormHelperText, MenuItem, Popover, Select, TextField, Typography } from '@mui/material'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import AutoCompleteSearchBoard from '~/components/SearchInput/AutoCompleteSearchBoard'
import { copyCardAPI, fetchBoardDetailsApi } from '~/apis'
import styled from '@emotion/styled'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { isEmpty } from 'lodash'
import { useDispatch } from 'react-redux'
import { clearAndHideCurrentActiveBoard, fetchBoardDetailsApiRedux, updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { socketIoIntance } from '~/socketClient'
import { useNavigate } from 'react-router-dom'
import { clearAndHideCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

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

function Copy({ activeCard }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const openPopover = Boolean(anchorEl)
  const id = openPopover ? 'copy-card-popover' : undefined

  const [columns, setColumns] = useState([])
  const [selectedColumn, setSelectedColumn] = useState('')

  const [selectedBoard, setSelectedBoard] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const [selectedPosition, setSelectedPosition] = useState('')

  const [cardPositions, setCardPositions] = useState([])
  const [cardTitle, setCardTitle] = useState(activeCard?.title || '')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Cập nhật kiểm tra điều kiện dựa trên schema
  const [checkedItems, setCheckedItems] = useState({
    memberIds: Boolean(activeCard?.memberIds?.length),
    labels: Boolean(activeCard?.labelIds?.length),
    dueDate: Boolean(
      activeCard?.dueDate?.dueDate ||
            activeCard?.dueDate?.startDate
    ),
    checklists: Boolean(activeCard?.checklists?.length),
    attachments: Boolean(activeCard?.attachments?.length),
    location: !isEmpty(activeCard?.location),
    comments: Boolean(activeCard?.comments?.length)
  })

  // Hàm kiểm tra điều kiện hiển thị cho từng loại
  const shouldShowOption = {
    memberIds: () => Boolean(activeCard?.memberIds?.length),
    labels: () => Boolean(activeCard?.labelIds?.length),
    dueDate: () => Boolean(
      activeCard?.dueDate?.dueDate ||
            activeCard?.dueDate?.startDate
    ),
    checklists: () => Boolean(activeCard?.checklists?.length),
    attachments: () => Boolean(activeCard?.attachments?.length),
    location: () => !isEmpty(activeCard?.location),
    comments: () => Boolean(activeCard?.comments?.length)
  }

  const handleCheckboxChange = (name) => (event) => {
    setCheckedItems(prev => ({
      ...prev,
      [name]: Boolean(event.target.checked)
    }))
  }

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
    setColumns([])
    setSelectedColumn('')
    setSelectedBoard(null)
    setErrorMessage('')
    setSelectedPosition('')
    setCardPositions([])
  }

  const handleColumnChange = (event) => {
    const columnId = event.target.value
    setSelectedColumn(columnId)

    if (columnId) {
      const selectedCol = columns.find(col => col._id === columnId)
      if (selectedCol && selectedCol.cards) {
        const positions = Array.from(
          { length: selectedCol.cards.length + 1 },
          (_, i) => ({
            value: i,
            label: i === 0 ? 'Top of list' :
              i === selectedCol.cards.length ? 'Bottom of list' :
                `Position ${(i + 1)}`
          })
        )
        setCardPositions(positions)
        setSelectedPosition('')
      }
    } else {
      setCardPositions([])
      setSelectedPosition('')
    }
  }

  const handlePositionChange = (event) => {
    setSelectedPosition(event.target.value)
  }

  const handleBoardSelect = async (board) => {
    setSelectedBoard(board)
    try {
      const res = await fetchBoardDetailsApi(board._id)
      if (!res.columns || res.columns.length === 0) {
        setErrorMessage('This board has no columns')
        setColumns([])
      } else {
        setColumns(res.columns)
        setErrorMessage('')
      }
    } catch (error) {
      console.error('Failed to fetch board details:', error)
      setColumns([])
      setErrorMessage('Failed to fetch board details')
    }
  }

  const copyCardInSameBoard = async (cardId, updateData) => {
    try {
      const res = await copyCardAPI(cardId, updateData)
      dispatch(fetchBoardDetailsApiRedux(activeCard.boardId))
      dispatch(updateCardInBoard(res))
      setTimeout(() => {
        socketIoIntance.emit('batch', { boardId: activeCard.boardId })
      }, 1234)
    } catch (error) {
      console.error('Failed to copy card:', error)
    }
  }

  const handleCopyCard = () => {
    if (!selectedBoard || !selectedColumn || selectedPosition === '') return

    const keepingItems = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([name]) => name)

    const cardId = activeCard._id
    const updateData = {
      currentBoardId: activeCard.boardId,
      currentColumnId: activeCard.columnId,
      newBoardId: selectedBoard._id,
      newColumnId: selectedColumn,
      newPosition: selectedPosition,
      keepingItems,
      title: cardTitle
    }

    if (activeCard.boardId === selectedBoard._id) {
      copyCardInSameBoard(cardId, updateData)
    } else {
      copyCardAPI(cardId, updateData).then((res) => {
        dispatch(clearAndHideCurrentActiveBoard())
        dispatch(clearAndHideCurrentActiveCard())
        setTimeout(() => {
          socketIoIntance.emit('batch', { boardId: selectedBoard._id })
          navigate(`/board/${selectedBoard._id}`)
        }, 1200)
      }).catch((error) => {
        console.error('Failed to move card:', error)
      })
    }

    handleClosePopover()
  }

  const renderCheckboxOption = (name, label, condition) => {
    if (!condition()) return null

    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checkedItems[name]}
            onChange={handleCheckboxChange(name)}
          />
        }
        label={label}
      />
    )
  }

  return (
    <>
      <SidebarItem onClick={handleOpenPopover}>
        <ContentCopyOutlinedIcon fontSize="small" />
                Copy
      </SidebarItem>

      <Popover
        id={id}
        open={openPopover}
        anchorEl={anchorEl}
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
        <Box sx={{ p: 2, width: 300 }}>
          <Typography sx={{ textAlign: 'center', width: '100%', fontSize: '30px', fontWeight: 600 }}>
                        Copy
          </Typography>

          <Typography sx={{ fontWeight: 450, mt: 2 }}>Name</Typography>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={cardTitle}
            autoFocus
            onChange={(e) => setCardTitle(e.target.value)}
          />

          <Typography sx={{ fontWeight: 450, mt: 2 }}>Keeps...</Typography>
          <FormGroup sx={{ ml: 1 }}>
            {renderCheckboxOption('memberIds', 'Members', shouldShowOption.memberIds)}
            {renderCheckboxOption('labels', 'Labels', shouldShowOption.labels)}
            {renderCheckboxOption('dueDate', 'Dates', shouldShowOption.dueDate)}
            {renderCheckboxOption('checklists', 'Checklists', shouldShowOption.checklists)}
            {renderCheckboxOption('attachments', 'Attachments', shouldShowOption.attachments)}
            {renderCheckboxOption('location', 'Location', shouldShowOption.location)}
            {renderCheckboxOption('comments', 'Comments', shouldShowOption.comments)}
          </FormGroup>

          <Typography sx={{ fontWeight: 450, mb: 2 }}>Board</Typography>
          <AutoCompleteSearchBoard
            variant="popover"
            onBoardSelect={handleBoardSelect}
            width="100%"
          />

          <Typography sx={{ fontWeight: 450, mt: 2, mb: 1 }}>Column</Typography>
          <FormControl fullWidth error={!!errorMessage}>
            <Select
              value={selectedColumn}
              onChange={handleColumnChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Select column' }}
              disabled={columns.length === 0}
            >
              <MenuItem value="">
                <em>Select a column</em>
              </MenuItem>
              {columns.map((column) => (
                <MenuItem key={column._id} value={column._id}>
                  {column.title}
                </MenuItem>
              ))}
            </Select>
            {errorMessage && (
              <FormHelperText>{errorMessage}</FormHelperText>
            )}
          </FormControl>

          <Typography sx={{ fontWeight: 450, mt: 2, mb: 1 }}>Position</Typography>
          <FormControl fullWidth disabled={!selectedColumn}>
            <Select
              value={selectedPosition}
              onChange={handlePositionChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Select position' }}
            >
              <MenuItem value="">
                <em>Select a position</em>
              </MenuItem>
              {cardPositions.map((pos) => (
                <MenuItem key={pos.value} value={pos.value}>
                  {pos.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            color='info'
            variant="contained"
            size="small"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleCopyCard}
            disabled={!selectedBoard || !selectedColumn || selectedPosition === '' || cardTitle === ''}
          >
                        Create card
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default Copy