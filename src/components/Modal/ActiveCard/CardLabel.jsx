import {
  Popover,
  Box,
  Typography
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { updateCardLabelAPI } from '~/apis'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { updateCardLabelIds } from '~/redux/activeCard/activeCardSlice'
import Label from '~/components/Label'

const CardLabel = ({ anchorEl, handleCloseLabelPopover, activeCard }) => {
  const dispatch = useDispatch()

  const handleLabelSelect = async (updatedLabelIds) => {
    try {
      const response = await updateCardLabelAPI(activeCard._id, { labelIds: updatedLabelIds })
      // Cập nhật card trong board (activeBoardSlice)
      dispatch(updateCardInBoard(response))

      // Cập nhật activeCard (activeCardSlice)
      dispatch(updateCardLabelIds(updatedLabelIds))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating card labels:', error)
    }
  }

  return (
    <Popover
      open={!!anchorEl}
      onClose={handleCloseLabelPopover}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      <Label
        showCheckbox={true}
        onLabelSelect={handleLabelSelect}
      />
    </Popover>
  )
}

export default CardLabel