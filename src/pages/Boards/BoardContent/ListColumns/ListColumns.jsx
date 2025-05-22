import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { Close, NoteAdd } from '@mui/icons-material'
import { Box, Button, TextField } from '@mui/material'
import { cloneDeep } from 'lodash'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createNewColumnAPI } from '~/apis'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { generatePlaceholderCard } from '~/utils/formmatters'
import Column from './Column/Column'
import { socketIoIntance } from '~/socketClient'
import { selectCurrentUser } from '~/redux/user/userSlice'

function ListColumns(props) {
  const { columns } = props

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const currentUser = useSelector(selectCurrentUser)

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Column title is required')
    }

    // Create new column object
    const newColumnData = {
      title: newColumnTitle
    }

    // Call API to add new column
    const createdColumn = await createNewColumnAPI({ ...newColumnData, boardId: board._id })

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    //     Đoạn này sẽ dính lỗi object is not extensible bởi dù đã copy/clone ra giá trị newBoard nhưng bản chất
    // của spread operator là Shallow Copy/Clone, nên dính phải rules Immutability trong Redux Toolkit không
    // dùng được hàm PUSH (sửa giá trị mảng trực tiếp), cách đơn giản nhanh gọn nhất ở trường hợp này của chúng
    // ta là dùng tới Deep Copy/Clone toàn bộ cái Board cho dễ hiểu và code ngắn gọn.
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)

    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    // setBoard(newBoard)
    // cập nhật dữ liệu board mới vào Redux
    dispatch(updateCurrentActiveBoard(newBoard))
    setTimeout(() => {
      socketIoIntance.emit('batch', { boardId: board._id })
    }, 2000)

    // Reset form
    setNewColumnTitle('')
    setOpenNewColumnForm(false)

  }

  /*
        SortableContext yêu cầu items là 1 mảng dạng ['id-1', 'id-2', 'id-3', ...] chứ không phải [{_id: 'id-1', ...}, {_id: 'id-2', ...}, ...]
        Do đó cần chuyển đổi từ mảng object sang mảng id
        Nếu không đúng thì vẫn kéo thả được nhưng không có animantion
    */
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        display: 'flex',
        height: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {/* List columns */}
        {columns?.map((column) => {
          return (
            <Column
              key={column._id}
              column={column}
              board={board}
              currentUser={currentUser}
            />
          )
        })}


        {board?.isClosed === false && (board?.memberIds?.includes(currentUser?._id) || board?.ownerIds?.includes(currentUser?._id)) && !openNewColumnForm && (<Box onClick={toggleOpenNewColumnForm} sx={{
          minWidth: '200px',
          maxWidth: '200px',
          mx: 2,
          borderRadius: '6px',
          height: 'fit-content',
          bgcolor: '#ffffff3d'
        }}>
          <Button startIcon={<NoteAdd />}
            sx={{
              color: 'white',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py: 1.1
            }}
          >
            Add new column
          </Button>
        </Box>)}
        {openNewColumnForm && (
          <Box sx={{
            minWidth: '200px',
            maxWidth: '200px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label='Enter column title'
              type='type'
              size='small'
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addNewColumn()
                }
              }}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& input': { color: 'white' },
                '& .MuiOutLinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white'
                  }
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                className='interceptor-loading'
                onClick={addNewColumn}
                variant='outlined' startIcon={<NoteAdd />}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white'
                  }
                }}
              >
                Add column
              </Button>
              <Close onClick={toggleOpenNewColumnForm} sx={{ color: 'white', cursor: 'pointer' }} />
            </Box>
          </Box>)
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns