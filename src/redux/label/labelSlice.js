import { createAsyncThunk, createSlice } from '@reduxjs/toolkit' 
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  labels: [],
  error: null
}

export const fetchLabelsAPI = createAsyncThunk(
  'label/fetchLabelsAPI',
  async (boardId, { rejectWithValue }) => {
    try {
      const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/label/${boardId}`)
      return response.data
    } catch (error) {
      // Return a rejected action with the error message
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const labelSlice = createSlice({
  name: 'label',
  initialState,
  reducers: {
    setLabels: (state, action) => {
      state.labels = action.payload
    },
    updateLabel: (state, action) => {
      const updatedLabel = action.payload
      const index = state.labels.findIndex(label => label._id === updatedLabel._id)
      if (index !== -1) {
        state.labels[index] = updatedLabel
      }
    },
    deleteLabel: (state, action) => {
      const labelId = action.payload
      state.labels = state.labels.filter(label => label._id !== labelId)
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLabelsAPI.fulfilled, (state, action) => {
      state.labels = action.payload
    })
    builder.addCase(fetchLabelsAPI.rejected, (state, action) => {
      state.error = action.payload
    })
  }
})

export const { setLabels, updateLabel, deleteLabel, setError } = labelSlice.actions

export const selectLabels = (state) => state.label.labels
export const selectLabelError = (state) => state.label.error

export const labelReducer = labelSlice.reducer

