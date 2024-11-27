import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import CancelIcon from '@mui/icons-material/Cancel'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createNewNotificationAPI, updateCardDetailsAPI } from '~/apis'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { selectCurrentActiveBoard, updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { clearAndHideCurrentActiveCard, fetchCardDetailsAPI, selectActiveCard, selectActiveCardError, selectIsShowModalActiveCard, setCardError, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { socketIoIntance } from '~/socketClient'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'
import { singleFileValidatorForAttachment } from '~/utils/validators'
import CardAttachment from './CardAttachment'
import CardChecklist from './CardChecklist'
import CardActivitySection from './CardCommentTest'
import DateTimeDisplay from './CardDateTimeDisplay'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import Checklist from './CardFunctions/Checklist'
import Copy from './CardFunctions/Copy'
import Cover from './CardFunctions/Cover'
import Dates from './CardFunctions/Dates'
import Delete from './CardFunctions/Delete'
import Location from './CardFunctions/Location'
import Move from './CardFunctions/Move'
import OpenClose from './CardFunctions/OpenClose'
import LocationMap from './CardLocationMap'
import CardUserGroup from './CardUserGroup'

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
  const { boardId: fullBoardId, cardId: fullCardId } = useParams()

  const boardId = fullBoardId.substring(0, 24)
  const cardId = fullCardId?.substring(0, 24)

  const navigate = useNavigate()
  const currentBoard = useSelector(selectCurrentActiveBoard)
  const error = useSelector(selectActiveCardError)


  const dispatch = useDispatch()
  const activeCard = useSelector(selectActiveCard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)

  const column = currentBoard.columns.find(c => c._id === activeCard?.columnId)

  const currentUser = useSelector(selectCurrentUser)

  // Date Popover
  const [dateAnchorEl, setDateAnchorEl] = useState(null)
  const handleOpenDatePopover = (event) => { setDateAnchorEl(event.currentTarget) }
  const handleCloseDatePopover = () => { setDateAnchorEl(null) }

  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
    navigate(`/board/${currentBoard._id}`)
  }

  if (error) {
    dispatch(setCardError(null))
    navigate(`/board/${currentBoard._id}`)
  }

  useEffect(() => {
    if (cardId) {
      dispatch(fetchCardDetailsAPI(cardId))
    }
    // if (boardId !== activeCard._id) {
    //   navigate(`/board/${currentBoard._id}`)
    // }
  }, [cardId, dispatch])

  useEffect(() => {
    const handleUpdateCard = (receivedCardId) => {
      if (receivedCardId === activeCard?._id) {
        dispatch(fetchCardDetailsAPI(activeCard?._id))
      }
    }

    socketIoIntance.on('activeCardUpdate', handleUpdateCard)

    return () => {
      socketIoIntance.off('activeCardUpdate', handleUpdateCard)
    }
  }, [activeCard?._id, dispatch])

  useEffect(() => {
    if (activeCard) {
      if (activeCard.boardId !== boardId) {
        // toast.error('Card not found')
        navigate(`/board/${currentBoard._id}`)
      }
    }
  }, [activeCard, boardId, currentBoard._id, navigate])

  const callApiUpdateCard = async (updateData) => {
    // console.log('updateData', updateData)
    const res = await updateCardDetailsAPI(activeCard._id, updateData)

    // // Cập nhật thông tin Card mới nhất vào Redux
    dispatch(updateCurrentActiveCard(res))
    // // Cập nhật thông tin Card mới nhất vào Redux của Board
    dispatch(updateCardInBoard(res))

    // Gửi thông báo tới server thông qua socket.io
    // socketIoIntance.emit('FE_UPDATE_CARD', res)
    setTimeout(() => {
      socketIoIntance.emit('batch', { boardId: currentBoard._id })
      socketIoIntance.emit('activeCardUpdate', activeCard._id)
    }, 1234)

    return res

  }

  const onUpdateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() })
  }

  const onUpdateDueDate = (dueDateData) => {
    console.log('dueDateData', dueDateData)
    // callApiUpdateCard({ dueDate: dueDateData })
    callApiUpdateCard({ dueDate: dueDateData })
      .then(response => {
        // Xử lý notification - lọc bỏ currentUser._id
        if (activeCard?.memberIds?.length > 0) {
          const otherMembers = activeCard.memberIds.filter(memberId => memberId !== currentUser._id)

          otherMembers.forEach(memberId => {
            createNewNotificationAPI({
              type: 'dueDateInCard',
              userId: memberId,
              details: {
                boardId: currentBoard._id,
                boardTitle: currentBoard.title,
                cardId: activeCard._id,
                cardTitle: activeCard.title,
                senderId: currentUser._id,
                senderName: currentUser.username
              }
            }).then(() => {
              socketIoIntance.emit('FE_FETCH_NOTI', { userId: memberId })
            })
          })
        }
        return response
      })
  }

  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription })
  }

  const onAddCardAttachment = (event) => {
    const error = singleFileValidatorForAttachment(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }

    let reqData = new FormData()
    reqData.append('attachmentFile', event.target?.files[0])

    toast.promise(
      callApiUpdateCard(reqData)
        .then(response => {
          // Sau khi upload thành công
          toast.success('Upload attachment successfully')

          // Xử lý notification - lọc bỏ currentUser._id
          if (activeCard?.memberIds?.length > 0) {
            const otherMembers = activeCard.memberIds.filter(memberId => memberId !== currentUser._id)

            otherMembers.forEach(memberId => {
              createNewNotificationAPI({
                type: 'attachmentInCard',
                userId: memberId,
                details: {
                  boardId: currentBoard._id,
                  boardTitle: currentBoard.title,
                  cardId: activeCard._id,
                  cardTitle: activeCard.title,
                  attachmentName: event.target?.files[0].name,
                  senderId: currentUser._id,
                  senderName: currentUser.username
                }
              }).then(() => {
                socketIoIntance.emit('FE_FETCH_NOTI', { userId: memberId })
              })
            })
          }
          return response
        }),
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

  const onUpdateCardComment = (commentToUpdate) => {
    callApiUpdateCard({ commentToUpdate })
  }

  const onUpdateCardMembers = (incomingMemberInfo) => {
    callApiUpdateCard({ incomingMemberInfo })
  }

  const onUpdateChecklist = (incomingChecklistInfo) => {
    callApiUpdateCard({ incomingChecklistInfo })
  }

  const onUpdateChecklistItem = (incomingChecklistItemInfo) => {
    if (incomingChecklistItemInfo.assignMember) {
      const otherMembers = activeCard.memberIds.filter(memberId => memberId !== currentUser._id)

      otherMembers.forEach(memberId => {
        createNewNotificationAPI({
          type: 'assignment',
          userId: memberId,
          details: {
            boardId: currentBoard._id,
            boardTitle: currentBoard.title,
            cardId: activeCard._id,
            cardTitle: activeCard.title,
            checklistTitle: incomingChecklistItemInfo.cardChecklist.title,
            senderId: currentUser._id,
            senderName: currentUser.username
          }
        }).then(() => {
          socketIoIntance.emit('FE_FETCH_NOTI', { userId: memberId })
        })
      })

      callApiUpdateCard({ incomingChecklistItemInfo })
    } else {
      callApiUpdateCard({ incomingChecklistItemInfo })
    }
  }

  const updateLocation = (location) => {
    callApiUpdateCard({ location })
  }

  const onUpdateOpenCloseCard = (isClosed) => {
    callApiUpdateCard({ isClosed })
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
          {activeCard?.isClosed === false && column?.isClosed === false ? (
            <ToggleFocusInput
              inputFontSize='22px'
              value={activeCard?.title || ''}
              onChangedValue={onUpdateCardTitle}
            />)
            : (
              <Typography variant="h5" sx={{ fontWeight: '600', fontSize: '22px' }}>{activeCard?.title}</Typography>
            )}
        </Box>

        <Grid container sx={{ m: 0 }} className='nghia'>
          {/* Left side */}
          <Grid item xs={12} sm={8.8} sx={{ mr: 1.5 }}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Members</Typography>

              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardUserGroup
                column={column}
                activeCard={activeCard}
                currentUser={currentUser}
                currentBoard={currentBoard}
                cardMemberIds={activeCard?.memberIds}
                onUpdateCardMembers={onUpdateCardMembers}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              {activeCard?.dueDate.dueDate && (
                <DateTimeDisplay
                  column={column}
                  activeCard={activeCard}
                  title={activeCard.dueDate?.title}
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
              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor
                column={column}
                activeCard={activeCard}
                cardDescriptionProp={activeCard?.description}
                onUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            {activeCard?.location?.lat && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LocationOnOutlinedIcon />
                  <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Location</Typography>
                </Box>
                <LocationMap column={column} activeCard={activeCard} location={activeCard.location} updateLocation={updateLocation} />
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <CardAttachment
                column={column}
                activeCard={activeCard}
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
                  column={column}
                  activeCard={activeCard}
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
              <CardActivitySection id
                column={column}
                activeCard={activeCard}
                cardMemberIds={activeCard?.memberIds}
                cardComments={activeCard?.comments}
                onAddCardComment={onAddCardComment}
                onUpdateCardComment={onUpdateCardComment}
              />
            </Box>
          </Grid>

          {/* Right side */}
          <Grid item xs={12} sm={3}>
            {column?.isClosed === false && activeCard?.isClosed === false && (
              <Stack direction="column" spacing={1}>
                <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
                {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
                {!activeCard?.memberIds.includes(currentUser?._id) &&
                  <SidebarItem className="active"
                    onClick={() => onUpdateCardMembers({ userId: currentUser?._id, action: CARD_MEMBER_ACTIONS.ADD })}
                  >
                    <PersonOutlineOutlinedIcon fontSize="small" />
                    Join
                  </SidebarItem>
                }

                {activeCard?.memberIds.includes(currentUser?._id) &&
                  <SidebarItem className="active"
                    onClick={() => onUpdateCardMembers({ userId: currentUser?._id, action: CARD_MEMBER_ACTIONS.REMOVE })}
                  >
                    <PersonOutlineOutlinedIcon fontSize="small" />
                    Leave
                  </SidebarItem>
                }

                {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
                <Cover callApiUpdateCard={callApiUpdateCard} card={activeCard} />

                <SidebarItem className="active" component="label">
                  <AttachFileOutlinedIcon fontSize="small" />
                  Attachment
                  <VisuallyHiddenInput type="file" onChange={onAddCardAttachment} />
                </SidebarItem>

                {/* <SidebarItem><LocalOfferOutlinedIcon fontSize="small" />Labels</SidebarItem> */}

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
                {/* Location */}
                <Location updateLocation={updateLocation} />
              </Stack>
            )}
            {column?.isClosed === false && activeCard?.isClosed === false && (<Divider sx={{ my: 2 }} />)}

            {column?.isClosed === false && activeCard?.isClosed === false && (
              <Stack direction="column" spacing={1}>
                <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Power-Ups</Typography>
                {/* <SidebarItem><AspectRatioOutlinedIcon fontSize="small" />Card Size</SidebarItem> */}
                <SidebarItem><AddToDriveOutlinedIcon fontSize="small" />Google Drive</SidebarItem>
                <SidebarItem><AddOutlinedIcon fontSize="small" />Add Power-Ups</SidebarItem>
              </Stack>
            )}

            {column?.isClosed === false && activeCard?.isClosed === false && (<Divider sx={{ my: 2 }} />)}

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>

            {column?.isClosed === false && activeCard?.isClosed === false && (
              <Stack direction="column" spacing={1} sx={{ mb: 1 }}>
                {/* <SidebarItem><ArrowForwardOutlinedIcon fontSize="small" />Move</SidebarItem> */}
                {currentBoard.ownerIds.includes(currentUser?._id) && (<Move activeCard={activeCard} currentBoard={currentBoard} />)}
                {/* <SidebarItem><ContentCopyOutlinedIcon fontSize="small" />Copy</SidebarItem> */}
                <Copy activeCard={activeCard} />
                <SidebarItem><ArchiveOutlinedIcon fontSize="small" />Archive</SidebarItem>
                <SidebarItem><ShareOutlinedIcon fontSize="small" />Share</SidebarItem>

                {/* Open / Close */}
                {/* Delete */}
                {currentBoard.ownerIds.includes(currentUser?._id) && (<Delete activeCard={activeCard} currentBoard={currentBoard}/>)}
              </Stack>
            )}
            {currentBoard.ownerIds.includes(currentUser?._id) && (<OpenClose column={column} activeCard={activeCard} onUpdateOpenCloseCard={onUpdateOpenCloseCard} />)}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard