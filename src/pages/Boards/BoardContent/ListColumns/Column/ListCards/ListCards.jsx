import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Box } from '@mui/material'
import Card from './Card/Card'

function ListCards(props) {
  const { column, cards } = props

  return (
    <SortableContext items={cards?.map(c => c._id)} strategy={verticalListSortingStrategy}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: '0 5px 5px 5px',
        m: '0 5px ',
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: (theme) => `calc( ${theme.trelloCustom.boardContentHeight} - ${theme.spacing(10)} - ${theme.trelloCustom.columnHeadersHeight} - ${theme.trelloCustom.columnFooterHeight})`,
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
        '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#a5a7b8', cursor: 'pointer' }
      }}>
        {/* List card */}
        {cards?.map((card) => {
          return (
            <Card key={card._id} card={card} />
          )
        })}
      </Box>
    </SortableContext>
  )
}

export default ListCards