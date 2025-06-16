import CancelIcon from '@mui/icons-material/Cancel'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewNotificationAPI } from '~/apis'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectActiveCard } from '~/redux/activeCard/activeCardSlice'
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
      justifyContent: 'space-between',
      marginTop: '8px'
    }}
    {...props}
  >
    {children}
  </Box>
)

const ChecklistItemDates = ({
  handleClosePopover,
  checklistItem,
  onUpdateChecklistItem,
  cardChecklist
}) => {
  const activeCard = useSelector(selectActiveCard)
  const currentBoard = useSelector(selectCurrentActiveBoard)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  const [selectedDate, setSelectedDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [dueDateChecked, setDueDateChecked] = useState(true)
  const [selectedTime, setSelectedTime] = useState('10:10')

  useEffect(() => {
    if (checklistItem?.dueDate) {
      const dueDateObj = new Date(checklistItem.dueDate)
      setSelectedDate(dueDateObj)
      setCurrentMonth(dueDateObj)
      setDueDateChecked(true)
      setSelectedTime(checklistItem.dueDateTime || '10:10')
    } else {
      setSelectedDate(null)
      setCurrentMonth(new Date())
      setDueDateChecked(true)
      setSelectedTime('10:10')
    }
  }, [checklistItem])

  const handlePrevMonth = () => {
    const today = new Date()
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() - 1)

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

    for (let i = startPadding - 1; i >= 0; i--) {
      const day = new Date(year, month, -i)
      days.push({ date: day, isOutsideMonth: true })
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      days.push({ date, isOutsideMonth: false })
    }

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
      const timezoneOffset = d.getTimezoneOffset() * 60000
      const localDate = new Date(d.getTime() - timezoneOffset)
      return localDate.toISOString().split('T')[0]
    } catch (e) {
      return ''
    }
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

  const handleDueTimeChange = (event) => {
    const newDueTime = event.target.value

    if (selectedDate &&
      selectedDate.toDateString() === new Date().toDateString()) {

      if (compareTime(selectedTime, newDueTime) >= 0) {
        return
      }
    }

    setSelectedTime(newDueTime)
  }

  const handleDateSelect = (date) => {
    if (!isDateDisabled(date)) {
      setSelectedDate(date)
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

  const handleSaveItemDueDate = () => {
    const incomingChecklistItemInfo = {
      checklistId: cardChecklist._id,
      itemId: checklistItem._id,
      action: 'UPDATE',
      items: cardChecklist.items,
      title: checklistItem.title,
      isChecked: checklistItem.isChecked,
      assignedTo: checklistItem.assignedTo,
      dueDate: selectedDate,
      dueDateTime: selectedTime
    }

    // nếu checklist item có assignedTo thì gửi thông báo cho user được assign
    if (checklistItem.assignedTo) {
      checklistItem.assignedTo.map(memberId => {
        createNewNotificationAPI({
          type: 'dueDateInChecklistItem',
          userId: memberId.toString(),
          details: {
            boardId: currentBoard._id,
            boardTitle: currentBoard.title,
            cardId: activeCard._id,
            cardTitle: activeCard.title,
            checklistTitle: cardChecklist.title,
            checklistItemTitle: checklistItem.title,
            senderId: currentUser._id,
            senderName: currentUser.username
          }
        }).then(() => {
          socketIoIntance.emit('FE_FETCH_NOTI', { userId: memberId.toString() })
        })
      })

      onUpdateChecklistItem(incomingChecklistItemInfo)
      handleClosePopover()
    }
  }

  const handleRemoveItemDueDate = () => {
    const incomingChecklistItemInfo = {
      checklistId: cardChecklist._id,
      itemId: checklistItem._id,
      action: 'UPDATE',
      items: cardChecklist.items,
      title: checklistItem.title,
      isChecked: checklistItem.isChecked,
      assignedTo: checklistItem.assignedTo,
      dueDate: null,
      dueDateTime: null
    }

    onUpdateChecklistItem(incomingChecklistItemInfo)
    handleClosePopover()
  }

  return (
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
        value={checklistItem?.title}
        disabled
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

        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="contained"
            color="info"
            fullWidth
            disabled={!selectedDate}
            onClick={handleSaveItemDueDate}
          >
            Save
          </Button>
          <Button onClick={handleRemoveItemDueDate} variant="text" color="error" fullWidth>
            Remove
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ChecklistItemDates