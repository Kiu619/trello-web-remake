import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography, Link } from '@mui/material'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Require2FA from './Require2FA'
import RequireEmailVerification from './RequireEmailVerification'

const TwoFactorVerification = () => {
  const [verificationMethod, setVerificationMethod] = useState('2fa') // '2fa' or 'email'
  const currentUser = useSelector(selectCurrentUser)

  const toggleVerificationMethod = () => {
    setVerificationMethod(prev => prev === '2fa' ? 'email' : '2fa')
  }

  const handleVerificationSuccess = () => {
    // Reload page or redirect after verification success
    window.location.reload()
  }

  if (verificationMethod === 'email') {
    return (
      <Box>
        <RequireEmailVerification
          userEmail={currentUser?.email}
          onVerificationSuccess={handleVerificationSuccess}
        />

        {/* Toggle Link */}
        <Box sx={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 9999
        }}>
          <Typography variant="body2" color="text.secondary">
            Having issues? {' '}
            <Link
              component="button"
              onClick={toggleVerificationMethod}
              sx={{
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': { textDecoration: 'none' }
              }}
            >
              Try another way?
            </Link>
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <Require2FA />

      {/* Toggle Link */}
      <Box sx={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 9999
      }}>
        <Typography variant="body2" color="text.secondary">
          Having issues? {' '}
          <Link
            component="button"
            onClick={toggleVerificationMethod}
            sx={{
              cursor: 'pointer',
              textDecoration: 'underline',
              '&:hover': { textDecoration: 'none' }
            }}
          >
            Try another way?
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default TwoFactorVerification