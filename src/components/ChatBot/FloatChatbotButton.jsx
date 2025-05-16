import { Fab } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import { memo, useState } from 'react'
import Box from '@mui/material/Box'
import ChatBox from './ChatBox'

const FloatChatbotButton = memo(() => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleOpenChat = () => setIsChatOpen(true)
  const handleCloseChat = () => setIsChatOpen(false)

  return (
    <>
      <Fab
        size="medium"
        color="secondary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 2000
        }}
        onClick={handleOpenChat}
      >
        <ChatIcon />
      </Fab>

      {isChatOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            width: 350,
            height: 500,
            zIndex: 99999,
          }}
        >
          <ChatBox onClose={handleCloseChat} />
        </Box>
      )}
    </>
  )
})

export default FloatChatbotButton
