import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

const HoneyBadgerType = new GraphQLObjectType({
  name: 'HoneyBadger',
  fields: {
    ipAddress: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The IP address of the entity caught in a honeypot',
    },
  },
  description:
    'A honey badger is someone or something that was caught in a honeypot',
})

export default HoneyBadgerType
