import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Attachment, Comment, Group } from '@mui/icons-material';
import { Box, Button, CardActions, CardContent, CardMedia } from '@mui/material';
import MuiCard from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { showModalActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice';

// const socket = io(`${BACKEND_URL}`);

function Card({ card, column }) {
    const dispatch = useDispatch()

    // useEffect(() => {
    //     const handleUpdateCard = async (data) => {
    //         if (data.cardId === card._id) {
    //             setTitle(data.cardTitle)
    //         }
    //     }
    
    //     socket.on('update_card', handleUpdateCard)
    
    //     // Clean up function
    //     return () => {
    //         socket.off('update_card', handleUpdateCard)
    //     }
    // }, []) // Empty dependency array ensures this runs once on mount and unmount

    const shouldShowCardActions = () => card?.memberIds?.length > 0 || card?.comments?.length > 0 || card?.attachments?.length > 0

    const { attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    }
        = useSortable({
            id: card._id,
            data: { ...card, type: 'COLUMN' },
        });

    const dndKitCardStyle = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        border: isDragging ? '1px dashed #000' : undefined,
    }

    const setActiveCard = () => {
        dispatch(updateCurrentActiveCard(card))
        dispatch(showModalActiveCard())
    }

    return (
        <>
            <Box>
                <MuiCard
                    onClick={setActiveCard}
                    ref={setNodeRef}
                    style={dndKitCardStyle}
                    {...attributes}
                    {...listeners}
                    sx={{
                        cursor: 'pointer',
                        boxShadow: card?.FE_PlaceholderCard ? 'none' : '0 1px 1px rgba(0,0,0,0.2)',
                        overflow: 'unset',
                        border: '1px solid transparent',
                        '&:hover': { borderColor: (theme) => theme.palette.primary.main },
                    }}
                >

                    {card?.cover &&
                        <CardMedia
                            sx={{ height: 150, borderRadius: '4px 4px 0 0'}}
                            image={card?.cover}
                            title="Random"
                        />
                    }


                    <CardContent sx={{
                        p: 1.5,
                        '&:last-child': { paddingBottom: 1.5 }
                    }}>
                        <Typography>{card?.title}</Typography>
                    </CardContent>


                    {shouldShowCardActions() &&
                        <CardActions sx={{ p: '0 4px 8px 4px' }}>
                            {card?.memberIds?.length > 0 &&
                                <Button size="small" startIcon={<Group />}>
                                    {card?.memberIds?.length}
                                </Button>
                            }

                            {card?.comments?.length > 0 &&
                                <Button size="small" startIcon={<Comment />}>
                                    {card?.comments?.length}
                                </Button>
                            }

                            {card?.attachments?.length > 0 &&
                                <Button size="small" startIcon={<Attachment />}>
                                    {card?.attachments?.length}
                                </Button>
                            }
                        </CardActions>
                    }
                </MuiCard>
            </Box>
        </>
    )
}

export default Card