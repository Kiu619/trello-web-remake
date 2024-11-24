import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import { Mention, MentionsInput } from 'react-mentions'

import { Button, Popover } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'

const CardActivitySection = ({ column, activeCard, cardMemberIds = [], cardComments = [], onAddCardComment, onUpdateCardComment }) => {
  const currentUser = useSelector(selectCurrentUser)
  const board = useSelector(selectCurrentActiveBoard)
  const FE_CardMembers = cardMemberIds.map(memberId => board?.FE_allUsers.find(user => user._id === memberId)).filter(user => user?._id !== currentUser?._id)

  const formattedBoardMembers = FE_CardMembers.map(member => ({
    id: member?._id,
    display: member?.displayName,
    avatarUrl: member?.avatar
  }))

  const [comment, setComment] = useState('')
  const [mention, setMention] = useState([])

  const [editingCommentId, setEditingCommentId] = useState('')
  const [editingCommentValue, setEditingCommentValue] = useState('')
  const [editingCommentTaggedUserIds, setEditingCommentTaggedUserIds] = useState([])
  const [editingCommentedAt, setEditingCommentedAt] = useState('')

  const [isFocused, setIsFocused] = useState(false)

  const buttonStyle = {
    justifyContent: 'flex-start',
    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#A1BDD914' : '#3f444814'),
    color: '#7e8b9a',
    '&:hover': {
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#45505A' : '#0c93ff1a')
    }
  }

  const handleChange = (event, newValue, newPlainTextValue, mentions) => {

    if (newValue === '') {
      setMention([])
      setComment(newValue)
      return
    }

    if (comment.length > newPlainTextValue.length) {
      const lastMention = mentions[mentions.length - 1]
      if (lastMention) {
        const mentionIndex = lastMention.plainTextIndex
        const mentionLength = lastMention.display.length
        const deletedIndex = comment.length - 1
        if (deletedIndex >= mentionIndex && deletedIndex < mentionIndex + mentionLength) {
          const newComment = comment.substring(0, mentionIndex) + comment.substring(mentionIndex + mentionLength)
          setComment(newComment)
          return
        }
      }
    }
    setComment(newValue)
  }

  const handleAddCardComment = (event) => {
    if ((event.key === 'Enter' && !event.shiftKey) || event.type === 'click') {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
      }
      if (!event.target?.value) return

      const uniqueMentions = [...new Set(mention)]

      const commentToAdd = {
        userAvatar: currentUser?.avatar,
        userDisplayName: currentUser?.displayName,
        content: comment.trim(),
        taggedUserIds: uniqueMentions,
        boardId: board?._id
      }

      onAddCardComment(commentToAdd).then(() => {
        setComment('')
        setMention([])
      })
    }
  }

  const handleChangeEditingComment = (event, newValue, newPlainTextValue, mentions) => {
    if (newValue === '') {
      setEditingCommentTaggedUserIds([])
      setEditingCommentValue(newValue)
      return
    }
    if (editingCommentValue.length > newPlainTextValue.length) {
      const lastMention = mentions[mentions.length - 1]
      if (lastMention) {
        const mentionIndex = lastMention.plainTextIndex
        const mentionLength = lastMention.display.length
        const deletedIndex = editingCommentValue.length - 1
        if (deletedIndex >= mentionIndex && deletedIndex < mentionIndex + mentionLength) {
          const newComment = editingCommentValue.substring(0, mentionIndex) + editingCommentValue.substring(mentionIndex + mentionLength)
          setEditingCommentValue(newComment)
          return
        }
      }
    }
    setEditingCommentValue(newValue)
  }

  const handleUpdateComment = (commentId, newComment) => {
    if (!newComment) return

    const uniqueMentions = [...new Set(editingCommentTaggedUserIds)]

    const commentToUpdate = {
      userAvatar: currentUser?.avatar,
      userDisplayName: currentUser?.displayName,
      content: newComment.trim(),
      taggedUserIds: uniqueMentions,
      boardId: board?._id,
      _id: commentId,
      commentedAt: editingCommentedAt,
      action: 'EDIT'
    }


    onUpdateCardComment(commentToUpdate)
    setEditingCommentId('')
    setEditingCommentValue('')
    setEditingCommentTaggedUserIds([])
  }

  const handleDeleteComment = (commentId) => {
    const commentToUpdate = {
      _id: commentId,
      action: 'DELETE'
    }

    onUpdateCardComment(commentToUpdate)
    handleClosePopover()
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteCommentId, setDeleteCommentId] = useState(null)

  const handleOpenPopover = (event, commentId) => {
    setAnchorEl(event.currentTarget)
    setDeleteCommentId(commentId)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
    setDeleteCommentId(null)
  }

  const openPopover = Boolean(anchorEl)
  const id = openPopover ? 'simple-popover' : undefined

  return (
    <Box sx={{ mt: 2 }}>
      {column?.isClosed === false && activeCard?.isClosed === false && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar
            sx={{ width: 36, height: 36, cursor: 'pointer' }}
            alt={currentUser?.displayName}
            src={currentUser?.avatar}
          />
          <Box sx={{ width: '100%' }}>
            <MentionsInput
              value={comment}
              onChange={handleChange}
              className="mentions__input"
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleAddCardComment}
              style={{
                control: {
                  fontSize: '14px',
                  fontWeight: '500',
                  marginLeft: '8px',
                  borderRadius: '8px',
                  minHeight: 45,
                  lineHeight: '20px'
                },
                highlighter: {
                  padding: 5,
                  overflow: 'hidden'
                },
                input: {
                  margin: 0,
                  color: 'inherit',
                  marginLeft: '8px',
                  lineHeight: '20px'
                },
                '&multiLine': {
                  control: {
                    fontFamily: 'monospace',
                    border: '1px solid silver'
                  },
                  highlighter: {
                    padding: 5
                  },
                  input: {
                    padding: '5px 5px 5px 15px',
                    minHeight: 63,
                    outline: 0,
                    border: 0,
                    width: '100%'
                  }
                },
                '&singleLine': {
                  display: 'inline-block',
                  width: 180
                }
              }}
            >
              <Mention
                trigger="@"
                data={formattedBoardMembers}
                markup="@__display__"
                renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
                  <Box key={index} sx={{
                    display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f'),
                    '&:hover': {
                      opacity: 0.7
                    }
                  }}>
                    <Avatar alt={suggestion.display} src={suggestion.avatarUrl} />
                    <Typography variant="subtitle2">{suggestion.display}</Typography>
                  </Box>
                )}
                onAdd={(id) => {
                  setMention([...mention, id])
                }}
                appendSpaceOnAdd={true}
                className="mentions__mention"
              />
            </MentionsInput>
          </Box>
        </Box>
      )}
      {isFocused && (
        <Box sx={{ display: 'flex', gap: 1, mt: 1, ml: 1, justifyContent: 'end' }}>
          <Button sx={buttonStyle} onClick={() => {
            setComment('')
            setMention([])
            setIsFocused(false)
          }}>
            Cancel
          </Button>
          <Button sx={buttonStyle} onClick={() => {
            handleAddCardComment({ type: 'click' })
          }}>
            Send
          </Button>
        </Box>
      )}

      {cardComments.length === 0 &&
        <Typography sx={{ pl: '45px', fontSize: '14px', fontWeight: '500', color: '#b1b1b1' }}>No activity found!</Typography>
      }
      {cardComments.map((comment, index) =>
        <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5 }} key={index}>
          <Tooltip title={comment?.userDisplayName}>
            <Avatar
              sx={{ width: 36, height: 36, cursor: 'pointer' }}
              alt={comment?.userDisplayName}
              src={comment?.userAvatar}
            />
          </Tooltip>
          <Box sx={{ width: 'inherit' }}>
            <Typography variant="span" sx={{ fontWeight: 'bold', mr: 1 }}>
              {comment?.userDisplayName}
            </Typography>

            <Typography variant="span" sx={{ fontSize: '12px' }}>
              {moment(comment.commentedAt).format('llll')}
            </Typography>
            {comment?.isEdited && <Typography variant="span" sx={{ ml: '5px', fontSize: '12px', color: '#b1b1b1' }}>(edited)</Typography>}

            {editingCommentId === comment._id ? (
              <>
                <Box sx={{ width: '100%' }}>
                  <MentionsInput
                    value={editingCommentValue}
                    onChange={handleChangeEditingComment}
                    style={{
                      control: {
                        fontSize: '14px',
                        fontWeight: '500',
                        marginLeft: '8px',
                        borderRadius: '8px',
                        minHeight: 23,
                        lineHeight: '20px'
                      },
                      highlighter: {
                        padding: 5,
                        overflow: 'hidden'
                      },
                      input: {
                        margin: 0,
                        color: 'inherit',
                        marginLeft: '8px',
                        lineHeight: '20px'
                      },
                      '&multiLine': {
                        control: {
                          fontFamily: 'monospace',
                          border: '1px solid silver'
                        },
                        highlighter: {
                          padding: 5
                        },
                        input: {
                          padding: '5px 5px 5px 15px',
                          minHeight: 40,
                          outline: 0,
                          border: 0,
                          width: '100%'
                        }
                      },
                      '&singleLine': {
                        control: {
                          fontFamily: 'monospace',
                          border: '1px solid silver'
                        },
                        highlighter: {
                          padding: 5
                        },
                        input: {
                          padding: '5px 5px 5px 15px',
                          maxHeight: 40,
                          outline: 0,
                          border: 0,
                          width: '100%'
                        }
                      }
                    }}
                  >
                    <Mention
                      trigger="@"
                      data={formattedBoardMembers}
                      markup="@__display__"
                      renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
                        <Box key={index} sx={{
                          display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
                          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f'),
                          '&:hover': {
                            opacity: 0.7
                          }
                        }}>
                          <Avatar alt={suggestion.display} src={suggestion.avatarUrl} />
                          <Typography variant="subtitle2">{suggestion.display}</Typography>
                        </Box>
                      )}
                      onAdd={(id) => {
                        setEditingCommentTaggedUserIds([...editingCommentTaggedUserIds, id])
                      }}
                      className="mentions__mention"
                      appendSpaceOnAdd={true}
                      displayTransform={(id, display) => `@${display}`}
                    />
                  </MentionsInput>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: '#aab3bd', cursor: 'pointer', mr: 1.5 }}
                  onClick={() => {
                    handleUpdateComment(comment._id, editingCommentValue)
                  }}
                >
                  Save
                </Typography>
                <Typography variant="caption" sx={{ color: '#aab3bd', cursor: 'pointer' }} onClick={() => {
                  setEditingCommentId('')
                  setEditingCommentValue('')
                  setEditingCommentTaggedUserIds([])
                }}>Cancel</Typography>
              </>
            ) : (
              (() => {
                let content = comment.content
                const regex = /@(\w+)/g
                content = content.replace(regex, '<strong style="color: orange;">@$1</strong>')
                return <Typography variant="subtitle2" dangerouslySetInnerHTML={{ __html: content }} />
              })()
            )}

            {column?.isClosed === false && activeCard?.isClosed === false && currentUser._id === board.ownerIds[0] && currentUser._id != comment.userId && (
              <>
                <Typography variant="caption" sx={{ color: '#aab3bd', cursor: 'pointer' }} onClick={(e) => handleOpenPopover(e, comment._id)}>Delete</Typography>
              </>
            )}

            {column?.isClosed === false && activeCard?.isClosed === false && !editingCommentId && currentUser._id === comment.userId && (
              <>
                <Typography variant="caption" sx={{ color: '#aab3bd', cursor: 'pointer', mr: 1.5 }} onClick={() => {
                  setEditingCommentId(comment._id)
                  setEditingCommentValue(comment.content)
                  setEditingCommentTaggedUserIds(comment.taggedUserIds)
                  setEditingCommentedAt(comment.commentedAt)
                }}>Edit</Typography>
                <Typography variant="caption" sx={{ color: '#aab3bd', cursor: 'pointer' }}
                  onClick={(e) => handleOpenPopover(e, comment._id)}
                >Delete</Typography>
              </>
            )}
          </Box>
        </Box>
      )}
      <Popover
        id={id}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography>Delete comment?</Typography>
          <Typography variant="body2" color="textSecondary">
            Deleting a comment is forever. There is no undo.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClosePopover} sx={{ mr: 1 }}>Cancel</Button>
            <Button onClick={() => handleDeleteComment(deleteCommentId)} color="error" variant="contained">
              Delete comment
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  )
}

export default CardActivitySection
