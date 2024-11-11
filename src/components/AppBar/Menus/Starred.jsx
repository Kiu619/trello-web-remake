import { Check, ExpandMore } from '@mui/icons-material'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectCurrentUser, selectStarredBoards } from '~/redux/user/userSlice'
function Starred() {
    const starredBoardsFromRedux = useSelector(selectStarredBoards) || []
    const [starredBoards, setStarredBoards] = useState(starredBoardsFromRedux || [])
    const navigate = useNavigate()

    useEffect(() => {
        setStarredBoards(starredBoardsFromRedux)
    }, [starredBoardsFromRedux])

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleClickBoard = (boardId) => {
        navigate(`/board/${boardId}`)
        handleClose()
    }

    return (
        <Box>
            <Button
                sx={{ color: 'white' }}
                id="basic-button-starred"
                aria-controls={open ? 'basic-menu-starred' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<ExpandMore />}
            >
                Starred
            </Button>
            <Menu
                id="basic-menu-starred"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button-starred',
                }}
            >
                {
                    starredBoards.map((board, index) => (
                        <MenuItem key={index} onClick={() => handleClickBoard(board._id)}>
                            <ListItemText primary={board.title} />
                            <ListItemIcon>
                                <Check fontSize="small" />
                            </ListItemIcon>
                        </MenuItem>
                    ))
                }
            </Menu>
        </Box>
    )
}

export default Starred