import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import CancelIcon from '@mui/icons-material/Cancel'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { toast } from 'react-toastify'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator, singleFileValidatorForAttachment } from '~/utils/validators'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardUserGroup from './CardUserGroup'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { updateCardDetailsAPI } from '~/apis'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { clearAndHideCurrentActiveCard, selectActiveCard, selectIsShowModalActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'
import CardActivitySection from './CardCommentTest'
import Checklist from './CardFunctions/Checklist'
import Dates from './CardFunctions/Dates'
import CardChecklist from './CardChecklist'
import CardAttachment from './CardAttachment'
import { Checkbox, FormControlLabel } from '@mui/material'
import DateTimeDisplay from './CardDateTimeDisplay'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

function ActiveCard() {

  const dispatch = useDispatch()
  const activeCard = useSelector(selectActiveCard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)
  const currentUser = useSelector(selectCurrentUser)

  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
  }

  // Gọi API cập nhật thông tin Card
  const callApiUpdateCard = async (updateData) => {
    // console.log('updateData', updateData)
    const res = await updateCardDetailsAPI(activeCard._id, updateData)

    // // Cập nhật thông tin Card mới nhất vào Redux
    dispatch(updateCurrentActiveCard(res))
    // // Cập nhật thông tin Card mới nhất vào Redux của Board
    dispatch(updateCardInBoard(res))

    return res

  }

  const onUpdateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() })
  }

  const onUpdateDueDate = (dueDateData) => {
    // console.log('dueDateData', dueDateData)
    callApiUpdateCard({ dueDate: dueDateData })
  }

  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription })
  }

  const onUploadCardCover = (event) => {
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])

    // Gọi API...
    toast.promise(
      callApiUpdateCard(reqData).finally(() => event.target.value = ''),
      {
        pending: 'Uploading...'
      }
    )
  }

  const onAddCardAttachment = (event) => {
    const error = singleFileValidatorForAttachment(event.target?.files[0]);
    if (error) {
      toast.error(error);
      return;
    }

    let reqData = new FormData()
    reqData.append('attachmentFile', event.target?.files[0])

    // Gọi API...
    toast.promise(
      callApiUpdateCard(reqData),
      {
        pending: 'Uploading...'
      }
    )
  }

  const onEditCardAttachment = (attachmentToEdit) => {
    callApiUpdateCard({ attachmentToEdit })
  }

  const onAddCardComment = async (commentToAdd) => {
    await callApiUpdateCard({ commentToAdd })
  }

  const onUpdateCardMembers = (incomingMemberInfo) => {
    callApiUpdateCard({ incomingMemberInfo })
  }

  const onUpdateChecklist = (incomingChecklistInfo) => {
    // console.log('incomingChecklistInfo', incomingChecklistInfo)
    callApiUpdateCard({ incomingChecklistInfo })
  }

  const onUpdateChecklistItem = (incomingChecklistItemInfo) => {
    // console.log('incomingChecklistInfo', incomingChecklistItemInfo)
    callApiUpdateCard({ incomingChecklistItemInfo })
  }

  const [dateAnchorEl, setDateAnchorEl] = useState(null)

  const handleOpenDatePopover = (event) => {
    setDateAnchorEl(event.currentTarget)
  } 

  const handleCloseDatePopover = () => {
    setDateAnchorEl(null)
  }

  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: 'auto' }}
        // {...getRootProps()}
        >
      <Box sx={{
        position: 'relative',
        width: '86%',
        maxWidth: '900px',
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '40px 20px 20px',
        margin: '50px auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>

        {/* Rest of your existing modal content */}
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>


        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

        {activeCard?.cover &&
          <Box sx={{ mb: 4 }}>
            <img
              style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
              src={activeCard?.cover}
              alt="card-cover"
            />
          </Box>
        }
        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            inputFontSize='22px'
            value={activeCard?.title}
            onChangedValue={onUpdateCardTitle} />
        </Box>

        <Grid container sx={{ m: 0 }} className='nghia'>
          {/* Left side */}
          <Grid item xs={12} sm={8.8} sx={{ mr: 1.5 }}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Members</Typography>

              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardUserGroup
                cardMemberIds={activeCard?.memberIds}
                onUpdateCardMembers={onUpdateCardMembers}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              

              {/* Feature 02: Xử lý các thành viên của Card
              <CardUserGroup
                cardMemberIds={activeCard?.memberIds}
                onUpdateCardMembers={onUpdateCardMembers}
              /> */}
              {activeCard?.dueDate.dueDate && (
                <DateTimeDisplay 
                startDate={activeCard.dueDate?.startDate}
                startTime={activeCard.dueDate?.startTime}
                dueDate={activeCard.dueDate?.dueDate}
                dueDateTime={activeCard.dueDate?.dueDateTime}
                isComplete={activeCard.dueDate?.isComplete}
                handleOpenDatePopover={handleOpenDatePopover}
                onUpdateDueDate={onUpdateDueDate}
              />
              
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Description</Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                onUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <CardAttachment
                onAddCardAttachment={onAddCardAttachment}
                attachments={activeCard?.attachments}
                onEditCardAttachment={onEditCardAttachment}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              {/* Feature 04: Xử lý checklist của Card */}
              {/* <CardChecklist
                // cardChecklist={activeCard?.checklists}
                onUpdateChecklist={onUpdateChecklist}
              /> */}
              {activeCard?.checklists.map((checklist, index) => (
                <CardChecklist
                  key={index}
                  cardMemberIds={activeCard?.memberIds}
                  cardChecklist={checklist}
                  onUpdateChecklist={onUpdateChecklist}
                  onUpdateChecklistItem={onUpdateChecklistItem}
                />
              ))}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Activity</Typography>
              </Box>

              {/* Feature 05: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection
                cardMemberIds={activeCard?.memberIds}
                cardComments={activeCard?.comments}
                onAddCardComment={onAddCardComment}
              />
            </Box>
          </Grid>

          {/* Right side */}
          <Grid item xs={12} sm={3}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
            <Stack direction="column" spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
              {!activeCard?.memberIds.includes(currentUser?._id) &&
                <SidebarItem className="active"
                  onClick={() => onUpdateCardMembers({ userId: currentUser?._id, action: CARD_MEMBER_ACTIONS.ADD })}
                >
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  Join
                </SidebarItem>
              }
              {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              <SidebarItem className="active" component="label">
                <ImageOutlinedIcon fontSize="small" />
                Cover
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>

              <SidebarItem className="active" component="label">
                <AttachFileOutlinedIcon fontSize="small" />
                Attachment
                <VisuallyHiddenInput type="file" onChange={onAddCardAttachment} />
              </SidebarItem>
              <SidebarItem><LocalOfferOutlinedIcon fontSize="small" />Labels</SidebarItem>

              {/* Checklist */}
              <Checklist onUpdateChecklist={onUpdateChecklist} />

              {/* Dates */}

              <Dates 
                onUpdateDueDate={onUpdateDueDate}
                handleClosePopover={handleCloseDatePopover}
                anchorEl={dateAnchorEl}
              />
              <SidebarItem onClick={handleOpenDatePopover} >
                <WatchLaterOutlinedIcon fontSize="small" />
                Dates
              </SidebarItem>
              {/* <SidebarItem><WatchLaterOutlinedIcon fontSize="small" />Dates</SidebarItem> */}
              <SidebarItem><AutoFixHighOutlinedIcon fontSize="small" />Custom Fields</SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Power-Ups</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem><AspectRatioOutlinedIcon fontSize="small" />Card Size</SidebarItem>
              <SidebarItem><AddToDriveOutlinedIcon fontSize="small" />Google Drive</SidebarItem>
              <SidebarItem><AddOutlinedIcon fontSize="small" />Add Power-Ups</SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem><ArrowForwardOutlinedIcon fontSize="small" />Move</SidebarItem>
              <SidebarItem><ContentCopyOutlinedIcon fontSize="small" />Copy</SidebarItem>
              <SidebarItem><AutoAwesomeOutlinedIcon fontSize="small" />Make Template</SidebarItem>
              <SidebarItem><ArchiveOutlinedIcon fontSize="small" />Archive</SidebarItem>
              <SidebarItem><ShareOutlinedIcon fontSize="small" />Share</SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard