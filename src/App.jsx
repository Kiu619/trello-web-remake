import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth/Auth'
import BoardList from './pages/Boards'
import Board from './pages/Boards/_id'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/user/userSlice'
import Settings from './pages/Settings/Settings'

const PrivateRoute = ({user}) => {
  if (!user) {
    return <Navigate to="/login" replace={true} />
  }
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/boards" replace={true} />} />
      <Route element={<PrivateRoute user={currentUser} />} >
        <Route path='/board/:boardId' element={<Board />} />
        <Route path='/boards' element={<BoardList />} />
        <Route path='/settings/account' element={<Settings />}/>
        <Route path='/settings/security' element={<Settings />}/>
      </Route>
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  )
}

export default App
