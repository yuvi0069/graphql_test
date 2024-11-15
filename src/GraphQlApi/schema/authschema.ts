import {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt} from 'graphql';
export const UserSignUpType = new GraphQLObjectType({
    name: 'UserSignUp',
    fields: {
      useruuid:{type:GraphQLString},
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      email: { type: GraphQLString },
      mobileNo:{type:GraphQLInt},
      role: { type: GraphQLString },
    },
  });
  export const UserLoginType = new GraphQLObjectType({
    name: 'UserLogin',
    fields: {
      uuid:{type:GraphQLString},
      first_name: { type: GraphQLString },
      last_name: { type: GraphQLString },
      email: { type: GraphQLString },
      mobile:{type:GraphQLString},
      role_id:{type:GraphQLString},
      token:{type:GraphQLString}
    },
  });