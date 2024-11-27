import styled from '@emotion/styled'
import { Box } from '@mui/material'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import DoDisturbOutlinedIcon from '@mui/icons-material/DoDisturbOutlined'

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

const OpenClose = ({ column, activeCard, onUpdateOpenCloseCard }) => {

  const handleReOpenCard = () => {
    onUpdateOpenCloseCard(false)
  }

  const handleCloseCard = () => {
    onUpdateOpenCloseCard(true)
  }

  return (
    <>
      {column?.isClosed === false && activeCard?.isClosed === true && (
        <SidebarItem onClick={handleReOpenCard}>
          <RotateRightIcon />
          Re-open
        </SidebarItem>
      )}
      {column?.isClosed === false && activeCard?.isClosed === false && (
        <SidebarItem onClick={handleCloseCard}>
          <DoDisturbOutlinedIcon/>
          Close
        </SidebarItem>
      )}
      {column?.isClosed === true && (
        <SidebarItem >
          <DoDisturbOutlinedIcon />
          Column is closed
        </SidebarItem>
      )}
    </>
  )
}

export default OpenClose
