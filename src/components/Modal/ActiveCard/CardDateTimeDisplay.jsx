import {
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material'
import { Box, Button, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { useEffect } from 'react'
import { createNewNotificationAPI } from '~/apis'
import { socketIoIntance } from '~/socketClient'

const DateTimeDisplay = ({ currentUser, currentBoard, column, activeCard, title, startDate, startTime, dueDate, dueDateTime, isComplete, dayBeforeToRemind, isRemind, isOverdueNotified, handleOpenDatePopover, onUpdateDueDate }) => {

  // Nếu ngày hiện tại bằng số ngày trước khi nhắc nhở thì gửi thông báo
  useEffect(() => {
    if (activeCard?.dueDate) {
      const { dayBeforeToRemind, dueDate, dueDateTime } = activeCard.dueDate

      if (dueDate && dayBeforeToRemind && isRemind === false) {
        const dueDateObj = new Date(dueDate)
        const [hours, minutes] = dueDateTime.split(':')
        dueDateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0)

        const reminderDate = new Date(dueDateObj)
        reminderDate.setDate(dueDateObj.getDate() - dayBeforeToRemind)

        // Send reminder notification
        if (new Date().toDateString() === reminderDate.toDateString()) {
          const dueDateData = {
            startDate: startDate,
            startTime: startTime,
            dueDate: dueDate,
            dueDateTime: dueDateTime,
            isComplete: isComplete,
            title: title,
            dayBeforeToRemind: dayBeforeToRemind,
            isRemind: true,
            isOverdueNotified: isOverdueNotified
          }
          onUpdateDueDate(dueDateData)

          const otherMembers = activeCard.memberIds.filter(memberId => memberId !== currentUser._id)

          otherMembers.forEach(memberId => {
            createNewNotificationAPI({
              type: 'dueDateReminder',
              userId: memberId,
              details: {
                boardId: currentBoard._id,
                boardTitle: currentBoard.title,
                cardId: activeCard._id,
                cardTitle: activeCard.title
              }
            }).then(() => {
              socketIoIntance.emit('FE_FETCH_NOTI', { userId: memberId })
            })
          })
        }
      }

      // Check if overdue and send notification
      if (dueDate && dueDateTime && isOverdueNotified === false) {
        const dueDateObj = new Date(dueDate)
        const [hours, minutes] = dueDateTime.split(':')
        dueDateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0)

        if (dueDateObj < new Date()) {
          const dueDateData = {
            startDate: startDate,
            startTime: startTime,
            dueDate: dueDate,
            dueDateTime: dueDateTime,
            isComplete: isComplete,
            title: title,
            dayBeforeToRemind: dayBeforeToRemind,
            isRemind: isRemind,
            isOverdueNotified: true
          }
          onUpdateDueDate(dueDateData)

          const otherMembers = activeCard.memberIds.filter(memberId => memberId !== currentUser._id)

          otherMembers.forEach(memberId => {
            createNewNotificationAPI({
              type: 'dueDateOverdue',
              userId: memberId,
              details: {
                boardId: currentBoard._id,
                boardTitle: currentBoard.title,
                cardId: activeCard._id,
                cardTitle: activeCard.title
              }
            }).then(() => {
              socketIoIntance.emit('FE_FETCH_NOTI', { userId: memberId })
            })
          })
        }
      }
    }
  }, [activeCard])

  const formatDateTime = (startDate, startTime) => {
    if (!startDate || !startTime) return ''

    const date = new Date(startDate)
    const [hours, minutes] = startTime.split(':')

    // Lấy năm hiện tại
    const currentYear = new Date().getFullYear()

    // Kiểm tra nếu năm của ngày là năm hiện tại
    const options = {
      month: 'short',
      day: 'numeric'
    }
    if (date.getFullYear() !== currentYear) {
      options.year = 'numeric'
    }

    // Format date
    const formattedDate = date.toLocaleDateString('en-US', options)

    // Convert hours to 12-hour format and determine AM/PM
    let hour = parseInt(hours)
    const period = hour >= 12 ? 'PM' : 'AM'
    hour = hour % 12 || 12 // Convert to 12-hour format

    // Format time to "10:10 PM"
    const formattedTime = `${hour}:${minutes} ${period}`

    return `${formattedDate}, ${formattedTime}`
  }

  const handleCheckboxChange = (event) => {
    let dueDateData = null
    dueDateData = {
      startDate: startDate,
      startTime: startTime,
      dueDate: dueDate,
      dueDateTime: dueDateTime,
      isComplete: event.target.checked,
      title: activeCard?.dueDate?.title,
      dayBeforeToRemind: dayBeforeToRemind,
      isRemind: isRemind,
      isOverdueNotified: isOverdueNotified
    }
    onUpdateDueDate(dueDateData)
  }

  const isOverdue = () => {
    if (!dueDate || !dueDateTime) return false

    // Parse dueDate to remove timezone
    const dueDateObj = new Date(dueDate)
    const [hours, minutes] = dueDateTime.split(':')

    // Set hours and minutes for the due date
    dueDateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    // Compare with current date
    return dueDateObj < new Date()
  }

  return (
    <>
      <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Due Date: {title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          sx={{}}
          control={
            <Checkbox
              disabled={activeCard?.isClosed === true || column?.isClosed === true || (!currentBoard?.memberIds?.includes(currentUser?._id) && !currentBoard?.ownerIds?.includes(currentUser?._id))}
              checked={isComplete}
              onChange={handleCheckboxChange}
            />
          }
        />
        <Button
          onClick={handleOpenDatePopover}
          endIcon={<ExpandMoreIcon />}
          disabled={activeCard?.isClosed === true || column?.isClosed === true || (!currentBoard?.memberIds?.includes(currentUser?._id) && !currentBoard?.ownerIds?.includes(currentUser?._id))}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: activeCard?.isClosed ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: theme => theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
            backgroundColor: theme => theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
            padding: '10px',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: theme => theme.palette.mode === 'dark' ? '#33485D' : theme => theme.palette.grey[300],
              '&.active': {
                color: theme => theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
                backgroundColor: theme => theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
              }
            }
          }}>
          {startDate
            ? <Typography variant='span'>{formatDateTime(startDate, startTime)} - {formatDateTime(dueDate, dueDateTime)}</Typography>
            : <Typography variant='span'>{formatDateTime(dueDate, dueDateTime)}</Typography>
          }
          {isComplete && <Typography variant='span'
            sx={{
              height: '25px',
              bgcolor: 'green',
              display: 'flex',
              alignItems: 'center',
              padding: '0px 5px',
              color: 'white',
              borderRadius: '5px'
            }}>
            Completed
          </Typography>
          }
          {/* Nếu quá hạn */}
          {isOverdue() && !isComplete && <Typography variant='span'
            sx={{
              height: '25px',
              bgcolor: 'red',
              display: 'flex',
              alignItems: 'center',
              padding: '0px 5px',
              color: 'white',
              borderRadius: '5px'
            }}>
            Overdue
          </Typography>
          }
        </Button>
      </Box>
    </>

  )
}

export default DateTimeDisplay
