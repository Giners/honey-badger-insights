import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

export const GeoLocationType = new GraphQLObjectType({
  name: 'GeoLocation',
  fields: {
    ipAddress: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The IP address of a honey badger that the geospatial location is associated with',
    },
    latitude: {
      type: new GraphQLNonNull(GraphQLFloat),
      description:
        'The latitude of the location of the honey badger (e.g. 47.6062)',
    },
    longitude: {
      type: new GraphQLNonNull(GraphQLFloat),
      description:
        'The longitude of the location of the honey badger (e.g. 122.3321)',
    },
    country: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The country that the honey badger resides in',
    },
    continent: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The continent the honey badger resides in',
    },
  },
  description: 'The geospatial location of a honey badger',
})

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
