import { Box } from '@mui/material'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Check, ExpandMore } from '@mui/icons-material'
import Templates from '~/components/Templates/Templates'

function MenuTemplates({ isMobile }) {
  // Template Popover
  const [templateAnchorEl, setTemplateAnchorEl] = useState(null)
  const handleCloseTemplatePopover = () => { setTemplateAnchorEl(null) }

  const handleClick = (event) => {
    setTemplateAnchorEl(event.currentTarget)
  }
  return (
    <Box>
      <Button
        sx={{ color: isMobile ? theme => theme.palette.text.primary : 'white' }}
        id="basic-button-templates"
        onClick={handleClick}
        endIcon={<ExpandMore />}
      >
        Templates
      </Button>
      <Templates anchorEl={templateAnchorEl} handleClosePopover={handleCloseTemplatePopover} />
    </Box>
  )
}

export default MenuTemplates
