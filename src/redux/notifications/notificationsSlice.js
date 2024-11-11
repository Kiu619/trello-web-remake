import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
    curentNotifications: null
}

// các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchInvitationsAPI = createAsyncThunk(
    'notifications/fetchInvitationsAPI',
    async () => {
        const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/invitation`)
        return response.data
    }
)

export const updateBoardInvitationAPI = createAsyncThunk(
    'notifications/updateBoardInvitationAPI',
    async ({ status, invitationId }) => {
        const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/invitation/board/${invitationId}`, { status })
        return response.data
    }
)

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearCurrentNotifications: (state) => {
            state.curentNotifications = null
        },
        updateCurrentNotifications: (state, action) => {
            state.curentNotifications = action.payload
        },
        addNotification: (state, action) => {
            const incomingInvitation = action.payload
            state.curentNotifications.unshift(incomingInvitation)
        }
    },
    // extraReducers: chứa các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
                let incomingInvitations = action.payload
                state.curentNotifications = Array.isArray(incomingInvitations) ? incomingInvitations.reverse() : []
            })
            .addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
                const incomingInvitation = action.payload
                const getInvitation = state.curentNotifications.find(invitation => invitation._id === incomingInvitation._id)
                getInvitation.boardInvitation = incomingInvitation.boardInvitation
            })

    }
})

export const { clearCurrentNotifications, updateCurrentNotifications, addNotification } = notificationsSlice.actions

export const selectCurrentNotifications = state => {
    return state.notifications.curentNotifications
}

export const notificationsReducer = notificationsSlice.reducer

