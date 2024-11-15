import ContentCopy from '@mui/icons-material/ContentCopy'
import { Box, Button, FormControl, ListItemIcon, ListItemText, MenuItem, Popover, Select, TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { copyColumnAPI, fetchBoardDetailsApi, moveColumnToDifferentBoardAPI } from '~/apis'
import AutoCompleteSearchBoard from '~/components/AppBar/SearchBoards/AutoCompleteSearchBoard'
import { clearAndHideCurrentActiveBoard, fetchBoardDetailsApiRedux } from '~/redux/activeBoard/activeBoardSlice'
import { socketIoIntance } from '~/socketClient'

function Copy({ column }) {
    // console.log('column', column)

    const [anchorEl, setAnchorEl] = useState(null)
    const openPopover = Boolean(anchorEl)
    const id = openPopover ? 'move-card-popover' : undefined

    const [selectedBoard, setSelectedBoard] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [selectedPosition, setSelectedPosition] = useState('')
    const [columnPositions, setColumnPositions] = useState([])

    const [columnTitle, setColumnTitle] = useState(column?.title)

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
                                label: `Position ${i + 1}`,
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

    const copyColumnInSameBoard = async (columnId, updateData) => {
        try {
            const res = await copyColumnAPI(columnId, updateData)
            dispatch(fetchBoardDetailsApiRedux(column.boardId))
            setTimeout(() => {
                socketIoIntance.emit('batch', { boardId: column.boardId })
            }, 1234)
            handleClosePopover()
        } catch (error) {
            console.error('Failed to copy column:', error)
        }
    }

    const hanleMoveColumn = () => {
        if (!selectedBoard || selectedPosition === '') return

        const columnId = column._id
        
        const updateData = {
            currentBoardId: column.boardId,
            newBoardId: selectedBoard._id,
            newPosition: selectedPosition,
            title: columnTitle
        }

        if (column.boardId === selectedBoard._id) {
            copyColumnInSameBoard(columnId, updateData)
        } else {
            copyColumnAPI(columnId, updateData).then((res) => {
                dispatch(clearAndHideCurrentActiveBoard())
                setTimeout(() => {
                    socketIoIntance.emit('batch', { boardId: selectedBoard._id })
                    navigate(`/board/${selectedBoard._id}`)
                }, 1200)
            }).catch((error) => {
                console.error('Failed to move card:', error)
            })
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
                            color: 'primary.main',
                        },
                    },
                }}
            >
                <ListItemIcon>
                    <ContentCopy className="move-column-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy this column</ListItemText>
            </MenuItem>

            <Popover
                id={id}
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ p: 2, width: 300 }}>
                    <Typography sx={{ fontWeight: 450, mt: 2 }}>Name</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={columnTitle}
                        autoFocus
                        onChange={(e) => setColumnTitle(e.target.value)}
                    />

                    <Typography sx={{ textAlign: 'center', width: '100%', fontSize: '30px', fontWeight: 600 }}>
                        Select destination to copy column
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
                        Copy
                    </Button>
                </Box>
            </Popover>
        </>
    )
}

export default Copy