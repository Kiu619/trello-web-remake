import axios from "axios"
import { API_ROOT } from "~/utils/constants"
import authorizedAxiosInstance from "~/utils/authorizedAxios"
import { toast } from "react-toastify"

// Board API
export const createNewBoardAPI = async (newBoard) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/board/`, newBoard)
  toast.success('Create new board successfully!')
  return response.data
}

// đã chuyển vào activeBoardSlice.js
// export const fetchBoardDetailsAPI = async (boardId) => {
//   // Không cần sử dụng try catch vì thằng axios nó có sẵn Interceptor để handle lỗi
//   const response = await axios.get(`${API_ROOT}/v1/board/${boardId}`)
//   // axios sẽ trả kết quả về qua property của nó là data
//   return response.data
// }

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/board/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/board/supports/moving_card`, updateData)
  return response.data
}

export const inviteUserToBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/invitation/board`, data)
  toast.success('Invite user successfully!')
  return response.data
}

// Column API
export const createNewColumnAPI = async (newColumn, ) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/column/`, newColumn)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/column/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/column/${columnId}`)
  return response.data
}

// Card API
export const createNewCardAPI = async (newCard) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/card/`, newCard)
  return response.data
}

export const updateCardDetailsAPI = async (cardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/card/${cardId}`, updateData)
  return response.data
}

export const editTitleCardAPI = async (cardId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/card/editTitle/${cardId}`, data)
  return response.data
}

export const editDescriptionCardAPI = async (cardId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/card/updateDescription/${cardId}`, data)
  return response.data
}

export const uploadCoverImageAPI = async (cardId,data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/card/uploadCoverImg/${cardId}`, data)
  return response.data
}

export const uploadCoverImageColor = async (cardId,data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/card/uploadCoverColor/${cardId}`, data)
  return response.data
}

export const removeCoverImageAPI = async (cardId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/card/uploadCoverImg/${cardId}`)
  return response.data
}

export const addCommentAPI = async (cardId, data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/card/comment/${cardId}`, data)
  return response.data
}

export const updateCommentAPI = async (cardId, commentId, content) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/card/comment/${cardId}`, { commentId, content })
  return response.data
}

// axioss.delete(url, { data: { key: value } }) (bắt buộc phải có cú pháp data)
export const deleteCommentAPI = async (cardId, commentId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/card/comment/${cardId}`, { data: { commentId } })
  return response.data
}

// User API
export const registerAPI = async (newUser) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/user/register`, newUser)
  toast.success('Your account has been created successfully. Please check your email to verify your account.')
  return response.data
}

export const verifyAccountAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/user/verify`, data)
  toast.success('Your account has been verified. Now you can login to enjoy our services! Have a good day!')
  return response.data
}

export const refreshTokenApi = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/user/refresh_token`)
  return response.data
}

export const changePasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/user/change_password`, data)
  return response.data
}

export const updateProfileAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/user/testUpload`, data)
  return response.data
}

export const fetchBoardsAPI= async (searchPath) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/board/${searchPath}`)
  return response.data
}

// export const fetchBoardByUserAPI = async (id, page, limit) => {
//   const response = await axios.get(`${API_ROOT}/v1/user/${id}?page=${page}&limit=${limit}`)
//   return response.data
// }

export const fetchCollaborationBoardByUserAPI = async (id, page, limit) => {
  const response = await axios.get(`${API_ROOT}/v1/user/collaboration/${id}?page=${page}&limit=${limit}`)
  return response.data
}
