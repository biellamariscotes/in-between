/**
 * Event Bus using mitt library for component communication.
 */
import mitt from 'mitt'

/**
 * Supported events:
 * - toggle-main-menu: Trigger menu toggle (no payload)
 * - untoggle-main-menu: Update menu visibility state (boolean)
 */

type Events = {
  'toggle-main-menu': void
  'untoggle-main-menu': boolean
  'toggle-tour': boolean
}

const eventBus = mitt<Events>()
export default eventBus
