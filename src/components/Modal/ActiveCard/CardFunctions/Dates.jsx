import CancelIcon from '@mui/icons-material/Cancel'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Popover,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewNotificationAPI, updateCardDetailsAPI } from '~/apis'
import { selectCurrentActiveBoard, updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { socketIoIntance } from '~/socketClient'

const CalendarHeader = ({ children, ...props }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 16px',
      '& .month-year': {
        fontWeight: 600
      }
    }}
    {...props}
  >
    {children}
  </Box>
)

const CalendarGrid = ({ children, ...props }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px',
      padding: '8px'
    }}
    {...props}
  >
    {children}
  </Box>
)

const DayCell = ({ isToday, isSelected, isOutsideMonth, isDisabled, children, ...props }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '32px',
      width: '32px',
      borderRadius: '4px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isOutsideMonth || isDisabled ? 0.5 : 1,
      backgroundColor: isSelected ? '#0052cc' : isToday ? '#5094fd' : 'transparent',
      color: isSelected ? 'white' : isDisabled ? '#999' : 'inherit',
      '&:hover': {
        backgroundColor: isDisabled ? 'transparent' : (isSelected ? '#0052cc' : '#568ee3')
      }
    }}
    {...props}
  >
    {children}
  </Box>
)

const TimePickerWrapper = ({ children, ...props }) => (
  <Box
    sx={{
      display: 'flex',
      width: '100%',
      gap: '8px',
      // alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '8px'
    }}
    {...props}
  >
    {children}
  </Box>
)

function Dates({
  anchorEl, handleClosePopover
}) {
  // const [anchorEl, setAnchorEl] = useState(null)
  const activeCard = useSelector(selectActiveCard)
  const currentBoard = useSelector(selectCurrentActiveBoard)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  const [dueDateTitle, setDueDateTitle] = useState('') // title of due date
  const [selectedDate, setSelectedDate] = useState(null) // due date
  const [startDate, setStartDate] = useState(new Date()) // start date mặc định là ngày hiện tại
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [startDateChecked, setStartDateChecked] = useState(false)
  const [dueDateChecked, setDueDateChecked] = useState(true)
  const [selectedStartTime, setSelectedStartTime] = useState('10:10')
  const [selectedTime, setSelectedTime] = useState('10:10')
  const [dayBeforeToRemind, setDayBeforeToRemind] = useState(1)
  // const [is]

  const [startDateError, setStartDateError] = useState('')
  const [startTimeError, setStartTimeError] = useState('')

  useEffect(() => {
    if (activeCard?.dueDate) {
      const {
        title: cardDueDateTitle,
        startDate: cardStartDate,
        startTime: cardStartTime,
        dueDate: cardDueDate,
        dueDateTime: cardDueTime,
        dayBeforeToRemind: cardDayBeforeToRemind
      } = activeCard.dueDate

      // Set selected date and current month view
      if (cardDueDate) {
        const dueDateObj = new Date(cardDueDate)
        setSelectedDate(dueDateObj)
        setCurrentMonth(dueDateObj)
      }

      // Set start date related states
      if (cardStartDate) {
        const startDateObj = new Date(cardStartDate)
        setStartDate(startDateObj)
        setStartDateChecked(true)
        setSelectedStartTime(cardStartTime || '10:10')
      } else {
        setStartDateChecked(false)
      }

      // Set due date related states
      if (cardDueDate) {
        setDueDateTitle(cardDueDateTitle)
        setDueDateChecked(true)
        setSelectedTime(cardDueTime || '10:10')
      } else {
        setDueDateChecked(false)
      }

      // Set day before to remind state
      setDayBeforeToRemind(cardDayBeforeToRemind || 1)
    } else {
      // Reset states if no dueDate data
      setSelectedDate(null)
      setStartDate(new Date())
      setCurrentMonth(new Date())
      setStartDateChecked(false)
      setDueDateChecked(true)
      setSelectedStartTime('10:10')
      setSelectedTime('10:10')
      setDueDateTitle('')
      setDayBeforeToRemind(1)
    }
  }, [activeCard])

  const handlePrevMonth = () => {
    const today = new Date()
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() - 1)

    // Chỉ cho phép quay lại tháng hiện tại
    if (newMonth.getMonth() >= today.getMonth() || newMonth.getFullYear() > today.getFullYear()) {
      setCurrentMonth(newMonth)
    }
  }

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth)
      newMonth.setMonth(newMonth.getMonth() + 1)
      return newMonth
    })
  }

  // Helper function để kiểm tra xem một ngày có nhỏ hơn ngày hiện tại không
  const isDateDisabled = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []
    const startPadding = firstDay.getDay()

    // Previous month padding
    for (let i = startPadding - 1; i >= 0; i--) {
      const day = new Date(year, month, -i)
      days.push({ date: day, isOutsideMonth: true })
    }

    // Current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      days.push({ date, isOutsideMonth: false })
    }

    // Next month padding
    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i)
      days.push({ date, isOutsideMonth: true })
    }

    return days
  }

  const formatDateForInput = (date) => {
    if (!date) return ''
    try {
      const d = new Date(date)
      if (isNaN(d.getTime())) {
        return ''
      }
      // Thêm timezone offset để đảm bảo ngày không bị lệch
      const timezoneOffset = d.getTimezoneOffset() * 60000 // Convert to milliseconds
      const localDate = new Date(d.getTime() - timezoneOffset)
      return localDate.toISOString().split('T')[0]
    } catch (e) {
      return ''
    }
  }

  // Validate date string
  const isValidDate = (dateString) => {
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date)
  }

  // Parse date from input and validate
  const handleStartDateChange = (event) => {
    const inputValue = event.target.value

    // Validate input date format
    if (!isValidDate(inputValue)) {
      setStartDateError('Invalid date format')
      return
    }

    const newStartDate = new Date(inputValue)

    // Validate that start date isn't after due date
    if (selectedDate && newStartDate > selectedDate) {
      setStartDateError('Start date cannot be after due date')
      return
    }

    // Validate that start date isn't before today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (newStartDate < today) {
      setStartDateError('Start date cannot be before today')
      return
    }

    // Clear error if valid
    setStartDateError('')
    setStartDate(newStartDate)
  }

  const compareTime = (time1, time2) => {
    const [hours1, minutes1] = time1.split(':').map(Number)
    const [hours2, minutes2] = time2.split(':').map(Number)

    if (hours1 > hours2) return 1
    if (hours1 < hours2) return -1
    if (minutes1 > minutes2) return 1
    if (minutes1 < minutes2) return -1
    return 0
  }

  const handleStartTimeChange = (event) => {
    const newStartTime = event.target.value

    // Kiểm tra nếu ngày bắt đầu bằng ngày kết thúc
    if (startDate && selectedDate &&
      startDate.toDateString() === selectedDate.toDateString()) {

      // So sánh thời gian
      if (compareTime(newStartTime, selectedTime) >= 0) {
        setStartTimeError('Start time must be before due time on the same day')
        return
      }
    }

    setStartTimeError('')
    setSelectedStartTime(newStartTime)
  }

  const handleDueTimeChange = (event) => {
    const newDueTime = event.target.value

    // Kiểm tra nếu ngày bắt đầu bằng ngày kết thúc
    if (startDate && selectedDate &&
      startDate.toDateString() === selectedDate.toDateString()) {

      // So sánh thời gian
      if (compareTime(selectedStartTime, newDueTime) >= 0) {
        return // Không cho phép đặt thời gian due date nhỏ hơn start time
      }
    }

    setSelectedTime(newDueTime)
  }

  // Handle input blur for additional validation
  const handleStartDateBlur = (event) => {
    const inputValue = event.target.value

    if (!inputValue) {
      setStartDateError('Start date is required')
      setStartDate(new Date()) // Reset to today if invalid
      return
    }

    if (!isValidDate(inputValue)) {
      setStartDateError('Invalid date format')
      setStartDate(new Date()) // Reset to today if invalid
      return
    }
  }

  // Update due date validation
  const handleDateSelect = (date) => {
    if (!isDateDisabled(date)) {
      // Check if new due date is valid compared to start date
      if (startDateChecked && startDate) {
        if (date < startDate) {
          return
        }

        // Nếu chọn cùng ngày, kiểm tra thời gian
        if (date.toDateString() === startDate.toDateString() &&
          compareTime(selectedStartTime, selectedTime) >= 0) {
          setStartTimeError('Start time must be before due time on the same day')
          return
        }
      }
      setSelectedDate(date)
    }
  }

  // Toggle handlers with validation
  const handleStartDateToggle = (checked) => {
    setStartDateChecked(checked)
    if (checked) {
      // When enabling start date, set it to today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      setStartDate(today)
      setStartDateError('')
    }
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const callApiUpdateCard = async (updateData) => {
    console.log('updateData', updateData)
    const res = await updateCardDetailsAPI(activeCard._id, updateData)
    console.log('res', res)

    // // Cập nhật thông tin Card mới nhất vào Redux
    dispatch(updateCurrentActiveCard(res))
    // // Cập nhật thông tin Card mới nhất vào Redux của Board
    dispatch(updateCardInBoard(res))

    // Gửi thông báo tới server thông qua socket.io
    // socketIoIntance.emit('FE_UPDATE_CARD', res)
    setTimeout(() => {
      socketIoIntance.emit('batch', { boardId: currentBoard._id })
      socketIoIntance.emit('activeCardUpdate', activeCard._id)
    }, 1234)

    return res

  }

  const onUpdateDueDate = (dueDateData) => {
    // callApiUpdateCard({ dueDate: dueDateData })
    callApiUpdateCard({ dueDate: dueDateData })
      .then(response => {
        // Xử lý notification - lọc bỏ currentUser._id
        if (activeCard?.memberIds?.length > 0) {
          const otherMembers = activeCard.memberIds.filter(memberId => memberId !== currentUser._id)

          otherMembers.forEach(memberId => {
            createNewNotificationAPI({
              type: 'dueDateInCard',
              userId: memberId,
              details: {
                boardId: currentBoard._id,
                boardTitle: currentBoard.title,
                cardId: activeCard._id,
                cardTitle: activeCard.title,
                senderId: currentUser._id,
                senderName: currentUser.username
              }
            }).then(() => {
              socketIoIntance.emit('FE_FETCH_NOTI', { userId: memberId })
            })
          })
        }
        return response
      })
  }

  const handleSaveDueDate = () => {
    let dueDateData = null
    if (startDateChecked) {
      dueDateData = {
        title: dueDateTitle,
        startDate: startDate,
        startTime: selectedStartTime,
        dueDate: selectedDate,
        dueDateTime: selectedTime,
        isComplete: activeCard?.dueDate?.isComplete || false,
        dayBeforeToRemind: dayBeforeToRemind,
        isRemind: false,
        isOverdueNotified: false
        // isOverdueNotified: activeCard?.dueDate?.isOverdueNotified || false
      }
    } else {
      dueDateData = {
        title: dueDateTitle,
        startDate: null,
        startTime: null,
        dueDate: selectedDate,
        dueDateTime: selectedTime,
        isComplete: activeCard?.dueDate?.isComplete || false,
        dayBeforeToRemind: dayBeforeToRemind,
        isRemind: false,
        isOverdueNotified: false
      }
    }
    console.log('dueDateData', dueDateData)
    onUpdateDueDate(dueDateData)
    handleClosePopover()
  }

  const handleRemoveDueDate = () => {
    let dueDateData = {
      startDate: null,
      startTime: null,
      dueDate: null,
      dueDateTime: null,
      isComplete: false,
      title: '',
      dayBeforeToRemind: 1,
      isRemind: false,
      isOverdueNotified: false
    }
    // onUpdateDueDate(dueDateData)
    callApiUpdateCard({ dueDate: dueDateData })
    handleClosePopover()
  }

  return (
    <>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        PaperProps={{
          sx: { width: '340px', borderRadius: '8px' }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Dates</Typography>
            <IconButton size="small" onClick={handleClosePopover}>
              <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            variant='outlined'
            size="small"
            placeholder='Title'
            value={dueDateTitle}
            onChange={(e) => setDueDateTitle(e.target.value)}
            sx={{
              '& label': {},
              '& .MuiOutlinedInput-root': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
                '& fieldset': { borderColor: 'primary.main' }
              },
              '& .MuiOutlinedInput-root:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
                '& fieldset': { borderColor: 'primary.main' }
              },
              '& .MuiOutlinedInput-root.Mui-focused': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
                '& fieldset': { borderColor: 'primary.main' }
              },
              '& .MuiOutlinedInput-input': {
                px: '6px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }
            }}
          />

          <CalendarHeader>
            <IconButton size="small" onClick={handlePrevMonth}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography className="month-year">
              {formatMonth(currentMonth)}
            </Typography>
            <IconButton size="small" onClick={handleNextMonth}>
              <ChevronRightIcon />
            </IconButton>
          </CalendarHeader>

          <CalendarGrid>
            {weekDays.map(day => (
              <Box key={day} sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.875rem' }}>
                {day}
              </Box>
            ))}
            {generateCalendarDays().map((day, index) => (
              <DayCell
                key={index}
                isToday={isToday(day.date)}
                isSelected={selectedDate?.toDateString() === day.date.toDateString()}
                isOutsideMonth={day.isOutsideMonth}
                isDisabled={isDateDisabled(day.date)}
                onClick={() => handleDateSelect(day.date)}
              >
                {day.date.getDate()}
              </DayCell>
            ))}
          </CalendarGrid>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Checkbox
                checked={startDateChecked}
                onChange={(e) => handleStartDateToggle(e.target.checked)}
                size="small"
              />
              <Typography>Start date</Typography>
            </Box>

            {startDateChecked && (
              <TimePickerWrapper>
                <TextField
                  type="date"
                  value={formatDateForInput(startDate)}
                  onChange={handleStartDateChange}
                  onBlur={handleStartDateBlur}
                  size="small"
                  sx={{ width: '140px' }}
                  error={!!startDateError}
                  helperText={startDateError}
                  inputProps={{
                    min: formatDateForInput(new Date())
                  }}
                />
                <TextField
                  type="time"
                  value={selectedStartTime}
                  size="small"
                  sx={{ width: '140px' }}
                  onChange={handleStartTimeChange}
                  error={!!startTimeError}
                  helperText={startTimeError}
                />
              </TimePickerWrapper>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Checkbox
                checked={dueDateChecked}
                onChange={(e) => setDueDateChecked(e.target.checked)}
                size="small"
              />
              <Typography>Due date</Typography>
            </Box>

            {dueDateChecked && (
              <TimePickerWrapper>
                <TextField
                  type="date"
                  value={formatDateForInput(selectedDate)}
                  size="small"
                  sx={{ width: '140px' }}
                  disabled
                />
                <TextField
                  type="time"
                  value={selectedTime}
                  size="small"
                  sx={{ width: '140px' }}
                  onChange={handleDueTimeChange}
                />
              </TimePickerWrapper>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 1 }}>Set due date reminder</Typography>
              <Select
                // value={reminderSetting}
                // onChange={(e) => setReminderSetting(e.target.value)}
                value={dayBeforeToRemind}
                onChange={(e) => setDayBeforeToRemind(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value='1'>1 Day before</MenuItem>
                <MenuItem value="2">2 Days before</MenuItem>
                <MenuItem value="3">3 Days before</MenuItem>
              </Select>
            </Box>

            <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
              Reminders will be sent to all members and watchers of this card.
            </Typography>

            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                color="info"
                fullWidth
                disabled={!selectedDate || !dueDateTitle}
                onClick={handleSaveDueDate}
              >
                Save
              </Button>
              <Button onClick={handleRemoveDueDate} variant="text" color="error" fullWidth>
                Remove
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  )
}

export default Dates
