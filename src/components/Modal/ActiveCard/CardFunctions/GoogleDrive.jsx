import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Popover,
  styled,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  attachGoogleDriveFileToCardAPI,
  disconnectGoogleDriveAPI,
  getGoogleDriveAuthUrlAPI,
  getGoogleDriveConnectionStatusAPI
} from '~/apis'
import { selectActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import GoogleDrivePicker from './GoogleDrivePicker'
import { toast } from 'react-toastify'

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

const MenuOption = styled(ListItem)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: '4px',
  margin: '2px 0',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : '#f4f5f7'
  }
}))

const GoogleDrive = ({ onAttachFile, onAttachFolder }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('')
  const [filePickerOpen, setFilePickerOpen] = useState(false)
  const [folderPickerOpen, setFolderPickerOpen] = useState(false)
  const [accessToken, setAccessToken] = useState(null)

  const activeCard = useSelector(selectActiveCard)
  const dispatch = useDispatch()

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget)
    checkGoogleDriveConnection()
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
    setError('')
  }

  const openPopover = Boolean(anchorEl)
  const id = openPopover ? 'google-drive-popover' : undefined

  // Kiểm tra kết nối Google Drive
  const checkGoogleDriveConnection = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await getGoogleDriveConnectionStatusAPI()
      setIsConnected(response.connected)
      console.log(response)
      
      if (response.connected && response.tokens.access_token) {
        setAccessToken(response.tokens.access_token)
      }
      
      if (!response.connected && response.reason) {
        console.log('Google Drive connection status:', response.reason)
      }
    } catch (error) {
      console.error('Error checking Google Drive connection:', error)
      setError('Lỗi khi kiểm tra kết nối Google Drive')
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }

  // Kết nối Google Drive
  const handleConnectGoogleDrive = async () => {
    try {
      setLoading(true)
      const { authUrl } = await getGoogleDriveAuthUrlAPI()

      // Mở popup để user authorize
      const popup = window.open(
        authUrl,
        'google-drive-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes,top=' + (window.innerHeight / 2 - 300) + ',left=' + (window.innerWidth / 2 - 250)
      )

      // Lắng nghe khi popup đóng
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          // Thử kiểm tra kết nối lại sau khi authorize
          setTimeout(() => {
            checkGoogleDriveConnection()
          }, 1000)
        }
      }, 1000)
    } catch (error) {
      console.error('Error connecting to Google Drive:', error)
      setError('Lỗi khi kết nối Google Drive')
    } finally {
      setLoading(false)
    }
  }

  // Ngắt kết nối Google Drive
  const handleDisconnectGoogleDrive = async () => {
    try {
      setLoading(true)
      await disconnectGoogleDriveAPI()
      setIsConnected(false)
      setError('')
    } catch (error) {
      console.error('Error disconnecting Google Drive:', error)
      setError('Lỗi khi ngắt kết nối Google Drive')
    } finally {
      setLoading(false)
    }
  }

  // Xử lý attach file
  const handleAttachFile = () => {
    setFilePickerOpen(true)
    handleClosePopover()
  }

  // Xử lý attach folder
  const handleAttachFolder = () => {
    setFolderPickerOpen(true)
    handleClosePopover()
  }

  const handleFilesSelected = async (files) => {
    try {
      // Attach files vào card
      for (const file of files) {
        const res = await attachGoogleDriveFileToCardAPI(activeCard._id, file.id)
        if (res.message && res.card) {
          toast.success(res.message)
          dispatch(updateCurrentActiveCard(res.card))
        } else {
          toast.error('Failed to attach file!')
        }
      }

      if (onAttachFile) {
        onAttachFile(files)
      }
    } catch (error) {
      console.error('Error attaching files:', error)
    }
  }

  const handleFoldersSelected = async (folders) => {
    if (onAttachFolder) {
      onAttachFolder(folders)
    }
  }

  return (
    <>
      <SidebarItem onClick={handleOpenPopover}>
        <AddToDriveOutlinedIcon fontSize="small" />
        Google Drive
      </SidebarItem>

      <Popover
        id={id}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: 'transparent'
            }
          }
        }}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography sx={{
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 600,
            mb: 2,
            color: 'text.primary'
          }}>
            Google Drive
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: '14px' }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 3
            }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Đang kiểm tra kết nối...
              </Typography>
            </Box>
          ) : !isConnected ? (
            // Chưa kết nối Google Drive
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Kết nối tài khoản Google của bạn để attach files từ Google Drive
              </Typography>

              <Button
                variant="contained"
                onClick={handleConnectGoogleDrive}
                disabled={loading}
                sx={{
                  backgroundColor: '#4285f4',
                  '&:hover': {
                    backgroundColor: '#3367d6'
                  }
                }}
              >
                Kết nối Google Drive
              </Button>
            </Box>
          ) : (
            // Đã kết nối - hiển thị menu options
            <Box>
              <List>
                <MenuOption onClick={handleAttachFile}>
                  <ListItemText
                    primary="Attach a File"
                    primaryTypographyProps={{ fontSize: '14px' }}
                  />
                </MenuOption>

                <MenuOption onClick={handleAttachFolder}>
                  <ListItemText
                    primary="Attach a Folder"
                    primaryTypographyProps={{ fontSize: '14px' }}
                  />
                </MenuOption>
              </List>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Đã kết nối
                </Typography>

                <Button
                  size="small"
                  startIcon={<LinkOffIcon />}
                  onClick={handleDisconnectGoogleDrive}
                  sx={{
                    fontSize: '12px',
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'error.main'
                    }
                  }}
                >
                  Ngắt kết nối
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Popover>

      {/* Google Drive Picker */}
      <GoogleDrivePicker
        open={filePickerOpen}
        onClose={() => setFilePickerOpen(false)}
        onFilesSelected={handleFilesSelected}
        accessToken={accessToken}
        mode="file"
      />

      <GoogleDrivePicker
        open={folderPickerOpen}
        onClose={() => setFolderPickerOpen(false)}
        onFilesSelected={handleFoldersSelected}
        accessToken={accessToken}
        mode="folder"
      />
    </>
  )
}

export default GoogleDrive
