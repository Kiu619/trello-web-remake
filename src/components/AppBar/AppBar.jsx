
import { Close, HelpCenterOutlined, LibraryAdd, Search } from '@mui/icons-material';
import AppsIcon from '@mui/icons-material/Apps';
import { Box, Button, InputAdornment, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ModeSelect from '~/components/ModeSelect/ModeSelect';
import Profiles from './Menus/Profiles';
import Recent from './Menus/Recent';
import Starred from './Menus/Starred';
import Templates from './Menus/Templates';
import Workspaces from './Menus/Workspaces';
import Notifications from './Notifications/Notifications';
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard';


function AppBar() {
  const [searchValue, setSearchValue] = useState('');
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  // Hàm mở Popover, lưu trữ tham chiếu DOM của thành phần kích hoạt vào anchorEl
  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'simple-popover' : undefined;

  const theme = useTheme();

  return (
    <Box px={2} sx={{
      // backgroundColor: 'primary.light',
      width: '100%',
      height: (theme) => theme.trelloCustom.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      overflowY: 'hidden',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to='/boards'>
          <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
        </Link>
        <Link to='/'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}
            >
              Trello
            </Typography>
          </Box>
        </Link>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Button
            variant='outlined'
            startIcon={<LibraryAdd />}
            onClick={handleOpenCreateModal}
            sx={{ color: 'white' }}>Create</Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AutoCompleteSearchBoard />
        {/* Dark mode light mode */}
        <ModeSelect />
        
        {/* Notifications */}
        <Notifications />

        <Tooltip title='Help'>
          <HelpCenterOutlined sx={{ color: 'white' }} />
        </Tooltip>
        <Profiles />
      </Box>
      {/* <CreateNewBoardModal open={openCreateModal} handleClose={handleCloseCreateModal} /> */}
    </Box>
  )
}

export default AppBar
