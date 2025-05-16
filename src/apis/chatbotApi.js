import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { toast } from 'react-toastify'

export const getChatbotResponse = async (message, boardId) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/chatbot/chat`, { message, boardId })
  return response.data
}

export const getChatHistory = async (boardId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/chatbot/history/${boardId}`)
  return response.data
}

