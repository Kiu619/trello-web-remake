import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { Avatar, Box, Button, Checkbox, Divider, Drawer, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeMembersFromBoardAPI } from '~/apis'
import { fetchBoardDetailsApiRedux } from '~/redux/activeBoard/activeBoardSlice'
import { socketIoIntance } from '~/socketClient'

const Members = ({ currentUser, board, showMembers, setShowMembers }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMembers, setFilteredMembers] = useState(board?.members || [])
  const [showCheckboxes, setShowCheckboxes] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    setFilteredMembers(
      board?.members?.filter(member =>
        member.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    )
  }, [searchTerm, board?.members])

  const handleToggleCheckboxes = () => {
    setShowCheckboxes(!showCheckboxes)
    setSelectedMembers([])
  }

  const handleSelectMember = (memberId) => {
    setSelectedMembers(prevSelected =>
      prevSelected.includes(memberId)
        ? prevSelected.filter(id => id !== memberId)
        : [...prevSelected, memberId]
    )
  }

  const handleRemoveSelectedMembers = () => {
    // Implement the logic to remove selected members
    removeMembersFromBoardAPI(board._id, selectedMembers).then((res) => {
      if (res) {
        dispatch(fetchBoardDetailsApiRedux(board._id))
        setTimeout(() => {
          socketIoIntance.emit('batch', { boardId: board._id })
        }, 1234)
      }
    })
    // Reset the state
    setShowCheckboxes(false)
    setSelectedMembers([])
  }

  return (
    <Drawer
      id="about-board"
      anchor="right"
      open={showMembers}
      onClose={() => setShowMembers(false)}
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          color: 'text.primary',
          width: '335px',
          maxWidth: '100%'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, alignItems: 'center' }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          left: '10px',
          cursor: 'pointer'
        }}>
          <ArrowBackIosNewOutlinedIcon onClick={() => setShowMembers(false)} />
        </Box>

        <Typography variant="h6">Members</Typography>
      </Box>
      <Divider />

      <Box sx={{ m: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupOutlinedIcon />
          Members
        </Box>
        {board?.isClosed === false && board?.ownerIds.includes(currentUser._id) && (
          <RemoveCircleIcon
            color='info' sx={{ cursor: 'pointer' }}
            onClick={handleToggleCheckboxes}
          />
        )}
      </Box>

      <Box sx={{ mx: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search members"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {filteredMembers.map((member, index) => (
        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2, mb: 2 }}>
            {showCheckboxes && (
              <Checkbox
                checked={selectedMembers.includes(member._id)}
                onChange={() => handleSelectMember(member._id)}
              />
            )}
            <Avatar
              src={member.avatar}
              alt={member.displayName}
              sx={{ width: 30, height: 30 }}
            >
              {!member.avatar && (member.displayName?.charAt(0).toUpperCase() || 'U')}
            </Avatar>
            <Box>
              <Typography variant='subtitle2'>
                {member.displayName || 'Unnamed User'}
              </Typography>
              <Typography
                variant='caption'
                sx={{ color: 'text.secondary' }}
              >
                @{member.username}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}

      {showCheckboxes && (
        <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleRemoveSelectedMembers}
            disabled={selectedMembers.length === 0}
            className='interceptor-loading'
          >
            Remove Selected
          </Button>
        </Box>
      )}
    </Drawer>
  )
}

export default Members
