import {
    ExpandMore as ExpandMoreIcon
} from '@mui/icons-material'
import { Box, Button, Checkbox, FormControlLabel, Typography } from '@mui/material'

const DateTimeDisplay = ({ startDate, startTime, dueDate, dueDateTime, isComplete, handleOpenDatePopover, onUpdateDueDate }) => {
    const formatDateTime = (startDate, startTime) => {
        if (!startDate || !startTime) return ''

        const date = new Date(startDate)
        const [hours, minutes] = startTime.split(':')

        // Lấy năm hiện tại
        const currentYear = new Date().getFullYear()

        // Kiểm tra nếu năm của ngày là năm hiện tại
        const options = {
            month: 'short',
            day: 'numeric',
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
            isComplete: event.target.checked
        }
        onUpdateDueDate(dueDateData)
    }

    const isOverdue = () => {
        if (!dueDate || !dueDateTime) return false
        const dueDateTimeString = `${dueDate}T${dueDateTime}`
        return new Date(dueDateTimeString) < new Date()
    }

    return (
        <>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Due Date</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                    sx={{}}
                    control={
                        <Checkbox
                            checked={isComplete}
                            onChange={handleCheckboxChange}
                        />
                    }
                />
                <Button
                    onClick={handleOpenDatePopover}
                    endIcon={<ExpandMoreIcon />}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
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
                        ? <Typography variant='span'>{formatDateTime(startDate, startTime)}</Typography>
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
