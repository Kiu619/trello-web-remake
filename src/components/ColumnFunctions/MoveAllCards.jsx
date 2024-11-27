import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import { Box, Button, FormControl, FormHelperText, ListItemIcon, ListItemText, MenuItem, Popover, Select, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { fetchBoardDetailsApi, moveAllCardsToAnotherColumnAPI } from '~/apis'
import { fetchBoardDetailsApiRedux } from '~/redux/activeBoard/activeBoardSlice'
import { socketIoIntance } from '~/socketClient'

function MoveAllCards({ column }) {

  const [anchorEl, setAnchorEl] = useState(null)
  const openPopover = Boolean(anchorEl)
  const id = openPopover ? 'move-card-popover' : undefined

  const [errorMessage, setErrorMessage] = useState('')
  const [columns, setColumns] = useState([])
  const [selectedColumn, setSelectedColumn] = useState('')

  const dispatch = useDispatch()

  const handleOpenPopover = useCallback((event) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClosePopover = useCallback(() => {
    setAnchorEl(null)
    setSelectedColumn('')
  }, [])

  const handleColumnChange = useCallback((event) => {
    setSelectedColumn(event.target.value)
  }, [])

  useEffect(() => {
    const fetchColumn = async () => {
      try {
        const res = await fetchBoardDetailsApi(column.boardId)
        if (res) {
          if (!res.columns || res.columns.length === 0) {
            setErrorMessage('This board has no columns')
            setColumns([])
          } else {
            const filteredColumns = res.columns.filter(col => col._id !== column._id)
            setColumns(filteredColumns)
            setErrorMessage('')
          }
        }
      } catch (error) {
        setErrorMessage('Failed to fetch board details')
      }
    }

    fetchColumn()
  }, [column._id, column.boardId])


  const handleMoveAllCards = async () => {
    try {
      const newColumnId = selectedColumn
      const res = await moveAllCardsToAnotherColumnAPI(column._id, newColumnId)
      if (res) {
        dispatch(fetchBoardDetailsApiRedux(column.boardId))
        setTimeout(() => {
          socketIoIntance.emit('batch', { boardId: column.boardId })
        }, 1234)
        handleClosePopover()
      }
    }
    catch (error) {
      toast.error('Failed to move all cards')
    }
  }

  return (
    <>
      <MenuItem
        onClick={handleOpenPopover}
        sx={{
          '&:hover': {
            color: 'primary.main',
            '& .move-column-icon': {
              color: 'primary.main'
            }
          }
        }}
      >
        <ListItemIcon>
          <ArrowForwardOutlinedIcon className="move-column-icon" fontSize="small" />
        </ListItemIcon>
        <ListItemText>Move all cards</ListItemText>
      </MenuItem>

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
        <Box sx={{ p: 2, width: 300 }}>
          <Typography sx={{ textAlign: 'center', width: '100%', fontSize: '30px', fontWeight: 600 }}>
            Select destination to move column
          </Typography>

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

          <Button
            color="info"
            variant="contained"
            size="small"
            fullWidth
            sx={{ mt: 2 }}
            disabled={selectedColumn === ''}
            onClick={handleMoveAllCards}
          >
            Move
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default MoveAllCards
