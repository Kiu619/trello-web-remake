import styled from '@emotion/styled';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { Box, Button, Popover, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import ToggleFocusInput from '~/components/Form/ToggleFocusInput';

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

function Checklist({ onUpdateChecklist }) {

    const [newChecklist, setNewChecklist] = useState('')

    const handleAddNewChecklist = () => {
        if (newChecklist.trim() !== '') {
            const incomingChecklistInfo = {
                title: newChecklist,
                action: 'ADD'
            }
            onUpdateChecklist(incomingChecklistInfo)
            setNewChecklist('')
        }
        handleClosePopover()
    }

    const [anchorEl, setAnchorEl] = useState(null)
    // Hàm mở Popover, lưu trữ tham chiếu DOM của thành phần kích hoạt vào anchorEl
    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget)
    };

    const handleClosePopover = () => {
        setAnchorEl(null)
    };

    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'simple-popover' : undefined;

    return (
        <>
            <SidebarItem onClick={(e) => handleOpenPopover(e)}><TaskAltOutlinedIcon fontSize="small" />Checklist</SidebarItem>

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
                <Box sx={{ p: 2 }}>
                    <Typography sx={{ textAlign: 'center', width: '100%', fontSize: '30px', fontWeight: 600 }}>Add Checklist</Typography>
                    <Typography sx={{fontWeight:450}}>Title</Typography>
                    <TextField
                        fullWidth
                        variant='outlined'
                        size="small"
                        value={newChecklist}
                        onChange={(e) => setNewChecklist(e.target.value)}
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
                            }
                        }}
                    />
                    <Button onClick={handleAddNewChecklist} variant="contained" size='small' sx={{ mt: 1 }}>Add</Button>
                </Box>
            </Popover>
        </>
    );
}

export default Checklist;
