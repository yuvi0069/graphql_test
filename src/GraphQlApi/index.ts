import {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt} from 'graphql';
import { getUserDetailsByUserUuid,changePasswordByUserUuid,updateUserDetails,addPropertyDetails, getLandlordDetailsByUuid, getTentantDetailsByUuid, getPropertyDetailsById, getPropertyDetailsBylandLordUuid, updatePropertyDetails, addtentantDetails, getfilterPropertyDertails, deletePropertyDetailsbyId, getLandlord, getTenant, sendTeantApplication, testingApi } from './resolvers/userresolvers';
import { signInUser,logIn,verifyOtpByUserUuid,verifyUserSignUp,forgotPassword } from './resolvers/authresolvers';
const RootQuery = new GraphQLObjectType({
    name: 'Query',
    fields: {
      getUserDetailsByUserUuid,
      getLandlordDetailsByUuid,
      getTentantDetailsByUuid,
      getPropertyDetailsById,
      getPropertyDetailsBylandLordUuid,
      getfilterPropertyDertails,
      getLandlord,
      getTenant,
      testingApi
    }
  });
const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      signInUser,
      logIn,
      verifyUserSignUp,
      forgotPassword,
      verifyOtpByUserUuid,
      changePasswordByUserUuid,
      updateUserDetails,
      addPropertyDetails,
      addtentantDetails,
      updatePropertyDetails,
      deletePropertyDetailsbyId,
      sendTeantApplication,
      
    },
  });
  
export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
  });