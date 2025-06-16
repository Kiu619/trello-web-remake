import CancelIcon from '@mui/icons-material/Cancel'
import SecurityIcon from '@mui/icons-material/Security'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { disable2FA_API } from '~/apis'
import { updateCurrentUser } from '~/redux/user/userSlice'
import { useForm } from 'react-hook-form'

function Disable2FA({ isOpen, toggleOpen }) {
  const { register, handleSubmit, setError, formState: { errors }, reset } = useForm()
  const dispatch = useDispatch()

  const handleCloseModal = () => {
    toggleOpen(!isOpen)
    reset()
  }

  const onSubmit = (data) => {
    const { otpToken } = data

    if (!otpToken) {
      const errMsg = 'Please enter your code.'
      setError('otpToken', { type: 'manual', message: errMsg })
      toast.error(errMsg)
      return
    }

    disable2FA_API(otpToken).then((user) => {
      dispatch(updateCurrentUser(user))
      handleCloseModal()
      toast.success('Verify 2FA successfully!')
    }).catch((err) => {
      const errMsg = err.response?.data?.message || 'Failed to verify 2FA.'
      setError('otpToken', { type: 'manual', message: errMsg })
      toast.error(errMsg)
    })
  }

  return (
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

export default Disable2FA