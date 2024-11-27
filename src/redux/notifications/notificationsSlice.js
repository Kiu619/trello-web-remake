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
  async ({ status, notificationId }) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/notification/updateBoardInvitation/${notificationId}`, { status })
    return response.data
  }
)

export const updateBoardRequestAPI = createAsyncThunk(
  'notifications/updateBoardRequestAPI',
  async ({ status, notificationId }) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/notification/updateBoardRequest/${notificationId}`, { status })
    return response.data
  }
)

export const fetchNotificationsAPI = createAsyncThunk(
  'notifications/fetchNotificationsAPI',
  async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/notification`)
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
    },
    markAsReadAll: (state) => {
      state.curentNotifications = state.curentNotifications.map(notification => {
        notification.isRead = true
        return notification
      })
    }
  },
  // extraReducers: chứa các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
        let incomingInvitations = action.payload
        state.curentNotifications = Array.isArray(incomingInvitations) ? incomingInvitations.reverse() : []
      })
      .addCase(fetchNotificationsAPI.fulfilled, (state, action) => {
        // let incomingInvitations = action.payload
        // state.curentNotifications = Array.isArray(incomingInvitations) ? incomingInvitations.reverse() : []
        state.curentNotifications = action.payload
      })
      .addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
        let updatedInvitation = action.payload
        state.curentNotifications = state.curentNotifications.map(invitation => {
          if (invitation._id === updatedInvitation._id) {
            return updatedInvitation
          }
          return invitation
        })
      })
      .addCase(updateBoardRequestAPI.fulfilled, (state, action) => {
        let updatedInvitation = action.payload
        state.curentNotifications = state.curentNotifications.map(invitation => {
          if (invitation._id === updatedInvitation._id) {
            return updatedInvitation
          }
          return invitation
        })
      })

  }
})

export const { clearCurrentNotifications, updateCurrentNotifications, addNotification, markAsReadAll } = notificationsSlice.actions

export const selectCurrentNotifications = state => {
  return state.notifications.curentNotifications
}

export const notificationsReducer = notificationsSlice.reducer

