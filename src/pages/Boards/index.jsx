import { useState, useEffect, useMemo } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import randomColor from 'randomcolor'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { styled } from '@mui/material/styles'
import { fetchBoardsAPI } from '~/apis'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
import theme from '~/theme'
import { clearAndHideCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { clearAndHideCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { FormControl, InputLabel, MenuItem, Select, useTheme, useMediaQuery } from '@mui/material'
import CreateBoardModal from './CreateNewBoardModal/Create'
import { selectCurrentUser, selectIs2FAVerified } from '~/redux/user/userSlice'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#212e3d' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

// Custom styled components for responsive design
const BoardCard = styled(Card)(({ theme }) => ({
  // width: '100%',
  margin: theme.spacing(1),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
}))

const MainContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#34495e' : '#fff',
  minHeight: '100vh',
  // padding: theme.spacing(2),
  // [theme.breakpoints.down('sm')]: {
  //   padding: theme.spacing(1)
  // }
}))

const SidebarContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(2)
  }
}))

const BoardsContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(3)
  },
  [theme.breakpoints.up('lg')]: {
    paddingRight: theme.spacing(4)
  },
  [theme.breakpoints.up('xl')]: {
    paddingRight: theme.spacing(8)
  }
}))

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'flex-start'
  }
}))

function BoardList() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Sử dụng useMemo để tối ưu việc khởi tạo query object
  const query = useMemo(() => new URLSearchParams(location.search), [location.search])
  const page = useMemo(() => parseInt(query.get('page') || '1', 10), [query])

  const [boards, setBoards] = useState(null)
  const [totalBoards, setTotalBoards] = useState(null)
  const [sortBy, setSortBy] = useState('title-asc')
  const [openCreateBoardModal, setOpenCreateBoardModal] = useState(false)

  const handleOpenCreateBoardModal = () => setOpenCreateBoardModal(true)
  const handleCloseCreateBoardModal = () => setOpenCreateBoardModal(false)

  useEffect(() => {
    const sortFromUrl = query.get('sort')
    if (sortFromUrl) {
      setSortBy(sortFromUrl)
    }
  }, [query])

  const updateStateData = (res) => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
  }

  useEffect(() => {
    dispatch(clearAndHideCurrentActiveCard())
    dispatch(clearAndHideCurrentActiveBoard())
    fetchBoardsAPI(location.search).then(updateStateData)
  }, [dispatch, location.search])

  const handleSortChange = (event) => {
    const newSortValue = event.target.value
    setSortBy(newSortValue)
    const currentQuery = new URLSearchParams(location.search)
    currentQuery.set('sort', newSortValue)
    if (page !== 1) currentQuery.set('page', page.toString())
    navigate(`/boards?${currentQuery.toString()}`)
  }

  const afterCreateNewBoard = () => {
    fetchBoardsAPI(location.search).then(updateStateData)
  }

  const SortingControls = () => (
    <FormControl sx={{ minWidth: isMobile ? '100%' : 200 }}>
      <InputLabel>Sort By</InputLabel>
      <Select
        value={sortBy}
        label="Sort By"
        onChange={handleSortChange}
        fullWidth={isMobile}
      >
        <MenuItem value="title-asc">Title (A-Z)</MenuItem>
        <MenuItem value="title-desc">Title (Z-A)</MenuItem>
        <MenuItem value="createdAt-desc">Newest First</MenuItem>
        <MenuItem value="createdAt-asc">Oldest First</MenuItem>
      </Select>
    </FormControl>
  )

  if (!boards) {
    return <PageLoadingSpinner caption="Loading Boards..." />
  }

  return (
    <MainContainer disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <SidebarContainer item xs={12} md={3}>
            <Stack
              direction={isMobile ? 'row' : 'column'}
              spacing={1}
              sx={{
                overflowX: isMobile ? 'auto' : 'visible',
                pb: isMobile ? 1 : 0,
                ml: 1,
                mr: isMobile ? 0 : 1
              }}
            >
              <SidebarItem className="active">
                <SpaceDashboardIcon fontSize="small" />
                {!isMobile && 'Boards'}
              </SidebarItem>
              <SidebarItem>
                <ListAltIcon fontSize="small" />
                {!isMobile && 'Templates'}
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize="small" />
                {!isMobile && 'Home'}
              </SidebarItem>
              {!isMobile && <Divider sx={{ my: 1 }} />}
              <SidebarItem onClick={handleOpenCreateBoardModal}>
                <LibraryAddIcon fontSize="small" />
                {!isMobile && 'Create new board'}
              </SidebarItem>
            </Stack>
          </SidebarContainer>

          <BoardsContainer item xs={12} md={9}>
            <HeaderSection sx={{mx: 1}}>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                sx={{
                  fontWeight: 'bold',
                  mb: isMobile ? 1 : 0
                }}
              >
                Your boards
              </Typography>
              <SortingControls />
            </HeaderSection>

            {boards?.length === 0 && (
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 3 }}>
                No result found!
              </Typography>
            )}

            {boards?.length > 0 && (
              <Grid container spacing={2}>
                {boards.map(board => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={board._id}
                  >
                    <BoardCard>
                      <Box sx={{
                        height: '120px',
                        backgroundColor: randomColor(),
                        borderRadius: '4px 4px 0 0'
                      }} />
                      <CardContent>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            mb: 1
                          }}
                        >
                          {board.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            minHeight: '40px'
                          }}
                        >
                          {board.description}
                        </Typography>
                        <Box
                          component={Link}
                          to={`/board/${board._id}`}
                          sx={{
                            mt: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                              color: 'primary.dark',
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          Go to board <ArrowRightIcon fontSize="small" />
                        </Box>
                      </CardContent>
                    </BoardCard>
                  </Grid>
                ))}
              </Grid>
            )}

            {totalBoards > 0 && (
              <Box sx={{
                my: 3,
                display: 'flex',
                justifyContent: 'center',
                [theme.breakpoints.up('sm')]: {
                  justifyContent: 'flex-end'
                }
              }}>
                <Pagination
                  size={isMobile ? 'medium' : 'large'}
                  color="secondary"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  page={page}
                  renderItem={(item) => {
                    const searchParams = new URLSearchParams()
                    if (sortBy) {
                      searchParams.set('sort', sortBy)
                    }
                    if (item.page !== DEFAULT_PAGE) {
                      searchParams.set('page', item.page.toString())
                    }
                    const queryString = searchParams.toString()
                    const to = queryString ? `?${queryString}` : ''
                    return (
                      <PaginationItem
                        component={Link}
                        to={`/boards${to}`}
                        {...item}
                      />
                    )
                  }}
                />
              </Box>
            )}
          </BoardsContainer>
        </Grid>
      </Box>

      <CreateBoardModal
        open={openCreateBoardModal}
        handleClose={handleCloseCreateBoardModal}
        afterCreateNewBoard={afterCreateNewBoard}
      />
    </MainContainer>
  )
}

export default BoardList
