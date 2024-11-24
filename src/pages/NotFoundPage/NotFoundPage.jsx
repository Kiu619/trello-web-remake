import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import {
  Box,
  Button,
  Container,
  Grid,
  Typography
} from '@mui/material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md">
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh', textAlign: 'center', overflow: 'hidden' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            type: 'spring',
            stiffness: 120
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 200,
              color: 'primary.main',
              mb: 3,
              animation: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.6
          }}
        >
          <Typography variant="h3" gutterBottom>
            Page Not Found
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            Sorry, the page you are looking for does not exist.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.5
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/boards')}
            sx={{
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            Back to Home
          </Button>
        </motion.div>

        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            background: 'linear-gradient(45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite'
          }}
        />
      </Grid>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </Container>
  )
}

export default NotFoundPage