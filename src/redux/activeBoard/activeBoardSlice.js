import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formmatters'
import { mapOrder } from '~/utils/sort'

const initialState = {
  currentActiveBoard: null,
  error: null
}

// các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsApiRedux = createAsyncThunk(
  'activeBoard/fetchBoardDetailsApiRedux',
  async (boardId, { rejectWithValue }) => {
    try {
      const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/board/${boardId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      state.currentActiveBoard = action.payload
    },
    updateCardInBoard: (state, action) => {
      //update nested data
      const incomingCard = action.payload

      const column = state.currentActiveBoard.columns.find(column => column._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find(card => card._id === incomingCard._id)
        if (card) {
          // Cập nhật tất cả properties của card bao gồm labelIds
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })}
      }
    },
    clearAndHideCurrentActiveBoard: (state) => {
      state.currentActiveBoard = null
      state.error = null // Reset trạng thái lỗi khi clear board
    },
    updateCardLabelInBoard: (state, action) => {
      const incomingLabel = action.payload
      const board = state.currentActiveBoard
      const column = board.columns.find(column => column._id === incomingLabel.columnId)
      if (column) {
        const card = column.cards.find(card => card._id === incomingLabel.cardId)
        if (card) {
          card.labelDetails = incomingLabel.labelDetails
        }
      }
    },
    addLabelToBoard: (state, action) => {
      const newLabel = action.payload
      if (state.currentActiveBoard) {
        if (!state.currentActiveBoard.labels) {
          state.currentActiveBoard.labels = []
        }
        state.currentActiveBoard.labels.push(newLabel)
      }
    },
    updateBoardLabel: (state, action) => {
      const updatedLabel = action.payload
      if (state.currentActiveBoard && state.currentActiveBoard.labels) {
        const index = state.currentActiveBoard.labels.findIndex(label => label._id === updatedLabel._id)
        if (index !== -1) {
          state.currentActiveBoard.labels[index] = updatedLabel
        }
      }
    },
    deleteLabelFromBoard: (state, action) => {
      const labelId = action.payload
      if (state.currentActiveBoard && state.currentActiveBoard.labels) {
        state.currentActiveBoard.labels = state.currentActiveBoard.labels.filter(label => label._id !== labelId)
      }
    }
  },
  // extraReducers: chứa các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardDetailsApiRedux.fulfilled, (state, action) => {
        if (action.payload.forShare) {
          // Create a new state object instead of modifying the existing one
          state.currentActiveBoard = { ...action.payload }
          return state
        }

        let board = action.payload

        //thành viên của board là gộp từ 2 mảng là members và onwers
        // concat() method is used to merge two or more arrays. This method does not change the existing arrays, but instead returns a new array.
        board.FE_allUsers = board.owners.concat(board.members)

        // Sắp xếp lại column theo columnOrderIds trước khi đưa dữ liệu xuống
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
        // Nếu column không có card thì thêm card placeholder
        board.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          } else {
            // Sắp xếp lại card theo cardOrderIds trước khi đưa dữ liệu xuống
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })
        // action.payload chính là response.data từ hàm fetchBoardDetailsApiRedux
        state.currentActiveBoard = board
        state.error = null
      })
      .addCase(fetchBoardDetailsApiRedux.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch board details'
      })
  }
})

export const { 
  updateCurrentActiveBoard, 
  updateCardInBoard, 
  clearAndHideCurrentActiveBoard, 
  updateCardLabelInBoard,
  addLabelToBoard,
  updateBoardLabel,
  deleteLabelFromBoard
} = activeBoardSlice.actions

export const selectCurrentActiveBoard = (state) => state.activeBoard.currentActiveBoard
export const selectActiveBoardError = (state) => state.activeBoard.error
export const selectCurrentActiveBoardLabels = (state) => state.activeBoard.currentActiveBoard?.labels || []

export const activeBoardReducer = activeBoardSlice.reducer