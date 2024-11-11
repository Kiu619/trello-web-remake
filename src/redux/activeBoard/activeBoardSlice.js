import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formmatters'
import { mapOrder } from '~/utils/sort'

const initialState = {
    currentActiveBoard: null
}

// các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
    'activeBoard/fetchBoardDetailsAPI',
    async (boardId) => {
        const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/board/${boardId}`)
        return response.data
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
                    // assign laf thay đổi giá trị của card bằng giá trị của incomingCard
                    // Object.assign(card, incomingCard)
                    
                    // hoặc
                    Object.keys(incomingCard).forEach(key => {
                        card[key] = incomingCard[key]
                    })
                }
            }
        },
        clearAndHideCurrentActiveBoard: (state) => {
            state.currentActiveBoard = null
        }

    },
    // extraReducers: chứa các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux
    extraReducers: (builder) => {
        builder
            .addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
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
                
                // action.payload chính là response.data từ hàm fetchBoardDetailsAPI
                state.currentActiveBoard = board
            })
    }
})

export const { updateCurrentActiveBoard, updateCardInBoard, clearAndHideCurrentActiveBoard } = activeBoardSlice.actions

export const selectCurrentActiveBoard = (state) => {
    return state.activeBoard.currentActiveBoard
}

export const activeBoardReducer = activeBoardSlice.reducer
