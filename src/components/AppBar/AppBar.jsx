import { ExpandMore, HelpCenterOutlined, LibraryAdd, MoreVert } from '@mui/icons-material'
import AppsIcon from '@mui/icons-material/Apps'
import { Box, Button, IconButton, Menu, MenuItem, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import CreateBoardModal from '~/pages/Boards/CreateNewBoardModal/Create'
import Profiles from './Menus/Profiles'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from '../SearchInput/AutoCompleteSearchBoard'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useSelector } from 'react-redux'
import MobileSearchWrapper from '../SearchInput/MobileSearchWrapper '

function AppBar() {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width:975px)')
  const currentUser = useSelector(selectCurrentUser)

  const afterCreateNewBoardFromAppBar = (newBoard) => {
    navigate(`/board/${newBoard._id}`)
  }

  /** Create Board Modal */
  const [openCreateBoardModal, setOpenCreateBoardModal] = useState(false)
  const handleOpenCreateBoardModal = () => setOpenCreateBoardModal(true)
  const handleCloseCreateBoardModal = () => setOpenCreateBoardModal(false)
  /** */

  /** More Menu */
  const [anchorEl, setAnchorEl] = useState(null)
  const handleOpenMoreMenu = (event) => setAnchorEl(event.currentTarget)
  const handleCloseMoreMenu = () => setAnchorEl(null)
  const openMoreMenu = Boolean(anchorEl)
  /** */

  return (
    <Box px={2} sx={{
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>
              Trello
            </Typography>
          </Box>
        </Link>

        {isMobile ? (
          <>
            <Button
              sx={{ color: 'white' }}
              id="basic-button-recent"
              aria-controls="more-menu"
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleOpenMoreMenu}
              endIcon={<ExpandMore />}
            >
              More
            </Button>
            <Menu
              id="more-menu"
              anchorEl={anchorEl}
              open={openMoreMenu}
              onClose={handleCloseMoreMenu}
              MenuListProps={{
                'aria-labelledby': 'more-button'
              }}
            >
              <MenuItem>
                <Recent currentUser={currentUser} isMobile={isMobile} />
              </MenuItem>
              <MenuItem>
                <Starred currentUser={currentUser} isMobile={isMobile}/>
              </MenuItem>
              <MenuItem>
                <Templates isMobile={isMobile} />
              </MenuItem>
              <MenuItem onClick={() => { handleOpenCreateBoardModal(); handleCloseMoreMenu() }}>
                <LibraryAdd sx={{ mr: 1 }} /> Create
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Recent currentUser={currentUser} />
            <Starred currentUser={currentUser}/>
            <Templates />
            <Button
              variant='outlined'
              startIcon={<LibraryAdd />}
              onClick={handleOpenCreateBoardModal}
              sx={{ color: 'white' }}
            >
              Create
            </Button>
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <MobileSearchWrapper variant="default" />
        {/* <AutoCompleteSearchBoard variant="default" /> */}
        <ModeSelect />
        <Notifications />
        <Profiles />
      </Box>
      <CreateBoardModal
        open={openCreateBoardModal}
        handleClose={handleCloseCreateBoardModal}
        afterCreateNewBoardFromAppBar={afterCreateNewBoardFromAppBar}
      />
    </Box>
  )
}

export default AppBar