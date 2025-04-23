import mitt from 'mitt'

type Events = {
  'toggle-main-menu': void
  'untoggle-main-menu': boolean
}

const eventBus = mitt<Events>()
export default eventBus
