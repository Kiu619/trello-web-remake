import { useSelector } from 'react-redux'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import ActiveCard from './components/Modal/ActiveCard/ActiveCard'
import AccountVerification from './pages/Auth/AccountVerification'
import Auth from './pages/Auth/Auth'
import BoardList from './pages/Boards'
import Board from './pages/Boards/_id'
import { selectCurrentUser, selectIs2FAVerified } from './redux/user/userSlice'
import MyAccount from './pages/MyAccount/MyAccount'
import Settings from './pages/Settings/Settings'
import Require2FA from './components/TwoFA/require-2fa'

const PrivateRoute = ({ user, is_2fa_verified }) => {
  if (!user) {
    return <Navigate to="/login" replace={true} />
  }
  if (user.isRequire2fa && !is_2fa_verified) {
    return <Require2FA />
  }
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  const is_2fa_verified = useSelector(selectIs2FAVerified)

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/boards" replace={true} />} />
      <Route element={<PrivateRoute user={currentUser} is_2fa_verified={is_2fa_verified} />} >
        <Route path='/board/:boardId' element={<Board />} />

        <Route path='/board/:boardId' element={<Board />}>
          {/* Nested Route for handling modals without affecting URL */}
          <Route path='card/:cardId' element={<ActiveCard />} />
        </Route>

        <Route path='/boards' element={<BoardList />} />
        <Route path='/my-account/account' element={<MyAccount />}/>
        <Route path='/my-account/security' element={<MyAccount />}/>

        <Route path='/settings' element={<Settings />} />


        {/* <Route path="/board/:boardId/card/:cardId" element={<ActiveCard />} /> */}

      </Route>
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/forgot-password" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  )
}

export default App
