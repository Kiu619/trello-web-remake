import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { toast } from 'react-toastify'

// Board API
export const createNewBoardAPI = async (newBoard) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/board/`, newBoard)
  toast.success('Create new board successfully!')
  return response.data
}

export const fetchBoardsAPI= async (searchPath) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/board/${searchPath}`)
  return response.data
}

export const fetchBoardDetailsApi = async (boardId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/board/${boardId}`)
  return response.data
}

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
export const createNewColumnAPI = async (newColumn ) => {
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

export const moveColumnToDifferentBoardAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/column/move_column_to_different_board/${columnId}`, updateData)
  return response.data
}

export const copyColumnAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/column/copy_column/${columnId}`, updateData)
  return response.data
}

export const moveAllCardsToAnotherColumnAPI = async (columnId, newColumnId) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/column/move_all_cards_to_another_column/${columnId}`, { newColumnId })
  return response.data
}

// Card API
export const fetchCardDetailsAPI = async (cardId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/card/${cardId}`)
  return response.data
}

export const createNewCardAPI = async (newCard) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/card/`, newCard)
  return response.data
}

export const updateCardDetailsAPI = async (cardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/card/${cardId}`, updateData)
  return response.data
}

export const copyCardAPI = async (cardId, updateData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/card/copy_card/${cardId}`, updateData)
  return response.data
}

export const moveCardToDifferentBoardAPI = async (cardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/card/move_card_to_different_board/${cardId}`, updateData)
  return response.data
}

export const deleteCardAPI = async (cardId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/card/${cardId}`)
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

export const forgotPasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/user/forgot_password`, data)
  toast.success('An email has been sent to your email. Please check and reset your password!')
  return response.data
}

export const get2FA_QRCodeAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/user/get_2fa_qr_code`)
  return response.data
}

export const setup2FA_API = async (otpToken) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/user/setup_2fa`, { otpToken })
  return response.data
}

export const verify2FA_API = async (otpToken) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/user/verify_2fa`, { otpToken })
  return response.data
}

export const disable2FA_API = async (otpToken) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/user/disable_2fa`, { otpToken })
  return response.data
}

export const fetchCollaborationBoardByUserAPI = async (id, page, limit) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/user/collaboration/${id}?page=${page}&limit=${limit}`)
  return response.data
}
