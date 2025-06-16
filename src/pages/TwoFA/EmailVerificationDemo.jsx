import { useState } from 'react'
import { Box, Button, Typography, Paper } from '@mui/material'
import RequireEmailVerification from './RequireEmailVerification'

const EmailVerificationDemo = () => {
  const [showVerification, setShowVerification] = useState(false)
  const [userEmail] = useState('kiu@example.com') // Mock email

  const handleShowVerification = () => {
    setShowVerification(true)
  }

  const handleVerificationSuccess = () => {
    setShowVerification(false)
    alert('Xác thực 2FA email thành công!')
  }

  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, maxWidth: 600, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Demo Xác thực 2FA Email
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          Nhấn nút bên dưới để kiểm thử component xác thực 2FA qua email.
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Email mô phỏng: {userEmail}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleShowVerification}
          sx={{ textTransform: 'none' }}
        >
          Kiểm thử Xác thực 2FA Email
        </Button>

        {showVerification && (
          <RequireEmailVerification
            userEmail={userEmail}
            onVerificationSuccess={handleVerificationSuccess}
          />
        )}
      </Paper>
    </Box>
  )
}

export default EmailVerificationDemo 