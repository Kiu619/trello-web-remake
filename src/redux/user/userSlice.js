import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentUser: null,
  starredBoards: [],
  recentBoards: [],
  is_2fa_verified: false
}

// các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/user/login`, data)
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/user/logout`)
    if (showSuccessMessage) {
      toast.success('Logout successfully')
    }
    return response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/user/update`, data)
    return response.data
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Thêm starredBoard vào starredBoards của currentUser
    updateCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    updateStarredBoard: (state, action) => {
      const { board, forStarred } = action.payload
      if (forStarred) {
        state.starredBoards.push(board)
      } else {
        state.starredBoards = state.starredBoards.filter(starredBoard => starredBoard._id !== board._id)
      }
    },
    updateRecentBoards: (state, action) => {
      const board = action.payload

      // Xóa board khỏi danh sách nếu đã tồn tại
      state.recentBoards = state.recentBoards.filter(recentBoard => recentBoard._id !== board._id)

      // Thêm board vào đầu danh sách
      state.recentBoards.unshift(board)

      // Giữ danh sách chỉ tối đa 5 phần tử
      if (state.recentBoards.length > 5) {
        state.recentBoards = state.recentBoards.slice(0, 5)
      }
    },
    update2FAVerified: (state, action) => {
      state.is_2fa_verified = action.payload
    }
  },
  // extraReducers: chứa các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAPI.fulfilled, (state, action) => {
        const user = action.payload
        // action.payload chính là response.data từ hàm loginUserAPI
        state.currentUser = user
        state.starredBoards = user.starredBoards
        state.recentBoards = user.recentBoards
        state.is_2fa_verified = user.is_2fa_verified
      })
      .addCase(logoutUserAPI.fulfilled, (state) => {
        state.currentUser = null
      })
      .addCase(updateUserAPI.fulfilled, (state, action) => {
        state.currentUser = action.payload
      })
  }
})

export const { updateStarredBoard, updateRecentBoards, updateCurrentUser, update2FAVerified } = userSlice.actions

export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const selectStarredBoards = (state) => {
  return state.user.starredBoards
}

export const selectRecentBoards = (state) => {
  return state.user.recentBoards
}

export const selectIs2FAVerified = (state) => {
  return state.user.is_2fa_verified
}

export const userReducer = userSlice.reducer
