import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import RequireEmailVerification from '~/pages/TwoFA/RequireEmailVerification'

const EmailVerificationWrapper = ({ children }) => {
  const currentUser = useSelector(selectCurrentUser)
  
  // Kiểm tra xem user có cần xác thực email không
  const needsEmailVerification = currentUser && !currentUser.isVerified
  
  const handleVerificationSuccess = () => {
    // Reload trang hoặc update user state
    window.location.reload()
  }

  if (needsEmailVerification) {
    return (
      <RequireEmailVerification 
        userEmail={currentUser.email}
        onVerificationSuccess={handleVerificationSuccess}
      />
    )
  }

  return children
}

export default EmailVerificationWrapper 