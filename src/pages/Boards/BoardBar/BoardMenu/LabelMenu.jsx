import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import { Box, Divider, Drawer, Typography } from '@mui/material'
import Label from '~/components/Label'

const LabelMenu = ({showLabel, setShowLabel }) => {

  return (
    <>
      <Drawer
        id="label"
        anchor="right"
        open={showLabel}
        onClose={() => setShowLabel(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            width: '335px',
            maxWidth: '100%'
            // position: 'relative'
          }
        }}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: 'transparent'
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, alignItems: 'center' }}>
          <Box sx={{
            position: 'absolute',
            top: '12px',
            left: '10px',
            cursor: 'pointer'
          }}>
            <ArrowBackIosNewOutlinedIcon onClick={() => setShowLabel(false)} />
          </Box>

          {/* Add the content for the "About this board" section here */}
          <Typography variant="h6">Label</Typography>
        </Box>
        <Divider />
        <Label showCheckbox={false} />
      </Drawer>
    </>
  )
}

export default LabelMenu
