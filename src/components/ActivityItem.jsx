import { Box, Typography } from '@mui/material'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'

const ActivityItem = ({ activity, handleCloseModal }) => {
  const renderContent = () => {
    switch (activity.type) {
    // Board actions
    case 'createBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> created this board </Typography>
        </>
      )

    case 'moveCardToDifferentColumn':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> moved </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.prevColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> from </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.nextColumnTitle}
          </Typography>
        </>
      )
    case 'renameBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> renamed this board to </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.newBoardTitle}
          </Typography>
        </>
      )

    case 'changeDescriptionBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> changed the description of this board to </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.newBoardDescription}
          </Typography>
        </>
      )

    case 'changeTypeBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> changed the type of this board to </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.newBoardType}
          </Typography>
        </>
      )

    case 'addBoardAdmin':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> added </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.userName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> as an admin to this board </Typography>
        </>
      )

    case 'removeBoardAdmin':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> removed </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.userName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> from board&apos;s admins </Typography>
        </>
      )

    case 'removeMembers':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> removed </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.usersToRemove.map(user => user.displayName).join(', ')}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> from this board </Typography>
        </>
      )

    case 'openCloseBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> changed the status of this board to </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.newBoardStatus}
          </Typography>
        </>
      )

    case 'joinBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> joined this board </Typography>
        </>
      )

    case 'leaveBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> left this board </Typography>
        </>
      )


    // Column actions
    case 'createColumn':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> created a new column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.columnTitle}
          </Typography>
        </>
      )

    case 'moveColumnToDifferentBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> moved column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.sourceColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> to board </Typography>
          <Link
            to={`/board/${activity.data.destinationBoardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.destinationBoardTitle}
          </Link>
        </>
      )

    case 'columnMovedFromDifferentBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> moved column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.sourceColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> from board </Typography>
          <Link
            to={`/board/${activity.data.sourceBoardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.sourceBoardTitle}
          </Link>
        </>
      )

    case 'copyColumnToSameBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> created a new column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.destinationColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> by copying </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.sourceColumnTitle}
          </Typography>
        </>
      )

    case 'copyColumnToAnotherBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> copied column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.destinationColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> from column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.sourceColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> to board </Typography>
          <Link
            to={`/board/${activity.data.destinationBoardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.destinationBoardTitle}
          </Link>
        </>
      )

    case 'copyColumnFromAnotherBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> copied column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.destinationColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> from column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.sourceColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> of board </Typography>
          <Link
            to={`/board/${activity.data.sourceBoardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.sourceBoardTitle}
          </Link>
        </>
      )
    case 'renameColumn':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> renamed column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.oldColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.columnTitle}
          </Typography>
        </>
      )

    case 'moveAllCards':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> moved all cards from </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.sourceColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.destinationColumnTitle}
          </Typography>
        </>
      )

    case 'removeColumn':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> removed column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.columnTitle}
          </Typography>
        </>
      )

    case 'openCloseColumn':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> changed the status of column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.columnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.newColumnStatus}
          </Typography>
        </>
      )

    case 'openCloseAllColumns':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> changed the status of all columns </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.newColumnStatus}
          </Typography>
        </>
      )


    case 'createCard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> added </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem' }}
          >
            {activity.data.cardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> to {activity.data.columnTitle}</Typography>
        </>
      )

    case 'renameCard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> renamed card </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.oldCardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.newCardTitle}
          </Link>
        </>
      )

    case 'updateCardCover':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> updated the cover of card </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )

    case 'updateCardDescription':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> updated the description of card </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )


    case 'updateCardMembers':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> {activity.data.joinType} </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
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
          <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )

    case 'editAttachment':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> edit a attachment </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.attachmentName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.newAttachmentName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> in </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )

    case 'deleteAttachment':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> deleted a attachment </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.attachmentName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> in </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
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
          <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )

    case 'createChecklist':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> created a new checklist </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.checklistTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> in </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )

    case 'updateChecklist':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> updated the checklist </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.oldChecklistTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.newChecklistTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> in </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )

    case 'deleteChecklist':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> deleted the checklist </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.checklistTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> in </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )

    case 'addChecklistItem':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> added a new checklist item </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.checklistItemTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> in </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.checklistTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> in </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )

    case 'updateChecklistItem':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> updated the checklist item </Typography>
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
          <Typography variant="body2" sx={{ display: 'inline' }}> in </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )

    case 'deleteChecklistItem':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> deleted the checklist item </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.checklistItemTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> in </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.checklistTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> in </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
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
          <Typography variant="body2" sx={{ display: 'inline' }}> in </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
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
          <Typography variant="body2" sx={{ display: 'inline' }}> as done in </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
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
          <Typography variant="body2" sx={{ display: 'inline' }}> as undone in </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </> 
      ) 

    case 'addEditComment':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> was commented: </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.commentText}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> in </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
          {activity.data.commentType === 'edit' && (
            <>
              <Typography variant="body2" sx={{ display: 'inline' }}> (edited) </Typography>
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
          <Typography variant="body2" sx={{ display: 'inline' }}> set </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> to be due </Typography>
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
          <Typography variant="body2" sx={{ display: 'inline' }}> removed the due date from </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )

    case 'updateCardLocation':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> set location in </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
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
          <Typography variant="body2" sx={{ display: 'inline' }}> removed the location from </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )

    case 'deleteCard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> deleted </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )
    case 'closeCard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> changed the status of </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
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
          <Typography variant="body2" sx={{ display: 'inline' }}> changed the status of </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> to </Typography>
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
          <Typography variant="body2" sx={{ display: 'inline' }}> marked this card as completed </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )

    case 'uncompleteCard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> marked this card as not completed </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
        </>
      )
      

    case 'copyCardToSameBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> copied </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.newCardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> in column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.destinationColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> from </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.oldCardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> in column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.sourceColumnTitle}
          </Typography>
        </>
      )
    case 'copyCardToAnotherBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> copied </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.newCardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> in column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.destinationColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> from </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.oldCardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> in column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.sourceColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> to board </Typography>
          <Link
            to={`/board/${activity.data.destinationBoardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.destinationBoardTitle}
          </Link>
        </>
      )
    case 'copyCardFromAnotherBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> copied </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.newCardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> in column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.destinationColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> from </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.oldCardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> in column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.sourceColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> from board </Typography>
          <Link
            to={`/board/${activity.data.destinationBoardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.sourceBoardTitle}
          </Link>
        </>
      )

    case 'moveCardToDifferentBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> moved </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> in column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.sourceColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> to column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.destinationColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> in board </Typography>
          <Link
            to={`/board/${activity.data.destinationBoardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.destinationBoardTitle}
          </Link>
        </>
      )

    case 'cardMovedFromDifferentBoard':
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user.displayName}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> moved </Typography>
          <Link
            to={`/board/${activity.boardId}/card/${activity.cardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.cardTitle}
          </Link>
          <Typography variant="body2" sx={{ display: 'inline' }}> in column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.destinationColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> from column </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data.sourceColumnTitle}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> from board </Typography>
          <Link
            to={`/board/${activity.data.sourceBoardId}`}
            style={{ textDecoration: 'none', color: '#5394EE', fontSize: '0.875rem', fontWeight: 'bold' }}
            onClick={handleCloseModal}
          >
            {activity.data.sourceBoardTitle}
          </Link>
        </>
      )
    default:
      return (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.user?.displayName || 'User'}
          </Typography>
          <Typography variant="body2" sx={{ display: 'inline' }}> {activity.action || 'updated'} </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {activity.data?.title || activity.data?.cardTitle || ''}
          </Typography>
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
      <Avatar
        user={activity.user}
      />
      {/* <Avatar
        src={activity.user?.avatar}
        sx={{ width: 35, height: 35 }}
      /> */}
      <Box>
        {renderContent()}
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
          {activity.createdAt ? moment(activity.createdAt).format('llll') : '2 hours ago'}
        </Typography>
      </Box>
    </Box>
  )
}

export default ActivityItem
