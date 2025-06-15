import { useEffect, useRef } from 'react'

const GoogleDrivePicker = ({
  open,
  onClose,
  onFilesSelected,
  accessToken,
  mode = 'file' // 'file' hoặc 'folder'
}) => {
  const observerRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (open && accessToken) {
      loadGooglePickerApi()
    }
    
    // Cleanup khi component unmount hoặc open thay đổi
    return () => {
      cleanup()
    }
  }, [open, accessToken])

  const cleanup = () => {
    // Disconnect observer
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    // Reset MUI Modal z-index
    const muiModals = document.querySelectorAll('.MuiModal-root, .MuiDialog-root')
    muiModals.forEach(modal => {
      modal.style.zIndex = ''
    })
  }

  const loadGooglePickerApi = () => {
    if (window.gapi) {
      window.gapi.load('picker', createPicker)
    }
  }

  const createPicker = () => {
    if (!window.google || !window.google.picker) {
      console.error('Google Picker API not loaded')
      return
    }

    // Cleanup trước khi tạo picker mới
    cleanup()

    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
      .setAppId(process.env.REACT_APP_GOOGLE_APP_ID)
      .setOAuthToken(accessToken)
      .addView(getPickerView())
      .setCallback(pickerCallback)
      .setTitle(mode === 'file' ? 'Select a file' : 'Select a folder')
      .setMaxItems(mode === 'folder' ? 1 : 50)
      .build()

    // Tạo MutationObserver mới
    observerRef.current = new MutationObserver(() => {
      fixPickerZIndex()
    })

    // Bắt đầu observe
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    })

    // Function để fix z-index
    const fixPickerZIndex = () => {
      // Tìm tất cả picker elements
      const pickerDialog = document.querySelector('.picker-dialog')
      const pickerBg = document.querySelector('.picker-dialog-bg')
      const modalPopup = document.querySelector('.goog-modalpopup')
      const modalBg = document.querySelector('.goog-modalpopup-bg')

      // Set z-index cao cho picker elements
      if (pickerDialog) {
        pickerDialog.style.zIndex = '10000'
        pickerDialog.style.position = 'fixed'
      }
      
      if (pickerBg) {
        pickerBg.style.zIndex = '9999'
        pickerBg.style.position = 'fixed'
      }

      if (modalPopup) {
        modalPopup.style.zIndex = '10000'
        modalPopup.style.position = 'fixed'
      }

      if (modalBg) {
        modalBg.style.zIndex = '9999'
        modalBg.style.position = 'fixed'
      }

      // Giảm z-index của MUI Modal
      const muiModals = document.querySelectorAll('.MuiModal-root, .MuiDialog-root')
      muiModals.forEach(modal => {
        modal.style.zIndex = '1300'
      })
    }

    // Tạo interval để force z-index liên tục
    intervalRef.current = setInterval(fixPickerZIndex, 200)

    picker.setVisible(true)

    // Initial fix với delay
    setTimeout(fixPickerZIndex, 50)
    setTimeout(fixPickerZIndex, 200)
    setTimeout(fixPickerZIndex, 500)
  }

  const getPickerView = () => {
    if (mode === 'folder') {
      // Chỉ hiển thị folders
      return new window.google.picker.DocsView(window.google.picker.ViewId.FOLDERS)
        .setSelectFolderEnabled(true)
    } else {
      // Hiển thị tất cả files
      const docsView = new window.google.picker.DocsView()
        .setIncludeFolders(true)
        .setSelectFolderEnabled(false)

      return docsView
    }
  }

  const pickerCallback = (data) => {
    // Cleanup trước khi xử lý callback
    cleanup()

    if (data.action === window.google.picker.Action.PICKED) {
      const files = data.docs.map(file => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.sizeBytes,
        thumbnailLink: file.thumbnails?.[0]?.url,
        iconLink: file.iconUrl,
        webViewLink: file.url,
        downloadUrl: file.downloadUrl
      }))

      onFilesSelected(files)
    }

    // Đóng picker
    onClose()
  }

  return null // Component này không render gì
}

export default GoogleDrivePicker
