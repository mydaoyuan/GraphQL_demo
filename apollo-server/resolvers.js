import GraphQLJSON from 'graphql-type-json'
import shortid from 'shortid'

export default {
  JSON: GraphQLJSON,

  Counter: {
    countStr: counter => `Current count: ${counter.count}`
  },

  Query: {
    hello: (root, { name }) => `Hello ${name || 'World'}!`,
    ping: (root, { message }) => `Answering ${message}!`,
    messages: (root, args, { db }) => db.get('messages').value(),
    uploads: (root, args, { db }) => db.get('uploads').value(),
    test: (root, args, { db }) => db.get('test').value(),
    tags: (root, args, { db }) => db.get('tags').value()
  },

  Mutation: {
    myMutation: (root, args, context) => {
      const message = 'My mutation completed!'
      context.pubsub.publish('hey', { mySub: message })
      return message
    },
    fuckmeAh: (root, { values }, { db }) => {
      values.map(item => (item.id = shortid.generate()))
      db.get('test')
        .push(...values)
        .last()
        .write()

      return values
    },
    addTag: (root, { label }, { pubsub, db }) => {
      const data = { id: shortid.generate(), label }
      db.get('tags')
        .push(data)
        .write()
      return data
    },
    addMessage: (root, { input }, { pubsub, db }) => {
      const message = {
        id: shortid.generate(),
        text: input.text
      }

      db.get('messages')
        .push(message)
        .last()
        .write()

      pubsub.publish('messages', { messageAdded: message })

      return message
    },

    singleUpload: (root, { file }, { processUpload }) => processUpload(file),
    multipleUpload: (root, { files }, { processUpload }) =>
      Promise.all(files.map(processUpload))
  },

  Subscription: {
    mySub: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('hey')
    },
    counter: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random()
          .toString(36)
          .substring(2, 15) // random channel name
        let count = 0
        setInterval(
          () =>
            pubsub.publish(channel, {
              // eslint-disable-next-line no-plusplus
              counter: { count: count++ }
            }),
          2000
        )
        return pubsub.asyncIterator(channel)
      }
    },

    messageAdded: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('messages')
    }
  }
}
