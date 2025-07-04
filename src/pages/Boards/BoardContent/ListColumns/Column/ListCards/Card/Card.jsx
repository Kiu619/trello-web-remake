import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Attachment, Comment, Group, TaskAltOutlined } from '@mui/icons-material'
import { Box, Button, CardActions, CardContent, CardMedia, Checkbox, Chip, Tooltip } from '@mui/material'
import MuiCard from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { showModalActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

const Card = memo(({ card }) => {
  const dispatch = useDispatch()
  const currentBoard = useSelector(selectCurrentActiveBoard)
  const shouldShowCardActions = () => card?.memberIds?.length > 0 || card?.comments?.length > 0 || card?.attachments?.length > 0 || card?.checklists?.length > 0

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card, type: 'COLUMN' }
  })

  const dndKitCardStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? '1px dashed #000' : undefined
  }

  const setActiveCard = () => {
    dispatch(updateCurrentActiveCard(card))
    dispatch(showModalActiveCard())
  }

  // Lấy thông tin labels của card từ labelIds và labels trong board
  const getCardLabels = () => {
    if (!card?.labelIds || !currentBoard?.labels) return []

    return currentBoard.labels.filter(label =>
      card.labelIds.includes(label._id)
    )
  }

  const cardLabels = getCardLabels()

  const cardContent = (
    <MuiCard
      onClick={card?.FE_PlaceholderCard ? undefined : setActiveCard}
      ref={setNodeRef}
      style={dndKitCardStyle}
      {...attributes}
      {...listeners}
      data-no-dnd={card?.isClosed === true || card?.FE_PlaceholderCard ? true : undefined}
      sx={{
        cursor: 'pointer',
        boxShadow: card?.FE_PlaceholderCard ? 'none' : '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
      }}
    >
      {card?.cover && (
        <CardMedia
          sx={{ height: 150, borderRadius: '4px 4px 0 0' }}
          image={card?.cover}
          title={card?.title}
        />
      )}

      {/* Hiển thị labels */}
      {cardLabels?.length > 0 && (
        <Box sx={{ p: '8px 8px 0 8px', display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {cardLabels.map(label => (
            <Tooltip key={label._id} title={label.title}>
              <Chip
                size="small"
                sx={{
                  backgroundColor: label.color || '#default',
                  color: '#fff',
                  height: 10,
                  width: 40
                }}
              />
            </Tooltip>
          ))}
        </Box>
      )}

      <CardContent
        sx={{
          p: 1.5,
          '&:last-child': { paddingBottom: 1.5 }
        }}
      >
        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> */}
          {/* <Tooltip title={card?.isCompleted ? 'Mark as not  completed' : 'Mark as completed'}>
            <Checkbox
              checked={card?.isCompleted}
            />
          </Tooltip> */}
          <Typography>{card?.title}</Typography>
      </CardContent>

      {shouldShowCardActions() && (
        <CardActions sx={{ p: '0 3px 8px 3px' }}>
          {card?.memberIds?.length > 0 && (
            <Button size="small" startIcon={<Group />}>
              {card?.memberIds?.length}
            </Button>
          )}

          {card?.comments?.length > 0 && (
            <Button size="small" startIcon={<Comment />}>
              {card?.comments?.length}
            </Button>
          )}

          {card?.attachments?.length > 0 && (
            <Button size="small" startIcon={<Attachment />}>
              {card?.attachments?.length}
            </Button>
          )}

          {card?.checklists?.length > 0 && (
            <Button size="small" startIcon={<TaskAltOutlined />}>
              {card?.checklists?.length}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  )

  return (
    <Box>
      {card?.FE_PlaceholderCard ? (
        cardContent
      ) : (
        <Link to={`/board/${currentBoard._id}/card/${card._id}`}>
          {cardContent}
        </Link>
      )}
    </Box>
  )
})

export default Card