import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

export const ASType = new GraphQLObjectType({
  name: 'AS',
  fields: {
    ipAddress: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The IP address of a honey badger that belongs to the AS',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the AS',
    },
    asn: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Unique identifying number for the AS',
    },
    countryCode: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The two letter country code that the AS resides in',
    },
  },
  description: 'Information regarding an autonomous system',
})

export const TopHoneyBadgerType = new GraphQLObjectType({
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
