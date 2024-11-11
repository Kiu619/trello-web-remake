//Cấu hình socketIo
import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constants.js'
export const socketIoIntance = io(API_ROOT)
