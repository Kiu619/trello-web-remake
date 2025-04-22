import { Check } from '@mui/icons-material'
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Popover } from '@mui/material'
import { useEffect, useState } from 'react'
import { fetchTemplatesAPI } from '~/apis'

const Templates = ({ anchorEl, handleClosePopover }) => {
  const [templates, setTemplates] = useState([])

  useEffect(() => {
    fetchTemplatesAPI().then((data) => {
      setTemplates(data)
    })
  }, [])

  const handleClick = () => {
    handleClosePopover()
  }
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClosePopover}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      PaperProps={{
        sx: { width: '340px', borderRadius: '8px' }
      }}
    >
        {templates.map((template, index) => (
          <Box key={index}  onClick={handleClick} sx={{cursor: 'pointer'}}>
            <List>
              <ListItem>
                <ListItemText primary={template.title} />
              </ListItem>
            </List>
            {index !== templates.length - 1 && <Divider />}
          </Box>
        ))}
    </Popover>
  )
}

export default Templates