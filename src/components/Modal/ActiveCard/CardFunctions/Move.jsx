import React, { useState, useEffect } from 'react'
import { Box, Button, FormControl, FormHelperText, MenuItem, Popover, Select, Typography } from '@mui/material'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import AutoCompleteSearchBoard from '~/components/AppBar/SearchBoards/AutoCompleteSearchBoard'
import { fetchBoardDetailsApi, moveCardToDifferentBoardAPI } from '~/apis'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { clearAndHideCurrentActiveBoard, selectCurrentActiveBoard, updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useNavigate } from 'react-router-dom'
import { clearAndHideCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { toast } from 'react-toastify'

// Styled component remains the same
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

function Move({activeCard}) {
    const [anchorEl, setAnchorEl] = useState(null)
    const [columns, setColumns] = useState([])
    const [selectedColumn, setSelectedColumn] = useState('')
    const [selectedBoard, setSelectedBoard] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [selectedPosition, setSelectedPosition] = useState('')
    const [cardPositions, setCardPositions] = useState([])

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClosePopover = () => {
        setAnchorEl(null)
        // Reset all states when closing
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
            // Find selected column to get number of cards
            const selectedCol = columns.find(col => col._id === columnId)
            if (selectedCol && selectedCol.cards) {
                // Create positions array from 0 to number of cards
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
                setSelectedPosition('') // Reset position when column changes
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

    const handleMoveCard = () => {
        if (!selectedBoard || !selectedColumn || selectedPosition === '') return
        
        // TODO: Implement your move card logic here
        console.log('Moving card to:', {
            boardId: selectedBoard._id,
            columnId: selectedColumn,
            position: selectedPosition
        })

        const cardId = activeCard._id
        const updateData = {
            currentBoardId: activeCard.boardId,
            currentColumnId: activeCard.columnId,
            newBoardId: selectedBoard._id,
            newColumnId: selectedColumn,
            newPosition: selectedPosition,
        }

        if (activeCard.boardId === selectedBoard._id) {
            toast.info('Same board, no need to use this function')
            handleClosePopover()
            return
        }

        // Nếu di chuyển card trong cùng một column thì không cần gọi API
        if (activeCard.columnId === selectedColumn) {
            toast.info('Same column, no need to use this function')
            handleClosePopover()
            return
        }

        moveCardToDifferentBoardAPI(cardId, updateData).then((res) => {
            console.log('Card moved successfully:', res)
            dispatch(clearAndHideCurrentActiveBoard())
            dispatch(clearAndHideCurrentActiveCard())
            setTimeout(() => {
                navigate(`/board/${selectedBoard._id}`)
            }, 1500)
        }).catch((error) => {
            console.error('Failed to move card:', error)
        })

        
        handleClosePopover()
    }

    const openPopover = Boolean(anchorEl)
    const id = openPopover ? 'move-card-popover' : undefined

    return (
        <>
            <SidebarItem onClick={handleOpenPopover}>
                <ArrowForwardOutlinedIcon fontSize="small" />
                Move to another board
            </SidebarItem>

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
                    <Typography sx={{ textAlign: 'center', width: '100%', fontSize: '30px', fontWeight: 600 }}>
                        Select destination to move card
                    </Typography>
                    
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
                        onClick={handleMoveCard}
                        disabled={!selectedBoard || !selectedColumn || selectedPosition === ''}
                    >
                        Move
                    </Button>
                </Box>
            </Popover>
        </>
    )
}

export default Move
