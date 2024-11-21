import CancelIcon from '@mui/icons-material/Cancel'
import SecurityIcon from '@mui/icons-material/Security'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { disable2FA_API } from '~/apis'
import { update2FAVerified, updateCurrentUser } from '~/redux/user/userSlice'

function Disable2FA({ isOpen, toggleOpen }) {
  const [otpToken, setConfirmOtpToken] = useState('')

  const [error, setError] = useState(null)

  const dispatch = useDispatch()

  const handleCloseModal = () => {
    toggleOpen(!isOpen)
  }

  const handleRequire2FA = () => {
    if (!otpToken) {
      const errMsg = 'Please enter your code.'
      setError(errMsg)
      toast.error(errMsg)
      return
    }
    disable2FA_API(otpToken).then((user) => {
      dispatch(updateCurrentUser(user))
      handleCloseModal()

      toast.success('Verify 2FA successfully!')
      setError(null)
    })
  }
  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '20px 30px',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white'
        }}>
          <Box sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer'
          }}>
            <CancelIcon
              color="error"
              sx={{ '&:hover': { color: 'error.light' } }}
              onClick={handleCloseModal} />
          </Box>
          <Box sx={{ pr: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <SecurityIcon sx={{ color: '#27ae60' }} />
            <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#27ae60' }}>Require 2FA (Two-Factor Authentication)</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, p: 1 }}>
            <Box sx={{ textAlign: 'center' }}>
            Nhập mã gồm 6 chữ số từ ứng dụng bảo mật của bạn và click vào <strong>Confirm</strong> để xác nhận.
            </Box>

            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, my: 1 }}>
              <TextField
                autoFocus
                autoComplete='nope'
                label="Enter your code..."
                type="text"
                variant="outlined"
                sx={{ minWidth: '280px' }}
                value={otpToken}
                onChange={(e) => setConfirmOtpToken(e.target.value)}
                error={!!error && !otpToken}
              />

              <Button
                type="button"
                variant="contained"
                color="primary"
                size='large'
                sx={{ textTransform: 'none', minWidth: '120px', height: '55px', fontSize: '1em' }}
                onClick={handleRequire2FA}
              >
              Confirm
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default Disable2FA