import styled from '@emotion/styled'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Box, Button, Popover, TextField, Typography } from '@mui/material'
import { cloneDeep } from 'lodash'
import { useConfirm } from 'material-ui-confirm'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deleteCardAPI } from '~/apis'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { clearAndHideCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { socketIoIntance } from '~/socketClient'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

function Delete({ activeCard }) {
  const currentBoard = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const confirmDeleteCard = useConfirm()
  const navigate = useNavigate()

  const handleDeleteCard = () => {
    confirmDeleteCard({
      title: 'Delete this card',
      description: 'Are you sure you want to delete this card? This action cannot be undone.'
    })
      .then(() => {
        const newBoard = cloneDeep(currentBoard)
        newBoard.columns = newBoard.columns.map(column => {
          column.cards = column.cards.filter(card => card._id !== activeCard._id)
          column.cardOrderIds = column.cardOrderIds.filter(cardId => cardId !== activeCard._id)
          return column
        })
        dispatch(updateCurrentActiveBoard(newBoard))
        dispatch(clearAndHideCurrentActiveCard())

        deleteCardAPI(activeCard._id).then((res) => {
          toast.success(res?.deleteResult)
          navigate(`/board/${newBoard._id}`)
        })

        setTimeout(() => {
          socketIoIntance.emit('batch', { boardId: activeCard.boardId })
        }, 2000)
      })
      .catch(() => {
      })
  }

  return (
    <div>
      <SidebarItem onClick={handleDeleteCard}><DeleteOutlineIcon fontSize="small" />Delete</SidebarItem>
    </div>
  )
}

export default Delete
