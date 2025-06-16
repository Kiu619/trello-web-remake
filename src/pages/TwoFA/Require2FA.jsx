import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import SecurityIcon from '@mui/icons-material/Security'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { update2FAVerified } from '~/redux/user/userSlice'
import { verify2FA_API } from '~/apis'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

function Require2FA() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm()
  const [isVerifying, setIsVerifying] = useState(false)
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    const { otpToken } = data

    if (!otpToken) {
      const errMsg = 'Please enter your OTP token.'
      setError('otpToken', { type: 'manual', message: errMsg })
      toast.error(errMsg)
      return
    }

    try {
      setIsVerifying(true)
      await verify2FA_API(otpToken)
      dispatch(update2FAVerified(true))
      toast.success('2FA verification successful!')
    } catch (err) {
      const errMsg = err.response?.data?.message || '2FA verification failed.'
      setError('otpToken', { type: 'manual', message: errMsg })
      toast.error(errMsg)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Modal
      disableScrollLock
      open={true}
      sx={{ overflowY: 'auto' }}>
      <Box sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: 'none',
        border: 'none',
        outline: 0,
        padding: '60px 20px 20px',
        margin: '0 auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{ pr: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <SecurityIcon sx={{ color: '#27ae60' }} />
          <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#27ae60' }}>
            Two-Factor Authentication (2FA)
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, p: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '500px' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Enter the 6-digit code from the Authenticator app and press <strong>Verify</strong> to continue.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, my: 1 }}>
            <TextField
              autoFocus
              autoComplete='nope'
              label="Enter 2FA code..."
              type="text"
              variant="outlined"
              sx={{ minWidth: '280px' }}
              {...register('otpToken', { required: 'Please enter your 2FA code.' })}
              error={!!errors.otpToken}
              helperText={errors.otpToken?.message}
              disabled={isVerifying}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size='large'
              disabled={isVerifying}
              sx={{ textTransform: 'none', minWidth: '120px', height: '55px', fontSize: '1em' }}
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default Require2FA
