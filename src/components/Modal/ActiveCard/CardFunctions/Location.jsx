import { useState, useCallback, useRef, useEffect } from 'react'
import {
    Box,
    TextField,
    Typography,
    Popover,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    styled
} from '@mui/material'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'

const SidebarItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
    backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
    padding: '10px',
    borderRadius: '4px',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
        '&.active': {
            color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
            backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
        }
    }
}))

const SearchTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : 'white',
        '& fieldset': {
            borderColor: theme.palette.primary.main
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main
        }
    },
    '& .MuiOutlinedInput-input': {
        padding: '8px 14px',
        paddingLeft: '40px'
    }
}))

// Tạo cache để lưu kết quả tìm kiếm
const searchCache = new Map()

const LocationSearch = ({ updateLocation }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [locations, setLocations] = useState([])
    const [anchorEl, setAnchorEl] = useState(null)
    const [loading, setLoading] = useState(false)

    // Sử dụng useRef để lưu trữ timeout ID
    const searchTimeoutRef = useRef(null)

    const handleOpenPopover = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClosePopover = () => {
        setAnchorEl(null)
        setLocations([])
        setSearchQuery('')
    }

    const searchLocations = useCallback(async (query) => {
        if (query.length < 3) {
            setLocations([])
            return
        }

        // Kiểm tra cache trước
        if (searchCache.has(query)) {
            setLocations(searchCache.get(query))
            return
        }

        setLoading(true)
        try {
            const params = new URLSearchParams({
                format: 'json',
                q: query,
                countrycodes: 'vn',
                limit: '5',
            })

            const response = await fetch(`/api/location?${params}`, {
                headers: {
                    'Accept-Language': 'vi',
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            // Lưu vào cache
            searchCache.set(query, data)
            setLocations(data)
        } catch (error) {
            console.error('Error fetching locations:', error)
            setLocations([])
        } finally {
            setLoading(false)
        }
    }, [])

    const handleSearchChange = (event) => {
        const value = event.target.value
        setSearchQuery(value)

        // Clear timeout cũ nếu có
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        // Set timeout mới và lưu ID vào ref
        searchTimeoutRef.current = setTimeout(() => {
            searchLocations(value)
        }, 500)
    }

    // Cleanup timeout khi component unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [])

    const handleLocationSelect = (location) => {
        updateLocation(location)
        handleClosePopover()
    }

    const openPopover = Boolean(anchorEl)
    const id = openPopover ? 'location-popover' : undefined

    return (
        <>
            <SidebarItem onClick={handleOpenPopover}>
                <LocationOnOutlinedIcon fontSize="small" />
                Location
            </SidebarItem>


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
                <Box sx={{ width: 320, p: 2 }}>
                    <Typography sx={{
                        textAlign: 'center',
                        fontSize: '24px',
                        fontWeight: 600,
                        mb: 2
                    }}>
                        Change Location
                    </Typography>

                    <Box sx={{ position: 'relative', mb: 2 }}>
                        <SearchTextField
                            fullWidth
                            size="small"
                            placeholder="Search location..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ position: 'absolute', left: 8 }}>
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                endAdornment: loading && (
                                    <InputAdornment position="end">
                                        <CircularProgress size={20} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>

                    <List sx={{
                        maxHeight: 300,
                        overflow: 'auto',
                        '& .MuiListItem-root': {
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                            }
                        }
                    }}>
                        {locations.map((location) => (
                            <ListItem
                                key={location.place_id}
                                onClick={() => handleLocationSelect(location)}
                                button
                                sx={{ mb: 0.5 }}
                            >
                                <ListItemText
                                    primary={location.display_name}
                                    primaryTypographyProps={{
                                        fontSize: '14px'
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Popover>
        </>
    )
}

export default LocationSearch