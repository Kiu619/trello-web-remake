/* eslint-disable react/no-unescaped-entities */
import { Box, Card, Typography } from '@mui/material'

const InvaldUrl = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'center',
        height: (theme) => `calc(100vh - ${theme.trelloCustom.appBarHeight})`,
        backgroundColor: '#1F2937'
      }}
    >
      <Card
        sx={{
          borderRadius: 2,
          mt: 10,
          height: 'fit-content',
          maxWidth: 600,
          padding: 3,
          textAlign: 'center',
          backgroundColor: '#2D3748',
          color: 'white'
        }}
      >
        {/* Title */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
            Malformed URL
        </Typography>

        {/* Description */}
        <Typography variant="body3" color="white" gutterBottom>
        The link you entered does not look like a valid Trello link. If someone gave you this link, you may need to ask them to check that it's correct.
        </Typography>
      </Card>
    </Box>
  )
}

export default InvaldUrl
