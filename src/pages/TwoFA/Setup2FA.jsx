import CancelIcon from '@mui/icons-material/Cancel'
import SecurityIcon from '@mui/icons-material/Security'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { get2FA_QRCodeAPI, setup2FA_API } from '~/apis'
import { update2FAVerified, updateCurrentUser } from '~/redux/user/userSlice'

function Setup2FA({ isOpen, toggleOpen }) {
  const [QRCodeImgUrl, setQRCodeImgUrl] = useState(null)

  const { register, handleSubmit, setError, formState: { errors }, reset } = useForm()

  useEffect(() => {
    if (isOpen) {
      get2FA_QRCodeAPI().then((res) => {
        if (res && res.QRCodeImgUrl) {
          setQRCodeImgUrl(res.QRCodeImgUrl)
        }
      })
    }
  }, [isOpen])

  const handleCloseModal = () => {
    toggleOpen(!isOpen)
    reset()
  }

  const dispatch = useDispatch()

  const onSubmit = (data) => {
    const { otpToken } = data

    if (!otpToken) {
      const errMsg = 'Please enter your otp token.'
      setError('otpToken', { type: 'manual', message: errMsg })
      toast.error(errMsg)
      return
    }

    setup2FA_API(otpToken).then((user) => {
      dispatch(updateCurrentUser(user))
      dispatch(update2FAVerified(true))
      toast.success('Setup 2FA successfully!')
      handleCloseModal()
    }).catch((err) => {
      const errMsg = err.response?.data?.message || 'Failed to setup 2FA.'
      setError('otpToken', { type: 'manual', message: errMsg })
      toast.error(errMsg)
    })
  }

  return (
    <Modal
      disableScrollLock
      open={isOpen}
      onClose={handleCloseModal}
      sx={{ overflowY: 'auto' }}>
      <Box sx={{
        position: 'relative',
        maxWidth: 700,
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '40px 20px 20px',
        margin: '120px auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <SecurityIcon sx={{ color: '#27ae60' }} />
          <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#27ae60' }}>Setup 2FA (Two-Factor Authentication)</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, p: 1 }}>
          {!QRCodeImgUrl
            ? <span>Loading...</span>
            : <img
              style={{ width: '100%', maxWidth: '250px', objectFit: 'contain' }}
              src={QRCodeImgUrl}
              alt="QR Code"
            />
          }

          <Box sx={{ textAlign: 'center' }}>
            Scan the QR code with your <strong>Google Authenticator</strong> or <strong>Authy</strong> app.<br />Then enter the 6-digit code and click <strong>Confirm</strong> to verify.
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, my: 1 }}>
            <TextField
              autoFocus
              autoComplete='nope'
              label="Enter your code..."
              type="text"
              variant="outlined"
              sx={{ minWidth: '280px' }}
              {...register('otpToken', { required: 'Please enter your otp token.' })}
              error={!!errors.otpToken}
              helperText={errors.otpToken?.message}
            />

            <Button
              type="submit"
              variant="contained"
              color="info"
              size='large'
              sx={{ textTransform: 'none', minWidth: '120px', height: '55px', fontSize: '1em' }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default Setup2FA
