import { createAsyncThunk, createSlice } from "@reduxjs/toolkit" // Make sure to import your axios instance
import authorizedAxiosInstance from "~/utils/authorizedAxios"
import { API_ROOT } from '~/utils/constants' // Make sure to import your API root

const initialState = {
    currentActiveCard: null,
    isShowModalActiveCard: false,
    error: null // Add an error state to capture any errors
}

export const fetchCardDetailsAPI = createAsyncThunk(
    'activeCard/fetchCardDetailsAPI',
    async (cardId, { rejectWithValue }) => {
        try {
            const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/card/${cardId}`)
            return response.data
        } catch (error) {
            // Return a rejected action with the error message
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

const activeCardSlice = createSlice({
    name: 'activeCard',
    initialState,
    reducers: {
        clearAndHideCurrentActiveCard: (state) => {
            state.currentActiveCard = null
            state.isShowModalActiveCard = false
            state.error = null // Clear any existing errors
        },
        updateCurrentActiveCard: (state, action) => {
            state.currentActiveCard = action.payload
        },
        showModalActiveCard: (state) => {
            state.isShowModalActiveCard = true
        },
        hideModalActiveCard: state => { state.isShowModalActiveCard = false }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCardDetailsAPI.fulfilled, (state, action) => {
                state.currentActiveCard = action.payload
                console.log('state.currentActiveCard: ', state.currentActiveCard)
                state.error = null // Clear any existing errors
            })
            .addCase(fetchCardDetailsAPI.rejected, (state, action) => {
                state.error = action.payload // Capture the error message
            })
    }
})

export const { clearAndHideCurrentActiveCard, updateCurrentActiveCard, showModalActiveCard, hideModalActiveCard  } = activeCardSlice.actions

export const selectActiveCard = (state) => state.activeCard.currentActiveCard
export const selectIsShowModalActiveCard = (state) => state.activeCard.isShowModalActiveCard
export const selectActiveCardError = (state) => state.activeCard.error // Selector for the error state

export const activeCardReducer = activeCardSlice.reducer