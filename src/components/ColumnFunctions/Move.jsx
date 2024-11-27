import { useCallback, useEffect, useState } from 'react'
import { Popover, Select, MenuItem, FormControl, Button, Typography, Box, ListItemIcon, ListItemText } from '@mui/material'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import AutoCompleteSearchBoard from '~/components/SearchInput/AutoCompleteSearchBoard'
import { fetchBoardDetailsApi, moveColumnToDifferentBoardAPI } from '~/apis'
import { toast } from 'react-toastify'
import { clearAndHideCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Move({ column }) {
  // console.log('column', column)

  const [anchorEl, setAnchorEl] = useState(null)
  const openPopover = Boolean(anchorEl)
  const id = openPopover ? 'move-card-popover' : undefined

  const [selectedBoard, setSelectedBoard] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [columnPositions, setColumnPositions] = useState([])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleOpenPopover = useCallback((event) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClosePopover = useCallback(() => {
    setAnchorEl(null)
    setSelectedBoard(null)
    setSelectedPosition('')
    setColumnPositions([])
  }, [])

  const handlePositionChange = useCallback((event) => {
    setSelectedPosition(event.target.value)
  }, [])

  const handleBoardSelect = useCallback(async (board) => {
    setSelectedBoard(board)
  }, [])

  useEffect(() => {
    const fetchColumnPositions = async () => {
      try {
        if (selectedBoard) {
          const res = await fetchBoardDetailsApi(selectedBoard._id)
          if (res) {
            const selectedPositon = Array.from(
              { length: res.columns.length + 1 },
              (_, i) => ({
                value: i,
                label: `Position ${i + 1}`
              })
            )
            setColumnPositions(selectedPositon)
            setErrorMessage('')
          } else {
            setErrorMessage('This board has no columns')
            setColumnPositions([])
          }
        } else {
          setColumnPositions([])
        }
      } catch (error) {
        console.error('Failed to fetch board details:', error)
        setErrorMessage('Failed to fetch board details')
      }
    }

    fetchColumnPositions()
  }, [selectedBoard])

  const hanleMoveColumn = () => {
    if (!selectedBoard || selectedPosition === '') return

    const columnId = column._id
    if (column.boardId === selectedBoard._id) {
      toast.info('Same board, no need to use this function')
      handleClosePopover()
      return
    }

    const updateData = {
      currentBoardId: column.boardId,
      newBoardId: selectedBoard._id,
      newPosition: selectedPosition
    }

    console.log('Moving column to:', column, updateData)

    moveColumnToDifferentBoardAPI(columnId, updateData).then((res) => {
      console.log('Column moved successfully:', res)
      dispatch(clearAndHideCurrentActiveBoard())
      setTimeout(() => {
        navigate(`/board/${selectedBoard._id}`)
      }, 1500)
    }).catch((error) => {
      console.error('Failed to move column:', error)
    })
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
        <ListItemText>Move this column</ListItemText>
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

          <Typography sx={{ fontWeight: 450, mb: 2 }}>Board</Typography>
          <AutoCompleteSearchBoard variant="popover" onBoardSelect={handleBoardSelect} width="100%" />
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              value={selectedPosition}
              onChange={handlePositionChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Select position' }}
            >
              <MenuItem value="">
                <em>Select a position</em>
              </MenuItem>
              {columnPositions.map((pos) => (
                <MenuItem key={pos.value} value={pos.value}>
                  {pos.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            color="info"
            variant="contained"
            size="small"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!selectedBoard || selectedPosition === ''}
            onClick={hanleMoveColumn}
          >
                        Move
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default Move