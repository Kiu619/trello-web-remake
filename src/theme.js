import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const APP_BAR_HEIGHT = '58px'
const BOARD_BAR_HEIGHT = '62px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`
const COLUMN_HEADERS_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

const theme = extendTheme({
  trelloCustom: {
    appBarHeight: '58px',
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeadersHeight: COLUMN_HEADERS_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT
  },

  colorSchemes: {
    light: {
      components: {
        MuiInputLabel: {
          styleOverrides: {
            root: {
              color: 'black',
              '& .Mui-focused': {
                color: 'black'
              }
            }
          }
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              color: 'black',
              '& .Mui-focused': {
                color: 'black'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black'
              }
            }
          }
        }
      }
    },
    dark: {}
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
          }
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: '550',
          textTransform: 'none',
          borderWidth: '0.5px'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'white',
          fontSize: '0.87rem',
          '& .Mui-focused': {
            color: 'white'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': { fontSize: '0.87rem' }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: 'white',
          fontSize: '0.87rem',
          '& .Mui-focused': {
            color: 'white'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white'
          },
          '& fieldset': {
            borderWidth: '1px !important'
          }
        }
      }
    }
  }
})

export default theme