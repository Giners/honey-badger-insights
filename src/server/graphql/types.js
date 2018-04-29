import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const TopHoneyBadgerType = new GraphQLObjectType({
  name: 'TopHoneyBadger',
  fields: {
    ipAddress: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The IP address of the entity caught in a honeypot',
    },
    count: {
      type: GraphQLInt,
      description:
        'The amount of times the entity was seen in the last 24 hours',
    },
  },
  description:
    'One of the most frequently seen honey badgers in the laster 24 hours',
})

export default TopHoneyBadgerType
