const subscribers = new Map()

export const MarketEventListener = {
  subscribe: (id, callback) => {
    subscribers.set(id, callback)
  },
  unsubscribe: (id) => {
    subscribers.delete(id)
  },
  emit: (event) => {
    subscribers.forEach((cb) => {
      try {
        cb(event)
      } catch (e) {
        console.error(`Error in subscriber '${cb.name}':`, e)
      }
    })
  },
}
