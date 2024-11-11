import { Box } from '@mui/material';
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Check, ExpandMore } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectRecentBoards } from '~/redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

function Recent() {
    const recentBoardsFromRedux = useSelector(selectRecentBoards) || []
    const [recentBoards, setRecentBoards] = useState(recentBoardsFromRedux || [])
    const navigate = useNavigate()

    useEffect(() => {
        setRecentBoards(recentBoardsFromRedux)
    }, [recentBoardsFromRedux])

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <Box>
            <Button
                sx={{color:'white'}}
                id="basic-button-recent"
                aria-controls={open ? 'basic-menu-recent' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<ExpandMore />}
            >
                Recent
            </Button>
            <Menu
                id="basic-menu-recent"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button-recent',
                }}
            >
                {
                    recentBoards.map((board, index) => (
                        <MenuItem key={index} onClick={() => navigate(`/board/${board._id}`)}>
                            <ListItemText primary={board.title} />
                        </MenuItem>
                    ))
                }
            </Menu>
        </Box>
    )
}

export default Recent
