import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { fetchBoardsAPI } from '~/apis';
import { useDebounceFn } from '~/customHooks/useDebounceFn';

const AutoCompleteSearchBoard = ({ 
  onBoardSelect,
  customStyles = {},
  variant = 'default',
  width = 220
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setBoards([]);
    }
  }, [open]);

  const handleInputSearchChange = (event) => {
    // Kiểm tra xem event có phải là sự kiện input hay không
    if (!event?.target) {
      return;
    }

    const searchValue = event.target.value;
    
    // Kiểm tra searchValue là string trước khi gọi trim()
    if (typeof searchValue !== 'string' || !searchValue.trim()) {
      setBoards([]);
      return;
    }

    const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`;

    setLoading(true);
    fetchBoardsAPI(searchPath)
      .then(response => {
        setBoards(response.boards || []);
      })
      .catch(error => {
        console.error('Error fetching boards:', error);
        setBoards([]);
      })
      .finally(() => { 
        setLoading(false);
      });
  };

  const debouncedHandleInputSearchChange = useDebounceFn(handleInputSearchChange, 1234);

  const handleSelectedBoard = (event, selectedBoard) => {
    if (selectedBoard) {
      if (onBoardSelect) {
        onBoardSelect(selectedBoard);
      } else {
        navigate(`/board/${selectedBoard._id}`);
      }
    }
  };

  // Define style variants
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
  };

  return (
    <Autocomplete
      sx={{ width, ...styleVariants[variant], ...customStyles }}
      id="asynchronous-search-board"
      noOptionsText={boards === null ? 'Type to search board...' : 'No board found!'}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={(board) => board?.title || ''}
      options={boards || []}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option._id === value._id;
      }}
      loading={loading}
      onInputChange={(event, value) => {
        if (event) {
          debouncedHandleInputSearchChange(event);
        }
      }}
      onChange={handleSelectedBoard}
      filterOptions={(x) => x}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Type to search..."
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: variant === 'default' ? 'white' : 'inherit' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress sx={{ color: variant === 'default' ? 'white' : 'inherit' }} size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  );
};

export default AutoCompleteSearchBoard;