import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AddCard, Close, DeleteForever, DragHandle, ExpandMore, NoteAdd } from '@mui/icons-material';
import Cloud from '@mui/icons-material/Cloud';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentPaste from '@mui/icons-material/ContentPaste';
import { Box, Button, TextField, Tooltip } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { cloneDeep } from 'lodash';
import { useConfirm } from 'material-ui-confirm';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createNewCardAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis';
import ToggleFocusInput from '~/components/Form/ToggleFocusInput';
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice';
import ListCards from './ListCards/ListCards';

function Column(props) {
    const { column } = props
    // const openRedux = useSelector(state => state.modal.isOpen)

    const dispatch = useDispatch()
    const board = useSelector(selectCurrentActiveBoard)
    useEffect(() => {
        // const handleUpdateColumn = async (data) => {
        //     if (data.columnId === column._id) {
        //         setColumnTitle(data.columnTitle)
        //     }
        // }

        // socket.on('update_column', handleUpdateColumn)

        // // Clean up function
        // return () => {
        //     socket.off('update_column', handleUpdateColumn)
        // }
    }, []) // Empty dependency array ensures this runs once on mount and unmount

    const { attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    }
        = useSortable({
            id: column._id,
            data: { ...column, type: 'COLUMN' },
        });

    const dndKitColumnStyle = {
        // touchAction: 'none',
        transform: CSS.Translate.toString(transform),
        transition,
        height: '100%',
        opacity: isDragging ? 0.5 : 1,
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const orderedCards = (column?.cards)

    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

    const [newCardTitle, setNewCardTitle] = useState('')
    const addNewCard = async () => {
        if (!newCardTitle) {
            toast.error('Card title is required')
        }
        // Create new card object
        const newCardData = {
            title: newCardTitle,
            columnId: column._id
        }

        // Call API to add new card
        const createdCard = await createNewCardAPI({ ...newCardData, boardId: board._id })

        // const newBoard = { ...board }
        const newBoard = cloneDeep(board)
        const columnToUpdate = newBoard.columns.find(c => c._id === createdCard.columnId)
        if (columnToUpdate) {
            if (columnToUpdate.cards.some(c => c.FE_PlaceholderCard)) {
                columnToUpdate.cards = [createdCard]
                columnToUpdate.cardOrderIds = [createdCard._id]
            }
            else {
                columnToUpdate.cards.push(createdCard)
                columnToUpdate.cardOrderIds.push(createdCard._id)
            }
        }
        dispatch(updateCurrentActiveBoard(newBoard))


        // Reset form
        setNewCardTitle('')
        setOpenNewCardForm(false)
    }

    const onUpdateColumnTitle = (newTitle) => {
        // Call API to update column title
        const updateData = { title: newTitle }
        updateColumnDetailsAPI(column._id, updateData).then((res) => {
            toast.success(res?.updateResult)
        })

        // Update redux
        const newBoard = cloneDeep(board)
        const columnToUpdate = newBoard.columns.find(c => c._id === column._id)
        if (columnToUpdate) {
            columnToUpdate.title = newTitle
        }
        dispatch(updateCurrentActiveBoard(newBoard))
    }

    const confirmDeleteColumn = useConfirm()

    const handleDeleteColumn = () => {
        confirmDeleteColumn({
            title: 'Delete this column?',
            description: `This will delete the entire column "${column.title}". Are you sure?`,
        })
            .then(() => {
                // Call API to delete column
                const newBoard = cloneDeep(board)
                newBoard.columns = newBoard.columns.filter(c => c._id !== column._id)
                newBoard.columnOrderIds = newBoard.columnOrderIds.filter(cId => cId !== column._id)
                dispatch(updateCurrentActiveBoard(newBoard))


                deleteColumnDetailsAPI(column._id).then((res) => {
                    toast.success(res?.deleteResult)
                })
            })
            .catch(() => {
                // User cancel
            })
    }

    return (
        <div
            ref={setNodeRef}
            style={dndKitColumnStyle}
            {...attributes}
        >
            <Box
                {...listeners}
                sx={{
                    minWidth: '300px',
                    maxWidth: '300px',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
                    ml: 2,
                    borderRadius: '6px',
                    height: 'fit-content',
                    maxHeight: (theme) => `calc( ${theme.trelloCustom.boardContentHeight} - ${theme.spacing(5)})`,
                    overflowY: 'auto',
                }}
            >
                {/* Column Header */}
                <Box sx={{
                    height: (theme) => theme.trelloCustom.columnHeadersHeight,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <ToggleFocusInput
                        value={column?.title}
                        onChangedValue={onUpdateColumnTitle}
                        data-no-dnd='true' // Prevent DND không cho kéo cột khi click vào input
                    />
                    <Box>
                        <Tooltip title='More options'>
                            <ExpandMore sx={{ color: 'text.primary', cursor: 'pointer' }}
                                id="basic-column-dropdown"
                                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            />
                        </Tooltip>
                        <Menu
                            id="basic-menu-column-dropdown"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-column-dropdown',
                            }}
                            onClick={handleClose}
                        >
                            <MenuItem sx={{
                                '&:hover': {
                                    color: 'primary.main',
                                    '& .add-card-icon': {
                                        color: 'primary.main'
                                    }
                                }
                            }} onClick={toggleOpenNewCardForm}>
                                <ListItemIcon>
                                    <AddCard className='add-card-icon' fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Add new card</ListItemText>
                            </MenuItem>

                            <MenuItem>
                                <ListItemIcon>
                                    <ContentCut fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Cut</ListItemText>
                            </MenuItem>

                            <MenuItem>
                                <ListItemIcon>
                                    <ContentCopy fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Copy</ListItemText>
                            </MenuItem>

                            <MenuItem>
                                <ListItemIcon>
                                    <ContentPaste fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Paste</ListItemText>
                            </MenuItem>

                            <Divider />

                            <MenuItem
                                onClick={handleDeleteColumn}
                                sx={{
                                    '&:hover': {
                                        color: 'warning.dark',
                                        '& .remove-icon': {
                                            color: 'warning.dark'
                                        }
                                    }
                                }}>
                                <ListItemIcon>
                                    <DeleteForever className='remove-icon' fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Remove this column</ListItemText>
                            </MenuItem>

                            <MenuItem>
                                <ListItemIcon>
                                    <Cloud fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Archive this column</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>

                {/* Column Content */}
                <ListCards cards={orderedCards} column={column} />


                {/* Column Footer */}
                <Box sx={{
                    height: (theme) => theme.trelloCustom.columnFooterHeight,
                    p: 1
                }}>
                    {!openNewCardForm
                        ?
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Button startIcon={<AddCard />} onClick={toggleOpenNewCardForm}> Add new card</Button>
                            <Tooltip title='Drag to move'>
                                <DragHandle sx={{ cursor: 'pointer' }} />
                            </Tooltip>
                        </Box>
                        :
                        <Box sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <TextField
                                label='Enter card title'
                                type='type'
                                size='small'
                                variant='outlined'
                                autoFocus
                                data-no-dnd='true'
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                sx={{
                                    '& label': { color: 'text.primary' },
                                    '& input': {
                                        color: (theme) => theme.palette.primary.main,
                                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0')
                                    },
                                    '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                                    '& .MuiOutlined Input-root': {
                                        '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                                        '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                                        '&. Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        borderRadius: 1
                                    }
                                }}

                            />
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Button
                                    className='interceptor-loading'
                                    onClick={addNewCard}
                                    data-no-dnd='true'
                                    variant='outlined' startIcon={<NoteAdd />}
                                    sx={{
                                        color: (theme) => theme.palette.primary.main,
                                        borderColor: 'white',
                                        '&:hover': {
                                            borderColor: 'white'
                                        }
                                    }}
                                >
                                    Add
                                </Button>
                                <Close fontSize='small' onClick={toggleOpenNewCardForm} sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#white' : 'black'), cursor: 'pointer' }} />
                            </Box>
                        </Box>

                    }
                </Box>
            </Box>
        </div>
    )
}


export default Column
