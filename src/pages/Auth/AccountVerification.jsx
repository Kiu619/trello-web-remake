import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyAccountAPI } from '~/apis'

function AccountVerification() {
  // lấy email và token từ url
  let [searchParams] = useSearchParams()
  let email = searchParams.get('email')
  let token = searchParams.get('token')


  // tạo state để biết được là đã verify thành công hay chưa
  const [isVerified, setIsVerified] = useState(false)
  // Gọi API verify account
  useEffect(() => {
    if (email && token) {
      verifyAccountAPI({ email, token })
        .then(() => {
          setIsVerified(true)
        })
        .catch(() => {
          setIsVerified(false)
        })
    }
  }, [email, token])

  if (!email || !token) {
    return <Navigate to="/404" />
  }

  if (!isVerified) {
    return <PageLoadingSpinner />
  }

  return (
    <Navigate to={`/login?verifiedEmail=${email}`} />
  )
}

export default AccountVerification