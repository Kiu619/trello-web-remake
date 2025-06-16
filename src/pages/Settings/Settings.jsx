import { Box, Button, Container, Typography } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import AppBar from '~/components/AppBar/AppBar'
import Disable2FA from '~/pages/TwoFA/Disable2FA'
import Setup2FA from '~/pages/TwoFA/Setup2FA'
import { selectCurrentUser } from '~/redux/user/userSlice'

function Settings() {
  const [openSetup2FA, setOpenSetup2FA] = useState(false)

  const [openDisable2FA, setOpenDisable2FA] = useState(false)

  const currentUser = useSelector(selectCurrentUser)
  return (
    <>
      <AppBar />
      <Box
        sx={{
          height: (theme) => `calc(100vh - ${theme.trelloCustom.appBarHeight})`,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#24303d' : '#fff')
        }}
      >
        <Box sx={{
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3
        }}>
          <Box mt={3}>
            <Typography
              sx={{
                borderRadius: 1,
                padding: 1,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#cad7e6')
              }}
              variant="h5" gutterBottom
            >
                Two-step verification
            </Typography>
            <Typography variant="body1" gutterBottom>
                Keep your account extra secure with a second login step.{' '}
            </Typography>
            {currentUser?.isRequire2fa ?
              <Button
                variant="contained"
                color="info"
                onClick={() => setOpenDisable2FA(true)}
              >
                Disable 2FA
              </Button>
              :
              <Button
                variant="contained"
                color="info"
                onClick={() => setOpenSetup2FA(true)}
              >
                Enable 2FA
              </Button>
            }
          </Box>
        </Box>
        <Setup2FA
          isOpen={openSetup2FA}
          toggleOpen={setOpenSetup2FA}
        />
        <Disable2FA
          isOpen={openDisable2FA}
          toggleOpen={setOpenDisable2FA}
        />
      </Box>
    </>
  )
}

export default Settings