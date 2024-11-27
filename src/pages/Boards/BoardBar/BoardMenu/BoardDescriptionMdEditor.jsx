import EditNoteIcon from '@mui/icons-material/EditNote'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useColorScheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MDEditor from '@uiw/react-md-editor'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import rehypeSanitize from 'rehype-sanitize'
import { updateBoardDetailsAPI } from '~/apis'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { socketIoIntance } from '~/socketClient'

function BoardDescriptionMdEditor(props) {
  const { board } = props

  const { mode } = useColorScheme()
  const dispatch = useDispatch()

  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  const [boardDescription, setBoardDescription] = useState(board.description)

  useEffect(() => {
    setBoardDescription(board.description)
  }, [board.description])

  const updateBoardDescription = () => {
    setMarkdownEditMode(false)
    const updateData = { description: boardDescription }
    updateBoardDetailsAPI(board._id, updateData).then((res) => {

      const newBoard = cloneDeep(board)
      newBoard.description = boardDescription
      dispatch(updateCurrentActiveBoard(newBoard))

      setTimeout(() => {
        socketIoIntance.emit('batch', { boardId: board._id })
      }, 1234)
    })
  }

  const cancelBoardDescriptionEdit = () => {
    setMarkdownEditMode(false)
    setBoardDescription(board.description)
  }

  return (
    <Box sx={{ width: '100%', justifyContent: 'center' }}>
      {markdownEditMode
        ? <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box data-color-mode={mode}>
            <MDEditor
              value={boardDescription}
              onChange={setBoardDescription}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
              height={400}
              preview="edit"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              onClick={cancelBoardDescriptionEdit}
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
              onClick={updateBoardDescription}
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
            {/* {board?.isClosed === false && (
            )} */}
            {board?.isClosed === false && (
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
              source={boardDescription}
              style={{
                whiteSpace: 'pre-wrap',
                padding: boardDescription ? '10px' : '0px',
                border: boardDescription ? '0.5px solid rgba(0, 0, 0, 0.2)' : 'none',
                borderRadius: '8px'
              }}
            />
          </Box>
        </Box>
      }
    </Box>
  )
}

export default BoardDescriptionMdEditor
