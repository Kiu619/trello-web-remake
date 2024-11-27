import SearchIcon from '@mui/icons-material/Search'
import Avatar from '@mui/material/Avatar'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { createSearchParams } from 'react-router-dom'
import { fetchUsersAPI } from '~/apis'
import { useDebounceFn } from '~/customHooks/useDebounceFn'

const AutoCompleteSearchUser = ({
  onUserSelect,
  customStyles = {},
  variant = 'default',
  width = 220
}) => {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setUsers([])
    }
  }, [open])

  const handleInputSearchChange = (event) => {
    if (!event?.target) {
      return
    }

    const searchValue = event.target.value

    if (typeof searchValue !== 'string' || !searchValue.trim()) {
      setUsers([])
      return
    }

    const searchPath = `?${createSearchParams({ 'q[email]': searchValue })}`

    setLoading(true)
    fetchUsersAPI(searchPath)
      .then(response => {
        setUsers(response || [])
      })
      .catch(error => {
        setUsers([])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const debouncedHandleInputSearchChange = useDebounceFn(handleInputSearchChange, 1234)

  const handleSelectedUser = (event, selectedUser) => {
    onUserSelect(selectedUser)
  }

  const styleVariants = {
    default: {
      '& label': { color: 'white' },
      '& input': { color: 'white' },
      '& label.Mui-focused': { color: 'white' },
      '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'white' },
        '&:hover fieldset': { borderColor: 'white' },
        '&.Mui-focused fieldset': { borderColor: 'white' }
      },
      '.MuiSvgIcon-root': { color: 'white' }
    },
    popover: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'inherit' },
        '&:hover fieldset': { borderColor: 'inherit' },
        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
      }
    }
  }

  return (
    <Autocomplete
      sx={{ width, ...styleVariants[variant], ...customStyles }}
      id='asynchronous-search-user'
      noOptionsText={users === null ? 'Type email to search user...' : 'No user found!'}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={(user) => user?.email || ''}
      options={users || []}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false
        return option._id === value._id
      }}
      loading={loading}
      onInputChange={(event, value) => {
        if (event) {
          debouncedHandleInputSearchChange(event)
        }
      }}
      onChange={handleSelectedUser}
      filterOptions={(x) => x}
      renderOption={(props, user) => {
        // Destructure key from props
        const { key, ...otherProps } = props

        return (
          <Box
            component='li'
            key={key}
            {...otherProps}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                src={user.avatar}
                alt={user.displayName}
                sx={{ width: 32, height: 32 }}
              >
                {!user.avatar && (user.displayName?.charAt(0).toUpperCase() || 'U')}
              </Avatar>
              <Box>
                <Typography variant='body2' component='div'>
                  {user.displayName || 'Unnamed User'}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ color: 'text.secondary' }}
                >
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Type email to search user...'
          size='small'
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: variant === 'default' ? 'white' : 'inherit' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress
                    sx={{ color: variant === 'default' ? 'white' : 'inherit' }}
                    size={20}
                  />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}

export default AutoCompleteSearchUser
