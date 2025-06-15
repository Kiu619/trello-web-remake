import React, { useState } from 'react'
import {
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'

const FileDownloadHandler = ({ file, onDownloadComplete }) => {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)

  const handleDownload = async () => {
    setDownloading(true)
    setError(null)

    try {
      // Kiểm tra xem URL file có hợp lệ không
      if (!file?.url) {
        throw new Error('Invalid file URL')
      }

      // Fetch file từ URL
      const response = await fetch(file.url)

      if (!response.ok) {
        throw new Error('Failed to download file')
      }

      // Lấy blob data
      const blob = await response.blob()

      // Tạo object URL từ blob
      const url = window.URL.createObjectURL(blob)

      // Tạo temporary link element để download
      const link = document.createElement('a')
      link.href = url
      link.download = file.filename || 'download' // Sử dụng tên file gốc hoặc fallback

      // Thêm link vào DOM, click và cleanup
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup object URL
      window.URL.revokeObjectURL(url)

      // Callback khi download hoàn thành
      if (onDownloadComplete) {
        onDownloadComplete()
      }
    } catch (err) {
      console.error('Download error:', err)
      setError(err.message)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleDownload}
        disabled={downloading}
        startIcon={downloading ? <CircularProgress size={20} /> : <DownloadOutlinedIcon />}
        variant="contained"
        size="small"
        color="info"
      >
        {downloading ? 'Downloading...' : 'Download'}
      </Button>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  )
}

export default FileDownloadHandler