import { Box, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { fetchCardActivityAPI } from '~/apis'
import Avatar from '~/components/Avatar'

const CardActivitySection = ({ activeCard }) => {

  const [activities, setActivities] = useState([])

  useEffect(() => {
    const fetchActivities = async () => {
      const activities = await fetchCardActivityAPI(activeCard._id)
      setActivities(activities)
    }
    fetchActivities()
  }, [])

  // Component ActivityItem riêng cho Card với "this card"
  const CardActivityItem = ({ activity }) => {
    const renderContent = () => {
      switch (activity.type) {
      case 'createCard':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> added this card to {activity.data.columnTitle}</Typography>
          </>
        )

      case 'renameCard':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> renamed this card from </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.oldCardTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.newCardTitle}
            </Typography>
          </>
        )

      case 'updateCardCover':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> updated the cover of this card</Typography>
          </>
        )

      case 'updateCardDescription':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> updated the description of this card</Typography>
          </>
        )

      case 'updateCardMembers':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> {activity.data.joinType} this card</Typography>
          </>
        )

      case 'addAttachment':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> added a new attachment </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.attachmentName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> to this card</Typography>
          </>
        )

      case 'editAttachment':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> edited attachment </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.attachmentName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.newAttachmentName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> in this card</Typography>
          </>
        )

      case 'deleteAttachment':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> deleted attachment </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.attachmentName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> from this card</Typography>
          </>
        )

      case 'attachGoogleDriveFile':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> attached a Google Drive file </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.fileName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> to this card </Typography>
          </>
        )

      case 'createChecklist':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> created checklist </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.checklistTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> in this card</Typography>
          </>
        )

      case 'updateChecklist':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> updated checklist </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.oldChecklistTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.newChecklistTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> in this card</Typography>
          </>
        )

      case 'deleteChecklist':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> deleted checklist </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.checklistTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> from this card</Typography>
          </>
        )

      case 'addChecklistItem':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> added checklist item </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.checklistItemTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.checklistTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> in this card</Typography>
          </>
        )

      case 'updateChecklistItem':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> updated checklist item </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.oldChecklistItemTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.newChecklistItemTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> in </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.checklistTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> in this card</Typography>
          </>
        )

      case 'deleteChecklistItem':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> deleted checklist item </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.checklistItemTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> from </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.checklistTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> in this card</Typography>
          </>
        )

      case 'checkChecklistItem':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> mark checklist item </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.checklistItemTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> as done in this card</Typography>
          </>
        )

      case 'uncheckChecklistItem':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> uncheck checklist item </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.checklistItemTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> as undone in this card</Typography>
          </>
        )

      case 'assignChecklistItem':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> assigned checklist item </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.checklistItemTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.assigneeDisplayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> in this card</Typography>
          </>
        )

      case 'addEditComment':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> commented: </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.commentText}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> on this card</Typography>
            {activity.data.commentType === 'edit' && (
              <>
                <Typography variant="body2" sx={{ display: 'inline' }}> (edited)</Typography>
              </>
            )}
          </>
        )

      case 'setDueDate':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> set this card to be due </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {new Date(activity.data.dueDate).toLocaleDateString('en-GB', {
                year: new Date(activity.data.dueDate).getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> at </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.dueDateTime}
            </Typography>
          </>
        )

      case 'removeDueDate':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> removed the due date from this card</Typography>
          </>
        )

      case 'updateCardLocation':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> set location of this card to </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.location}
            </Typography>
          </>
        )

      case 'removeCardLocation':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> removed the location from this card</Typography>
          </>
        )

      case 'closeCard':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> changed the status of this card to </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              closed
            </Typography>
          </>
        )

      case 'openCard':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> changed the status of this card to </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              open
            </Typography>
          </>
        )

      case 'completeCard':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> marked this card as completed</Typography>
          </> 
        )

      case 'uncompleteCard':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> marked this card as not completed</Typography>
          </>
        )
      case 'moveCardToDifferentColumn':
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user.displayName}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> moved this card from </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.prevColumnTitle}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.data.nextColumnTitle}
            </Typography>
          </>
        )

      default:
        return (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {activity.user?.displayName || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline' }}> {activity.action || 'updated'} this card</Typography>
          </>
        )
      }
    }

    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        m: 1
      }}>
        {/* <Avatar
          src={activity.user?.avatar}
          sx={{ width: 35, height: 35 }}
        /> */}
        <Avatar user={activity.user} cardId={activeCard?._id} />
        <Box>
          {renderContent()}
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
            {activity.createdAt ? moment(activity.createdAt).format('llll') : '2 hours ago'}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <CardActivityItem key={index} activity={activity} />
        ))
      ) : (
        <Typography>No activities found</Typography>
      )}
    </Box>
  )
}

export default CardActivitySection
