import axios from "axios"
import { toast } from "react-toastify"
import { interceptorLoadingElements } from "./formmatters"
import { logoutUserAPI } from "~/redux/user/userSlice"
import { refreshTokenApi } from "~/apis"
import { socketIoIntance } from "~/socketClient"

// Không thể import { store } của redux vào đây
// Dùng injectStore để truyền store vào authorizedAxiosInstance
let axiosReduxStore = null
// Nhận store từ main.jsx
export const injectStore = (store) => {
    axiosReduxStore = store
}

// khởi tạo đối tượng axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()
//thời gian chờ tối đa cho 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: sễ cho phép axios gửi cookie khi request trong mỗi reauest lên BE 
authorizedAxiosInstance.defaults.withCredentials = true

// cấu hình interceptors cho axios instance giữa mọi request và response
authorizedAxiosInstance.interceptors.request.use(
    (config) => {
        // Chawnj spam click khi gọi API
        interceptorLoadingElements(true)

        // socketIoIntance.emit('apiRequest', { url: config.url, method: config.method })
        // socketIoIntance.emit('batch')

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Khởi tạo biến refreshTokenPromise để tránh việc gọi lại request refresh token nhiều lần
let refreshTokenPromise = null

authorizedAxiosInstance.interceptors.response.use(
    (response) => {
        // Kết thúc spam click khi gọi API
        interceptorLoadingElements(false)
        return response
    },
    async (error) => {
        interceptorLoadingElements(false)
        // Nếu mã là 401 thì gọi api đăng xuất luôn, 401 là authen fail
        if (error.response?.status === 401) {
            axiosReduxStore.dispatch(logoutUserAPI(false)) 
        }

        // Nếu mã là 410 thì gọi api refresh token
        const originalRequest = error.config
        // Không cần sử dụng originalRequest._retry cũng được vì dùng biến refreshTokenPromise để tránh gọi lại request refresh token nhiều lần
        if (error.response?.status === 410 && !originalRequest._retry) {
            originalRequest._retry = true

            if (!refreshTokenPromise) {
                refreshTokenPromise = refreshTokenApi()
                    .then(data => {
                        return data?.accessToken
                    })
                    .catch((_error) => {
                        // Nếu nhận lỗi nào từ api refresh token thì đăng xuất luôn
                        axiosReduxStore.dispatch(logoutUserAPI(false))
                        // Tránh việc gọi lại request refresh token nhiều lần
                        return Promise.reject(_error)
                    })
                    .finally(() => {
                        // Reset refreshTokenPromise về null để có thể gọi lại request refresh token
                        refreshTokenPromise = null
                    })
            }

            // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây:
            return refreshTokenPromise.then((accessToken) => {
                // Nếu trường hợp lưu accessToken vào localStorage thì thêm vào đây
                // ví dụ axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`


                // Return lại axios instance kết hợp với originalRequest để gọi lại request ban đầu bị lỗi
                return authorizedAxiosInstance(originalRequest)
            })
        }


        let errorMessage = error?.message
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message
        }
        if (error.response?.status !== 410) {
            toast.error(errorMessage)
        }

        return Promise.reject(error)
    }
)

export default authorizedAxiosInstance
