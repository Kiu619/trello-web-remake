import { Star, StarBorder, VpnLock } from '@mui/icons-material'
import { Box, Chip, IconButton, Tooltip, useMediaQuery } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { updateBoardDetailsAPI } from '~/apis'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { selectCurrentUser, selectStarredBoards, updateStarredBoard, updateUserAPI } from '~/redux/user/userSlice'
import { socketIoIntance } from '~/socketClient'
import { capitalizeFirstLetter } from '~/utils/formmatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import BoardMenu from './BoardMenu/BoardMenu'
import { useTheme } from '@emotion/react'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

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

const ICON_STYLE = {
  color: 'white',
  '&:hover': {
    color: 'primary.main'
  }
}

function BoardBar(props) {
  const { board } = props
  const currentUser = useSelector(selectCurrentUser)

  const isMobile = useMediaQuery('(max-width:775px)')

  const BOARD_BAR_HEIGHT = isMobile ? '100px' : '62px'

  const starredBoardsFromRedux = useSelector(selectStarredBoards) || []
  const dispatch = useDispatch()
  const isStarred = starredBoardsFromRedux.some(starredBoard => starredBoard._id === board._id)

  const onUpdateBoardTitle = (newTitle) => {
    if (newTitle !== board.title) {
      const updateData = { title: newTitle }
      updateBoardDetailsAPI(board._id, updateData)

      setTimeout(() => {
        socketIoIntance.emit('batch', { boardId: board._id })
      }, 1234)
    }
  }

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
      height: BOARD_BAR_HEIGHT,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      // flexDirection: 'row',
      // alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      borderBottom: '1px solid #00bfa5'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ToggleFocusInput
          value={board.title}
          onChangedValue={onUpdateBoardTitle}
        />
        <Tooltip title={capitalizeFirstLetter(board?.type)}>
          <Chip
            sx={MENU_STYLE}
            icon={board?.type === 'public' ? <PublicOutlinedIcon /> : <LockOutlinedIcon />}
            label={capitalizeFirstLetter(board?.type)}
            clickable
          >
          </Chip>
        </Tooltip>
        <Tooltip title='Click to star or unstar this board. Starred boards show up at the top of your boards list.'>
          <IconButton onClick={handleStarBoard} sx={ICON_STYLE}>
            {isStarred ? <Star sx={{ color: 'yellow' }} /> : <StarBorder />}
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* <InviteOtherUser board={board} /> */}
          <InviteBoardUser boardId={board._id} />
          <BoardUserGroup boardUsers={board?.FE_allUsers} />
          <BoardMenu board={board} currentUser={currentUser} />
        </Box>
      </Box>
    </Box>
  )
}

export default BoardBar
