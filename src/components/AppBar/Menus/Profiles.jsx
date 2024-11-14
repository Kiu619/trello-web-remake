import { Logout, PersonAdd, Settings } from '@mui/icons-material';
import { Avatar, Box, IconButton, Tooltip } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useConfirm } from 'material-ui-confirm';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice';

function Profiles() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const confirmLogout = useConfirm()

  const navigate = useNavigate()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    confirmLogout({ title: 'Are you sure you want to logout?', confirmationText: 'Logout', confirmationButtonProps: { color: 'error' }, cancellationText: 'Cancel' })
      .then(() => {
        dispatch(logoutUserAPI())
      }).catch(() => {})
  }


  return (
    <Box>
      <Tooltip title='Account settings' >
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 30, height: 32 }} alt='kiuu' src={currentUser?.avatar} >Kiu</Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}A
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles',
        }}
      >
        <Link to='/settings/account' style={{ color: 'inherit' }}>
          <MenuItem>
            <Avatar sx={{ width: 28, height: 28, mr: 2 }} alt='kiuu' src={currentUser?.avatar} /> 
            My account
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{
          '&:hover': {
            color: 'warning.dark',
            '& .logout-icon': {
              color: 'warning.dark'
            }
          }
        }}>
          <ListItemIcon>
            <Logout className='logout-icon' fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles
