import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentActiveCard: null,
    isShowModalActiveCard: false
}

const activeCardSlice = createSlice({
    name: 'activeCard',
    initialState,
    reducers: {
        clearAndHideCurrentActiveCard: (state) => {
            state.currentActiveCard = null,
            state.isShowModalActiveCard = false
        },
        updateCurrentActiveCard: (state, action) => {
            state.currentActiveCard = action.payload
        },
        showModalActiveCard: (state) => {
            state.isShowModalActiveCard = true
        }
    },
    extraReducers: (builder) => {}
})

export const { clearAndHideCurrentActiveCard, updateCurrentActiveCard, showModalActiveCard } = activeCardSlice.actions

export const selectActiveCard = (state) => state.activeCard.currentActiveCard
export const selectIsShowModalActiveCard = (state) => state.activeCard.isShowModalActiveCard

export const activeCardReducer = activeCardSlice.reducer

