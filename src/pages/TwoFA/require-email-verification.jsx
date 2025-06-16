import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import EmailIcon from '@mui/icons-material/Email'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { verifyAccountAPI, resendVerificationEmailAPI } from '~/apis'
import { useDispatch } from 'react-redux'
import { update2FAVerified } from '~/redux/user/userSlice'

function RequireEmailVerification({ userEmail, onVerificationSuccess }) {
  const { register, handleSubmit, setError, formState: { errors } } = useForm()
  const [isResending, setIsResending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    const { verificationCode } = data

    if (!verificationCode) {
      const errMsg = 'Please enter your verification code.'
      setError('verificationCode', { type: 'manual', message: errMsg })
      toast.error(errMsg)
      return
    }

    try {
      setIsVerifying(true)
      await verifyAccountAPI({ 
        email: userEmail, 
        token: verificationCode 
      })
      
      dispatch(update2FAVerified(true))
      toast.success('Email verified successfully!')
      onVerificationSuccess?.()
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to verify email.'
      setError('verificationCode', { type: 'manual', message: errMsg })
      toast.error(errMsg)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendVerification = async () => {
    try {
      setIsResending(true)
      await resendVerificationEmailAPI(userEmail)
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to resend verification email'
      toast.error(errMsg)
    } finally {
      setIsResending(false)
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
          <EmailIcon sx={{ color: '#27ae60' }} />
          <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#27ae60' }}>
            Email Verification Required
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, p: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '500px' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We&apos;ve sent a verification code to <strong>{userEmail}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Enter the verification code from your email and click <strong>Verify</strong> to continue.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, my: 1 }}>
            <TextField
              autoFocus
              autoComplete='off'
              label="Enter verification code..."
              type="text"
              variant="outlined"
              sx={{ minWidth: '280px' }}
              {...register('verificationCode', { required: 'Please enter your verification code.' })}
              error={!!errors.verificationCode}
              helperText={errors.verificationCode?.message}
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

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Didn&apos;t receive the email?
            </Typography>
            <Button
              variant="text"
              color="primary"
              onClick={handleResendVerification}
              disabled={isResending || isVerifying}
              sx={{ textTransform: 'none' }}
            >
              {isResending ? 'Resending...' : 'Resend verification email'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Check your spam folder if you don&apos;t see the email in your inbox.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default RequireEmailVerification 