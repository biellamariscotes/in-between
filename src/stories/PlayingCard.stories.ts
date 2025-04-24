import { defineComponent, h, provide, ref } from 'vue'
import PlayingCard from '@/components/game-table/PlayingCard.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

interface StoryCard {
  suit: string
  rank: string
  id: string
  file_name: string
  order: number
}

const mockCards: StoryCard[] = [
  {
    suit: 'hearts',
    rank: '1',
    id: 'h1',
    file_name: 'h1.svg',
    order: 1,
  },
  {
    suit: 'hearts',
    rank: '2',
    id: 'h2',
    file_name: 'h2.svg',
    order: 2,
  },
]

const withMockData = (StoryFn: () => any) => {
  return defineComponent({
    setup() {
      const mockDataRef = ref(mockCards)

      provide('storybook:mockCardsData', mockDataRef)

      return () => h('div', { style: 'width: 600px; height: 200px;' }, h(StoryFn()))
    },
  })
}

const meta: Meta<typeof PlayingCard> = {
  title: 'components/card',
  component: PlayingCard,
  decorators: [withMockData],
  tags: ['autodocs'],
  argTypes: {
    faceUp: { control: 'boolean' },
    cardId: {
      control: 'select',
      options: ['', ...mockCards.map((card: StoryCard) => card.id)],
    },
    customClass: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof PlayingCard>

export const face_down: Story = {
  name: 'Face Down',
  args: {
    faceUp: false,
    cardId: '',
    customClass: '',
  },
}

export const face_up: Story = {
  name: 'Face Up',
  args: {
    faceUp: true,
    cardId: 'h1',
    customClass: '',
  },
}
