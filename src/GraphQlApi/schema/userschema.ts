import {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLBoolean} from 'graphql';

const Property = new GraphQLObjectType({
  name: 'Property',
  fields: {
    property_id: { type: GraphQLString },
  }
});
export const LandlordType=new GraphQLObjectType({
    name:'Landlord',
    fields:{
      userid:{type:GraphQLString},
      name:{type:GraphQLString},
      email:{type:GraphQLString},
      mobile:{type:GraphQLString},
      properties:{type:new GraphQLList(Property)}
    }
  })
export const TenantType=new GraphQLObjectType({
    name:'Tenant',
    fields:{
      userid:{type:GraphQLString},
      name:{type:GraphQLString},
      email:{type:GraphQLString},
      mobile:{type:GraphQLString},
    state: {type:GraphQLString},
    city: {type:GraphQLString},
    country: {type:GraphQLString},
    zipcode: {type:GraphQLInt},
      idnumber:{type:GraphQLString},
      iddocs:{type:GraphQLString}
    }
  })
export const PropertyType=new GraphQLObjectType({
    name:'PropertyAdd',
    fields:{
    landlordid:{type:GraphQLString},
    ownername:{type:GraphQLString},
    name:{type:GraphQLString},
    rentfrequency:{type:GraphQLString},
    type:{type:GraphQLString},
    status:{type:GraphQLString},
    latefees:{type:GraphQLInt},
    leaseduration:{type:GraphQLInt},
    email:{type:GraphQLString},
    mobile:{type:GraphQLString},
    address:{type:GraphQLString}, 
    state: {type:GraphQLString},
    city: {type:GraphQLString},
    country: {type:GraphQLString},
    zipcode: {type:GraphQLInt},
    number_of_rooms: {type:GraphQLInt},
    surfacearea:{type:GraphQLInt},
    rentprice: {type:GraphQLInt},
    securityDeposit:{type:GraphQLInt},
    rentalIncrement: {type:GraphQLInt},
    availablefrom:{type:GraphQLString},
    propertyname:{type:GraphQLString},
    constructionyear:{type:GraphQLInt},
    additionalcomments:{type:GraphQLString},
    images:{type:new GraphQLList(GraphQLString)}
    }
  })
export const FilterPropertyType=new GraphQLObjectType({
    name:'FilterPropertyResponse',
    fields:{
    id:{type:GraphQLInt},
    name:{type:GraphQLString},
    propertyname:{type:GraphQLString},
    rentfrequency:{type:GraphQLString},
    type:{type:GraphQLString},
    latefees:{type:GraphQLInt},
    leaseduration:{type:GraphQLInt},
    availablefrom:{type:GraphQLString},
    address:{type:GraphQLString}, 
    landlordname:{type:GraphQLString},
    state: {type:GraphQLString},
    city: {type:GraphQLString},
    country: {type:GraphQLString},
    zipcode: {type:GraphQLInt},
    number_of_rooms: {type:GraphQLInt},
    surfacearea:{type:GraphQLInt},
    rentprice: {type:GraphQLInt},
    securityDeposit:{type:GraphQLInt},
  rentalIncrement: {type:GraphQLInt},
  status:{type:GraphQLString},
  constructionyear:{type:GraphQLInt},
  additionalcomments:{type:GraphQLString},
    images:{ type: new GraphQLList(GraphQLString
    )}
    }
  })