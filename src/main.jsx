import { CssBaseline, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material'
import { GlobalStyles } from '@mui/material'
import ReactDOM from 'react-dom/client'
import { ConfirmProvider } from 'material-ui-confirm'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.jsx'
import { store } from './redux/store.js'
import theme from './theme.js'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

const persistor = persistStore(store)

// Dùng inject store để truyền store 
// Giải thích: khi app chạy thì store sẽ được truyền vào main,jsx sau đó sẽ truyền store vào authorizedAxios.js
import { injectStore } from './utils/authorizedAxios.js'
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename='/'>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider>
            <GlobalStyles styles={{
              a: { textDecoration: 'none' },
            }} />
            <CssBaseline />
            <App />
            <ToastContainer />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  // </React.StrictMode>,
)
