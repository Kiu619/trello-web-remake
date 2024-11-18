import { useState, useEffect } from 'react'
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
import CardMedia from '@mui/material/CardMedia'
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
import { useDispatch } from 'react-redux'
import { clearAndHideCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import CreateBoardModal from './CreateNewBoardModal/Create'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

function BoardList() {
  // Số lượng bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
  const [boards, setBoards] = useState(null)
  // Tổng toàn bộ số lượng bản ghi boards có trong Database mà phía BE trả về để FE dùng tính toán phân trang
  const [totalBoards, setTotalBoards] = useState(null)

  const [sortBy, setSortBy] = useState('title-asc')

  const navigate = useNavigate()

  // Xử lý phân trang từ url với MUI: https://mui.com/material-ui/react-pagination/#router-integration
  const location = useLocation()
  /**
   * Parse chuỗi string search trong location về đối tượng URLSearchParams trong JavaScript
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
   */
  const query = new URLSearchParams(location.search)
  /**
   * Lấy giá trị page từ query, default sẽ là 1 nếu không tồn tại page từ url.
   */
  const page = parseInt(query.get('page') || '1', 10)

  /** Create Board Modal */
  const [openCreateBoardModal, setOpenCreateBoardModal] = useState(false)
  const handleOpenCreateBoardModal = () => setOpenCreateBoardModal(true)
  const handleCloseCreateBoardModal = () => setOpenCreateBoardModal(false)
  /** */

  useEffect(() => {
    const sortFromUrl = query.get('sort')
    if (sortFromUrl) {
      setSortBy(sortFromUrl)
    }
  }, [])

  const updateStateData = (res) => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(clearAndHideCurrentActiveCard())
    dispatch(clearAndHideCurrentActiveBoard())

    // Gọi API lấy danh sách boards ở đây...
    fetchBoardsAPI(location.search).then(updateStateData)
  }, [location.search], clearAndHideCurrentActiveCard)

  const afterCreateNewBoard = () => {
    // Gọi lại API lấy danh sách boards sau khi tạo mới board
    fetchBoardsAPI(location.search).then(updateStateData)
  }

  const handleSortChange = (event) => {
    const newSortValue = event.target.value
    setSortBy(newSortValue)

    // Update URL with sort parameter
    const currentQuery = new URLSearchParams(location.search)
    currentQuery.set('sort', newSortValue)
    if (page !== 1) currentQuery.set('page', page.toString())

    navigate(`/boards?${currentQuery.toString()}`)
  }

  const SortingControls = () => (
    <FormControl sx={{ minWidth: 200, mb: 1 }}>
      <InputLabel>Sort By</InputLabel>
      <Select
        value={sortBy}
        label="Sort By"
        onChange={handleSortChange}
      >
        <MenuItem value="title-asc">Title (A-Z)</MenuItem>
        <MenuItem value="title-desc">Title (Z-A)</MenuItem>
        <MenuItem value="createdAt-desc">Newest First</MenuItem>
        <MenuItem value="createdAt-asc">Oldest First</MenuItem>
      </Select>
    </FormControl>
  )

  // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
  if (!boards) {
    return <PageLoadingSpinner caption="Loading Boards..." />
  }




  return (
    <Container disableGutters maxWidth={false} sx={{
      bgcolor: theme => theme.palette.mode === 'dark' ? '#34495e' : '#fff',
      minHeight: '100vh',
    }}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container>
          <Grid item xs={12} sm={3}>
            <Stack direction="column" spacing={1}>
              <SidebarItem className="active">
                <SpaceDashboardIcon fontSize="small" />
                Boards
              </SidebarItem>
              <SidebarItem>
                <ListAltIcon fontSize="small" />
                Templates
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize="small" />
                Home
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="column" spacing={1}>
              {/* <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} /> */}
              <SidebarItem onClick={handleOpenCreateBoardModal}>
                <LibraryAddIcon fontSize="small" />
                Create a new board
              </SidebarItem>

            </Stack>
          </Grid>

          <Grid xs={12} sm={8.8} sx={{ ml: 1 }} >
            {/* <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Your boards:</Typography> */}


            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Your boards:
              </Typography>
              <SortingControls />
            </Box>

            {/* Trường hợp gọi API nhưng không tồn tại cái board nào trong Database trả về */}
            {boards?.length === 0 &&
              <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>No result found!</Typography>
            }

            {/* Trường hợp gọi API và có boards trong Database trả về thì render danh sách boards */}
            {boards?.length > 0 &&
              <Grid container>
                {boards.map(b =>
                  <Grid item xl={3} lg={3.8} md={5} sm={5.5} xs={10} key={b._id}>
                    <Card sx={{ width: '280px', m: 1 }}>
                      {/* Ý tưởng mở rộng về sau làm ảnh Cover cho board nhé */}
                      {/* <CardMedia component="img" height="100" image="https://picsum.photos/100" /> */}
                      <Box sx={{ height: '50px', backgroundColor: randomColor() }}></Box>

                      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                        <Typography gutterBottom variant="h6" component="div">
                          {b?.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {b?.description}
                        </Typography>
                        <Box
                          component={Link}
                          to={`/board/${b._id}`}
                          sx={{
                            mt: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            color: 'primary.main',
                            '&:hover': { color: 'primary.light' }
                          }}>
                          Go to board <ArrowRightIcon fontSize="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            }

            {/* Trường hợp gọi API và có totalBoards trong Database trả về thì render khu vực phân trang  */}
            {(totalBoards > 0) &&
              <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  page={page}
                  renderItem={(item) => {
                    // Tạo một URLSearchParams mới cho mỗi page item
                    const searchParams = new URLSearchParams()

                    // Luôn giữ lại tham số sort nếu có
                    if (sortBy) {
                      searchParams.set('sort', sortBy)
                    }

                    // Thêm tham số page nếu không phải page mặc định
                    if (item.page !== DEFAULT_PAGE) {
                      searchParams.set('page', item.page.toString())
                    }

                    // Tạo URL với các tham số
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
            }
          </Grid>
        </Grid>
      </Box>
      <CreateBoardModal 
        open={openCreateBoardModal} 
        handleClose={handleCloseCreateBoardModal} 
        afterCreateNewBoard={afterCreateNewBoard} 
      />
    </Container>
  )
}

export default BoardList
