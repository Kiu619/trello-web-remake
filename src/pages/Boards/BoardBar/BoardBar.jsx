import { Star, StarBorder } from '@mui/icons-material'
import DomainIcon from '@mui/icons-material/Domain'
import GroupIcon from '@mui/icons-material/Group'
import LockIcon from '@mui/icons-material/Lock'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PublicIcon from '@mui/icons-material/Public'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import { Box, Chip, IconButton, List, ListItem, ListItemIcon, ListItemText, Popover, TextField, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateBoardDetailsAPI } from '~/apis'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { selectCurrentUser, selectStarredBoards, updateStarredBoard, updateUserAPI } from '~/redux/user/userSlice'
import { socketIoIntance } from '~/socketClient'
import { capitalizeFirstLetter } from '~/utils/formmatters'
import BoardMenu from './BoardMenu/BoardMenu'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { cloneDeep } from 'lodash'

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

  // const onUpdateBoardTitle = (newTitle) => {
  //   if (newTitle !== board.title) {
  //     const updateData = { title: newTitle }
  //     updateBoardDetailsAPI(board._id, updateData)

  //     setTimeout(() => {
  //       socketIoIntance.emit('batch', { boardId: board._id })
  //     }, 1234)
  //   }
  // }

  const [inputValue, setInputValue] = useState(board.title)
  useEffect(() => {
    setInputValue(board.title)
  }, [board.title])

  const [anchorEl, setAnchorEl] = useState(null)
  const [visibility, setVisibility] = useState(board.type)

  const openPopover = Boolean(anchorEl)
  const id = openPopover ? 'copy-card-popover' : undefined

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const handleStarBoard = () => {
    const starredBoardIndex = starredBoardsFromRedux.findIndex(starredBoard => starredBoard._id === board._id)
    if (starredBoardIndex !== -1) {
      dispatch(updateStarredBoard({ board: board, forStarred: false }))
      dispatch(updateUserAPI({ boardId: board._id, forStarred: false }))
    } else {
      dispatch(updateStarredBoard({ board: board, forStarred: true }))
      dispatch(updateUserAPI({ boardId: board._id, forStarred: true }))
    }
  }

  const handleChangeVisibility = (newVisibility) => {
    if (newVisibility !== visibility) {
      setVisibility(newVisibility)
      const newBoard = cloneDeep(board)
      newBoard.type = newVisibility
      dispatch(updateCurrentActiveBoard(newBoard))

      const updateData = { type: newVisibility }
      updateBoardDetailsAPI(board._id, updateData)
      setTimeout(() => {
        socketIoIntance.emit('batch', { boardId: board._id })
      }, 1234)
      handleClosePopover()
    }
  }

  const triggerBlur = () => {
    const trimmedValue = inputValue.trim()
    setInputValue(trimmedValue)

    if (trimmedValue && trimmedValue !== board.title) {
      onUpdateBoardTitle(trimmedValue)
    }
  }

  const onUpdateBoardTitle = (newTitle) => {
    const updateData = { title: newTitle }
    updateBoardDetailsAPI(board._id, updateData)

    const newBoard = cloneDeep(board)
    newBoard.title = newTitle
    dispatch(updateCurrentActiveBoard(newBoard))

    setTimeout(() => {
      socketIoIntance.emit('batch', { boardId: board._id })
    }, 1234)
  }

  return (
    <Box sx={{
      width: '100%',
      height: BOARD_BAR_HEIGHT,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      borderBottom: '1px solid #00bfa5'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* <ToggleFocusInput
          value={board.title}
          onChangedValue={onUpdateBoardTitle}
        /> */}

        <TextField
          fullWidth
          variant='outlined'
          size="small"
          value={inputValue}
          onChange={(event) => { setInputValue(event.target.value) }}
          onBlur={triggerBlur}
          sx={{
            '& label': {},
            '& input': { fontSize: '18px', fontWeight: 'bold', color: 'white' },
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'transparent',
              '& fieldset': { borderColor: 'transparent' }
            },
            '& .MuiOutlinedInput-root:hover': {
              borderColor: 'transparent',
              '& fieldset': { borderColor: 'transparent' }
            },
            '& .MuiOutlinedInput-root.Mui-focused': {
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : '#1976d2',
              '& fieldset': { borderColor: (theme) => theme.palette.mode === 'dark' ? 'primary.main' : 'white' }
            },
            '& .MuiOutlinedInput-input': {
              px: '6px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }
          }}
        />

        <Tooltip title={capitalizeFirstLetter(visibility)}>
          <Chip
            onClick={handleOpenPopover}
            sx={MENU_STYLE}
            icon={visibility === 'public' ? <PublicOutlinedIcon /> : <LockOutlinedIcon />}
            label={capitalizeFirstLetter(visibility)}
            clickable
            disabled={board.ownerIds?.includes(currentUser?._id) ? false : true}
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
          {(board?.memberIds?.includes(currentUser?._id) || board?.ownerIds?.includes(currentUser?._id)) && (
            <InviteBoardUser board={board} />
          )}
          <BoardUserGroup boardUsers={board?.FE_allUsers} />
          <BoardMenu board={board} currentUser={currentUser} />
        </Box>
      </Box>
      <Popover
        id={id}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, fontWeight: 600 }}>
            Change visibility
          </Typography>
          <List>
            <ListItem
              sx={{
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => handleChangeVisibility('private')}
            >
              <ListItemIcon>
                <LockIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Private"
                secondary="Only board members can see this board. Admins can close the board or remove members."
              />
            </ListItem>
            <ListItem
              sx={{
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => handleChangeVisibility('public')}
            >
              <ListItemIcon>
                <PublicIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Public"
                secondary="Anyone on the internet can see this board. Only board members can edit."
              />
            </ListItem>
          </List>
        </Box>
      </Popover>
    </Box>
  )
}

export default BoardBar