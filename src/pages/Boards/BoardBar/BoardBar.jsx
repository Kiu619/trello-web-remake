import { AddToDrive, Bolt, Dashboard, FilterList, Star, StarBorder, VpnLock } from '@mui/icons-material'
import { Box, Chip, Tooltip, useTheme } from '@mui/material'
import { useState } from 'react'
import { capitalizeFirstLetter } from '~/utils/formmatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, selectStarredBoards, updateStarredBoard, updateUserAPI } from '~/redux/user/userSlice'

const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar(props) {
  const { board } = props
  const currentUser = useSelector(selectCurrentUser)
  const starredBoardsFromRedux = useSelector(selectStarredBoards) || []
  const dispatch = useDispatch()
  const isStarred = starredBoardsFromRedux.some(starredBoard => starredBoard._id === board._id)

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

  const handleStarBoard = () => {
    // nếu có trong danh sách thì remove, không có thì add
    const starredBoardIndex = starredBoardsFromRedux.findIndex(starredBoard => starredBoard._id === board._id)
    if (starredBoardIndex !== -1) {
      // Nếu có trong danh sách thì remove
      dispatch(updateStarredBoard({ board: board, forStarred: false }))
      dispatch(updateUserAPI({ boardId: board._id, forStarred: false }))
    } else {
      // Nếu không có trong danh sách thì add
      dispatch(updateStarredBoard({ board: board, forStarred: true }))
      dispatch(updateUserAPI({ boardId: board._id, forStarred: true }))
    }
  }

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trelloCustom.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      borderBottom: '1px solid #00bfa5'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={board?.description}>
            <Chip
              sx={MENU_STYLE}
              icon={<Dashboard />}
              label={board?.title}
              clickable
            >
            </Chip>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={board?.type}>
            <Chip
              sx={MENU_STYLE}
              icon={<VpnLock />}
              label={capitalizeFirstLetter(board?.type)}
              clickable
            >
            </Chip>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            sx={MENU_STYLE}
            icon={<AddToDrive />}
            label='Add to GG Drive'
            clickable
          >
          </Chip>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            sx={MENU_STYLE}
            icon={<Bolt />}
            label='Automation'
            clickable
          >
          </Chip>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            sx={MENU_STYLE}
            icon={<FilterList />}
            label='Filters'
            clickable
          >
          </Chip>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            sx={{
              ...MENU_STYLE,
              '.MuiSvgIcon-root': {
                color: isStarred ? 'yellow' : 'white'
              }
            }}
            icon={isStarred ? <Star /> : <StarBorder />}
            // icon={<Star /> }
            clickable
            onClick={handleStarBoard}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* <InviteOtherUser board={board} /> */}
        <InviteBoardUser boardId={board._id}/>

        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  )
}

export default BoardBar
