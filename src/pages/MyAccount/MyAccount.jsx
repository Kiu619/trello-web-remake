import { useState } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import SecurityIcon from '@mui/icons-material/Security'
import PersonIcon from '@mui/icons-material/Person'
import { Link, useLocation } from 'react-router-dom'
import AccountTab from './AccountTab'
import SecurityTab from './SecurityTab'

const TABS = {
  ACCOUNT: 'account',
  SECURITY: 'security'
}

function MyAccount() {
  const location = useLocation()
  // Function đơn giản có nhiệm vụ lấy ra cái tab mặc định dựa theo url.
  const getDefaultTab = () => {
    if (location.pathname.includes(TABS.SECURITY)) return TABS.SECURITY
    return TABS.ACCOUNT
  }
  // State lưu trữ giá trị tab nào đang active
  const [activeTab, setActiveTab] = useState(getDefaultTab())

  const handleChangeTab = (event, selectedTab) => { setActiveTab(selectedTab) }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#24303d' : '#fff') }}>
          <TabList sx={{
            height: 55,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }} onChange={handleChangeTab}>
            <Tab
              label="Account"
              value={TABS.ACCOUNT}
              icon={<PersonIcon />}
              iconPosition="start"
              // Sử dụng component={Link} để chuyển hướng trang khi click vào tab
              component={Link}
              to="/my-account/account" />
            <Tab
              label="Security"
              value={TABS.SECURITY}
              icon={<SecurityIcon />}
              iconPosition="start"
              component={Link}
              to="/my-account/security" />
          </TabList>
        </Box>
        <TabPanel
          sx={{
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#24303d' : '#fff')
          }}
          value={TABS.ACCOUNT}><AccountTab /></TabPanel>
        <TabPanel
          sx={{
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#24303d' : '#fff')
          }}
          value={TABS.SECURITY}><SecurityTab /></TabPanel>
      </TabContext>
    </Container>
  )
}

export default MyAccount
