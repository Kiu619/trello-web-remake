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

function Require2FA() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm()
  const dispatch = useDispatch()

  const onSubmit = (data) => {
    const { otpToken } = data

    if (!otpToken) {
      const errMsg = 'Please enter your code.'
      setError('otpToken', { type: 'manual', message: errMsg })
      toast.error(errMsg)
      return
    }

    verify2FA_API(otpToken).then(() => {
      dispatch(update2FAVerified(true))
      toast.success('Verify 2FA successfully!')
    }).catch((err) => {
      const errMsg = err.response?.data?.message || 'Failed to verify 2FA.'
      // setError('otpToken', { type: 'manual', message: errMsg })
    })
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
          <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#27ae60' }}>Require 2FA (Two-Factor Authentication)</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, p: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            Enter the 6-digit code and click <strong>Confirm</strong> to verify.
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, my: 1 }}>
            <TextField
              autoFocus
              autoComplete='nope'
              label="Enter your code..."
              type="text"
              variant="outlined"
              sx={{ minWidth: '280px' }}
              {...register('otpToken', { required: 'Please enter your code.' })}
              error={!!errors.otpToken}
              helperText={errors.otpToken?.message}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
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

export default Require2FA
