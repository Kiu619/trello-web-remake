import EditNoteIcon from '@mui/icons-material/EditNote'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useColorScheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MDEditor from '@uiw/react-md-editor'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import rehypeSanitize from 'rehype-sanitize'

function CardDescriptionMdEditor(props) {
  const { currentUser, currentBoard, column, activeCard, cardDescriptionProp, onUpdateCardDescription } = props

  const { mode } = useColorScheme()

  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  const [cardDescription, setCardDescription] = useState(cardDescriptionProp)

  useEffect(() => {
    setCardDescription(cardDescriptionProp)
  }, [cardDescriptionProp])

  const updateCardDescription = () => {
    if (activeCard?.isClosed === true || column?.isClosed === true) {
      toast.error('This card is close, please click cancel')
      return
    }
    setMarkdownEditMode(false)
    onUpdateCardDescription(cardDescription)
  }

  const cancelCardDescriptionEdit = () => {
    setMarkdownEditMode(false)
    setCardDescription(cardDescriptionProp)
  }

  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode
        ?
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box data-color-mode={mode}>
            <MDEditor
              value={cardDescription}
              onChange={setCardDescription}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
              height={400}
              preview="edit"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              onClick={cancelCardDescriptionEdit}
              type="button"
              variant="contained"
              size="small"
              sx={{
                justifyContent: 'flex-start',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#A1BDD914' : '#3f444814'),
                color: '#7e8b9a',
                '&:hover': {
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#45505A' : '#0c93ff1a')
                }
              }}>
              Cancel
            </Button>
            <Button
              onClick={updateCardDescription}
              className="interceptor-loading"
              type="button"
              variant="contained"
              size="small"
              color="info">
              Save
            </Button>
          </Box>
        </Box>
        :
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'space-between', mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SubjectRoundedIcon />
              <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Description</Typography>
            </Box>
            {activeCard?.isClosed === false && column?.isClosed === false && (activeCard?.memberIds?.includes(currentUser?._id) || currentBoard?.ownerIds?.includes(currentUser?._id)) && (
              <Button
                sx={{ alignSelf: 'flex-end' }}
                onClick={() => setMarkdownEditMode(true)}
                type="button"
                variant="contained"
                color="info"
                size="small"
                startIcon={<EditNoteIcon />}>
                Edit
              </Button>
            )}
          </Box>

          <Box data-color-mode={mode}>
            <MDEditor.Markdown
              source={cardDescription}
              style={{
                whiteSpace: 'pre-wrap',
                padding: cardDescription ? '10px' : '0px',
                border: cardDescription ? '0.5px solid rgba(0, 0, 0, 0.2)' : 'none',
                borderRadius: '8px'
              }}
            />
          </Box>
        </Box>
      }
    </Box>
  )
}

export default CardDescriptionMdEditor