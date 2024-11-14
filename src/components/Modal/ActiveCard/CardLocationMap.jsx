import { useEffect, useState } from 'react'
import { Box, Paper, Typography, IconButton, Menu, MenuItem, Button, Popover } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import NorthEastOutlinedIcon from '@mui/icons-material/NorthEastOutlined'
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Link } from 'react-router-dom'

// Fix cho marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Component để cập nhật view của map khi location thay đổi
const MapUpdater = ({ center }) => {
  const map = useMap()

  useEffect(() => {
    map.setView(center, 16)
  }, [center, map])

  return null
}

const LocationMap = ({ location, updateLocation }) => {
  const center = {
    lat: parseFloat(location?.lat || 21.0302065),
    lng: parseFloat(location?.lon || 105.7966608)
  }

  //Popover
  const [anchorEl, setAnchorEl] = useState(null)
  // Hàm mở Popover, lưu trữ tham chiếu DOM của thành phần kích hoạt vào anchorEl
  const handleOpenPopover = (event, commentId) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'simple-popover' : undefined;

  const handleRemoveLocation = () => {
    updateLocation(null)
    handleClosePopover()
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: theme => theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
      }}
    >
      {/* Header */}
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {location?.name || "155 Đ. Cầu Giấy"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {location?.display_name || "155 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội, Việt Nam"}
          </Typography>
        </Box>
        <IconButton size="small"
          LinkComponent={Link}
          to={`https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`} target="_blank"
        >
          <NorthEastOutlinedIcon sx={{
            color: 'text.secondary',
            width: 18,
          }} />
        </IconButton>
        <IconButton
          size="small"
          edge="end"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenPopover(e);
          }}
        >
          <DeleteOutlineIcon
            sx={{
              color: 'text.secondary',
              width: 18,
            }}
          />
        </IconButton>
      </Box>

      {/* Map */}
      <Box
        sx={{
          width: '100%',
          height: 200,
          position: 'relative',
          '& .leaflet-container': {
            width: '100%',
            height: '100%'
          },
          // Fix cho dark mode
          '.leaflet-tile': {
            filter: (theme) =>
              theme.palette.mode === 'dark'
                ? 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)'
                : 'none'
          },
          // Style cho zoom controls
          '.leaflet-control-zoom': {
            border: 'none',
            '& a': {
              width: '30px',
              height: '30px',
              lineHeight: '30px',
              color: (theme) => theme.palette.text.primary,
              backgroundColor: (theme) => theme.palette.background.paper,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.action.hover
              }
            },
            '& .leaflet-control-zoom-in': {
              borderTopLeftRadius: '4px',
              borderTopRightRadius: '4px'
            },
            '& .leaflet-control-zoom-out': {
              borderBottomLeftRadius: '4px',
              borderBottomRightRadius: '4px'
            }
          }
        }}
      >
        <MapContainer
          center={center}
          zoom={16}
          scrollWheelZoom={false}
          zoomControl={false} // Tắt zoom control mặc định
        >
          <ZoomControl position="bottomright" /> {/* Thêm zoom control ở vị trí mới */}
          <TileLayer
            attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center} />
          <MapUpdater center={center} />
        </MapContainer>
      </Box>

      <Popover
        id={id}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography>Remove location?</Typography>
          <Typography variant="body2" color="textSecondary">
            Removing a location is permanent. There is no undo.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClosePopover} sx={{ mr: 1 }}>Cancel</Button>
            <Button onClick={() => handleRemoveLocation()} color="error" variant="contained">
              Remove
            </Button>
          </Box>
        </Box>
      </Popover>
    </Paper>
  )
}

export default LocationMap