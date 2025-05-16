import { useState, useRef, useEffect, memo } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { getChatbotResponse, getChatHistory } from '~/apis/chatbotApi'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Stack,
  Divider,
  InputAdornment,
  CircularProgress
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'

const ChatBox = memo(({ onClose }) => {
  const currentUser = useSelector(selectCurrentUser)
  const currentBoard = useSelector(selectCurrentActiveBoard)

  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Load chat history when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!currentBoard?._id) return

      try {
        setIsLoadingHistory(true)
        const history = await getChatHistory(currentBoard._id)

        if (history && history.length > 0) {
          // Chuyển đổi dữ liệu lịch sử chat để hiển thị trong UI
          const formattedHistory = history.map((item, index) => [
            {
              id: `user-${index}`,
              sender: 'user',
              text: item.message
            },
            {
              id: `bot-${index}`,
              sender: 'bot',
              text: item.response
            }
          ]).flat()

          setChatHistory(formattedHistory)
        } else {
          // Nếu không có lịch sử, hiển thị tin nhắn chào mừng
          setChatHistory([{
            id: 'welcome',
            sender: 'bot',
            text: 'Xin chào! Tôi có thể giúp gì cho bạn?'
          }])
        }
      } catch (error) {
        console.error('Error fetching chat history:', error)
        setChatHistory([{
          id: 'welcome',
          sender: 'bot',
          text: 'Xin chào! Tôi có thể giúp gì cho bạn?'
        }])
      } finally {
        setIsLoadingHistory(false)
      }
    }

    fetchChatHistory()
  }, [currentBoard])

  const handleSendMessage = async () => {
    if (message.trim() === '') return

    // Tạo ID duy nhất cho tin nhắn
    const userMsgId = `user-${Date.now()}`
    const botMsgId = `bot-${Date.now()}`

    // Add user message to chat history
    const newUserMessage = {
      id: userMsgId,
      sender: 'user',
      text: message
    }

    setChatHistory(prev => [...prev, newUserMessage])
    setMessage('')
    setIsLoading(true)

    try {
      // Gọi API để lấy phản hồi từ chatbot
      const botResponseText = await getChatbotResponse(message, currentBoard?._id)
      const botResponse = {
        id: botMsgId,
        sender: 'bot',
        text: botResponseText
      }
      setChatHistory(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error fetching chatbot response:', error)
      const errorMessage = {
        id: botMsgId,
        sender: 'bot',
        text: 'Đã xảy ra lỗi khi lấy phản hồi từ chatbot.'
      }
      setChatHistory(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Paper
      elevation={6}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 3,
        bgcolor: 'background.paper'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SmartToyIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Trợ lý AI</Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={onClose}
        >
          Đóng
        </Typography>
      </Box>

      <Divider />

      {/* Messages area */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflow: 'auto',
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isLoadingHistory ? 'center' : 'flex-start',
          alignItems: isLoadingHistory ? 'center' : 'stretch'
        }}
      >
        {isLoadingHistory ? (
          <CircularProgress size={40} thickness={4} />
        ) : (
          <Stack spacing={2}>
            {chatHistory.map((chat) => (
              <Box
                key={chat.id}
                sx={{
                  display: 'flex',
                  justifyContent: chat.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    maxWidth: '70%',
                    alignItems: 'flex-start'
                  }}
                >
                  {chat.sender === 'bot' && (
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        mr: 1,
                        mt: 0.5,
                        width: 32,
                        height: 32
                      }}
                    >
                      <SmartToyIcon fontSize="small" />
                    </Avatar>
                  )}

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      bgcolor: chat.sender === 'user' ? 'primary.main' : 'background.default',
                      color: chat.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {chat.text}
                    </Typography>
                  </Paper>

                  {chat.sender === 'user' && (
                    <Avatar
                      sx={{
                        bgcolor: 'secondary.main',
                        ml: 1,
                        mt: 0.5,
                        width: 32,
                        height: 32
                      }}
                      src={currentUser?.avatar}
                    >
                    </Avatar>
                  )}
                </Box>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, alignItems: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    mr: 1,
                    mt: 0.5,
                    width: 32,
                    height: 32
                  }}
                >
                  <SmartToyIcon fontSize="small" />
                </Avatar>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  ...
                  </Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Stack>
        )}
      </Box>

      <Divider />

      {/* Input area */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'background.paper'
        }}
      >
        <TextField
          fullWidth
          placeholder="Nhập tin nhắn..."
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          inputRef={inputRef}
          disabled={isLoadingHistory}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  edge="end"
                  onClick={handleSendMessage}
                  disabled={message.trim() === '' || isLoadingHistory}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3
            }
          }}
        />
      </Box>
    </Paper>
  )
})

export default ChatBox
