import { bcryptPassword, comparePassword, createUserClient } from "../helpers/function";
import {
  getUserByUserId,
  updatePasswordByUserUuid,
  updateUserDetailsByUserId,
  // insertLandlordDetails,
  updateTentantDetails,
  insertPropertyDetails,
  getLandlordbyUuid,
  getTenantbyUuid,
  getPropertybyId,
  getPropertybyLandlordUuid,
  updatePropertyById,
  getFilterResponseByTenant,
  deletePropertybyId,
  getLandlordDetails,
  getTenantDetails,
  sendApplicationById,
} from "../models/db";
import {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt,GraphQLBoolean} from 'graphql';
import { withVerifyToken ,verifyUser, verifyToken} from "../../middleware/auth";
import { UserLoginType} from "../schema/authschema";
import { FilterPropertyType, LandlordType,PropertyType,TenantType } from "../schema/userschema";
import { GraphQLUpload } from 'graphql-upload';
import { saveImageToFirebase } from "../helpers/function";
// import imageUploadQueue from "../redis/imageQueue";
// import { resolve } from "path";
import { sendApplicationEmail } from "../../email/index";

// import Stripe from 'stripe';

export const testingApi={
  type:new GraphQLObjectType({
    name:"Testresponse",
    fields:{
      detail:{type:GraphQLString},
      code:{type:GraphQLInt}
    }

  }),
  resolve:async(parent:any, args:any,context:any)=>{
    return{
      detail:'test running successfully',
      code:0
    }
  }
}
export const changePasswordByUserUuid={
    type:new GraphQLObjectType({
      name:'ChangePasswordResponse',
      fields:{
        detail:{type:GraphQLString},
        code:{type:GraphQLInt},
     
      }
    }),
    args:{
      oldPassword:{type:GraphQLString},
      newPassword:{type:GraphQLString},
      userUuid:{type:GraphQLString},
    },async resolve(parent:any,args:any,context:any){
     
      const { req } = context;
      await withVerifyToken(() => {})(parent, args, context);
      req.params = { userUuid: args.userUuid };
      await verifyUser(()=>{})(parent, args, context);
      const {userUuid,oldPassword,newPassword}=args
      const userData = await getUserByUserId(userUuid);
      if (userData.error) {
       
          return{
          detail:userData.error,
          code:userData.code}
         
      }
      const isPasswordValid = await comparePassword(
        oldPassword,
        userData.password
      );
      if (!isPasswordValid) {
        return{
          code: 0,
          detail: `Invalid old password`,
          status: "400",
        };
      }
      const encryptPassword = await bcryptPassword(newPassword);
      const updatePassword = await updatePasswordByUserUuid(
        userUuid,
        encryptPassword
      );
      if (updatePassword.data) {
    return{
          detail: "Password change successfully",
          code: 1,
    }
      }
      return{
        code: 0,
        detail: `Password change failed`,
        status: "400",
      };
    }
  };
export const getUserDetailsByUserUuid = {
    type: new GraphQLObjectType({
      name: 'getUserDetailsResponse',
      fields: {
        detail: { type: GraphQLString },
        code: { type: GraphQLString },
        userData: { type: UserLoginType }
      }
    }),
    args: {
      userUuid: { type: GraphQLString }
    },
    resolve:async (parent:any, args:any,context:any) =>{
      const { userUuid } = args;
      const userData = await getUserByUserId(userUuid);
      await withVerifyToken(() => {})(parent, args, context);
      if (!userData.uuid) {
        return{
          detail:userData.error,
          code:userData.code}
      }
  
      return {
        detail: "User details retrieved successfully",
        code: "1",
        userData
      //   {useruuid:userData.uuid,
      //     firstName:userData.first_name,
      //     lastName:userData.last_name,
      //     email:userData.email,
      //     mobileNo:userData.mobile,
      //   role:userData.role_id}
      // };
    }
  }
  };
export const updateUserDetails={
    type: new GraphQLObjectType({
      name: 'UpdateUserDetailsResponse',
      fields: {
        detail: { type: GraphQLString },
        code: { type: GraphQLString },
        updatedData: { type: UserLoginType }
      }
    }),
    args: {
      userUuid: { type: GraphQLString },
      firstName:{type:GraphQLString},
      lastName: { type: GraphQLString },
      mobileNo: { type: GraphQLString }
    },
    resolve:async(parent:any,args:any,context:any)=>{
      const { userUuid } = args;
      const userData = await getUserByUserId(userUuid);
      await withVerifyToken(() => {})(parent, args, context);
      const {req}=context;
      req.params = { userUuid: args.userUuid };
      await verifyUser(()=>{})(parent, args, context);
      const bodyData = args;
      if (!userData.uuid) {
        return{
          detail:userData.error,
          code:userData.code}
      }
      const updateData = await updateUserDetailsByUserId(userUuid, bodyData);
      if (!updateData.data) {
        return{
          code: 0,
          detail: `User data not updated`,
          status: "400",
        };
      }
     return{
        detail: "User details update successfully",
        code: 1,
        updatedData:{
          uuid:updateData.data.uuid,
          first_name:updateData.data.first_name,
          last_name:updateData.data.last_name,
          email:updateData.data.email,
          mobile:updateData.data.mobile,
        }
        
      };
    }
  };
// export const landlordAddDetails={
//   type:new GraphQLObjectType({
//     name:'landLordResponse',
//     fields:{
//       detail:{type:GraphQLString},
//       code:{type:GraphQLInt},
//       landlordData:{type:LandlordType}
//     }
//   }),
//   args:{userUuid:{type:GraphQLString}},
//   resolve:async(parent:any,args:any)=>{
//     const {userUuid}=args;
//       const userData=await getUserByUserId(userUuid);
//       if(!userData){
//         throw new ApiError({
//           code: 0,
//           detail: `User not found`,
//           status: "400",
//         });
//       }
//       if (userData.role_id!==2){
//         throw new ApiError({
//           code: 0,
//           detail: `User not a landlord`,
//           status: "400",
//         });
//       }
//       const name=userData.first_name+userData.last_name;
//       const landLordData=await insertLandlordDetails(userData.uuid,name);
      
//       if (!landLordData.data) {
//         throw new ApiError({
//           code: 0,
//           detail: `User status not updated`,
//           status: "400",
//         });
//       }
//       return{
//         detail: "User status update successfully",
//         code: 1,
      
//          landlordData:{
//           userid:landLordData.data[0].userid,
//           name:landLordData.data[0].name
//          }
        
//       };
//   }
//   };
export const addPropertyDetails={
    type:new GraphQLObjectType({
      name:'PropertyResponse',
      fields:{
        detail:{type:GraphQLString},
        code:{type:GraphQLInt},
        propertyData:{type:PropertyType}
      }
    }),
    args:{
    userUuid:{type:GraphQLString},
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
    name:{type:GraphQLString},
    rentfrequency:{type:GraphQLString},
    type:{type:GraphQLString},
    latefees:{type:GraphQLInt},
    leaseduration:{type:GraphQLInt},
    availablefrom:{type:GraphQLString},
    propertyname:{type:GraphQLString},
    constructionyear:{type:GraphQLInt},
    additionalcomments:{type:GraphQLString},
    images:{ type:new GraphQLList(GraphQLUpload)}
  },
    resolve:async(parent:any,args:any,context:any)=>{
    
      const {userUuid,images}=args;
     
      const { req } = context;
      await withVerifyToken(() => {})(parent, args, context);
      const userData=await getUserByUserId(userUuid);
    
      if(!userData){
        return{
          code: 0,
          detail: `User not found`,
          status: "400",
        };
      }
      if (userData.role_id!==2){
        return{
          code: 0,
          detail: `User not a landlord`,
          status: "400",
        };
      }
     
      let imageUrls=[];
      if (images){
    imageUrls = await Promise.all(images.map(async (image:any) => {
      const { createReadStream, filename } = await image;
      const stream = await createReadStream();
  
      const url = await saveImageToFirebase(stream, filename);
      return url;
  }));
      // const imageUrls = await Promise.all(images.map(async (image:any) => {
      //   const { createReadStream, filename } = await image;
      //   const stream = await createReadStream();
      // const chunks = [];
      //   for await (const chunk of stream) {
      //     chunks.push(chunk);
      //   }
      //   const imageBuffer = Buffer.concat(chunks);
      //   const url = await saveImageLocally(stream, filename); 
      //   return url;
      // }));
  //   const imageUrls1 = await Promise.all(images.map(async (image: any) => {
  //       const {createReadStream,filename } = await image;
  //       // Get the stream directly
  // const stream=await createReadStream();
  //       // Pass the stream directly to the job without converting to a buffer
  //       const buffer = await new Promise<Buffer>((resolve, reject) => {
  //         const chunks: Buffer[] = [];
  //         stream.on('data', (chunk: Buffer) => {
  //           chunks.push(chunk);
  //         });
  //         stream.on('end', () => {
  //           const combinedBuffer = Buffer.concat(chunks);
  //           console.log(`Created buffer of length: ${combinedBuffer.length}, type: ${Buffer.isBuffer(combinedBuffer) ? 'Buffer' : typeof combinedBuffer}`);
        
  //           // If combinedBuffer is an object and not a Buffer, convert it
  //           if (typeof combinedBuffer === 'object') {
  //             const jsonString = JSON.stringify(combinedBuffer);
  //             const bufferFromObject = Buffer.from(jsonString);
  //             resolve(bufferFromObject); // Resolve with the new Buffer
  //           } else {
  //             resolve(combinedBuffer); // Resolve with the original Buffer
  //           }
  //         });
  //         stream.on('error', reject);
  //       });
        
        
  //       const job = await imageUploadQueue.add("uploadImage", {
  //         userUuid,
  //         filename,
  //         buffer, // Pass the stream directly
  //       });
  
  //       return job.id; // Return job ID to track progress
  //     }))
}
      const propertyData=await insertPropertyDetails(userData.uuid,{...args,imageUrls});
      if (!propertyData.data) {
        return{
          code: 0,
          detail: `Property not added succesfully`,
          status: "400",
        };
      }
     
     return{
        detail: "Property added succesfully",
        code: 1,
        propertyData:propertyData.data
    //     propertyData:{
    // landlordid:propertyData.data.landlordid,
    // name:propertyData.data.name,
    // address:propertyData.data.address, 
    // state: propertyData.data.state,
    // city: propertyData.data.city,
    // country: propertyData.data.country,
    // zipcode:propertyData.data.zipcode,
    // number_of_rooms:propertyData.data.number_of_rooms,
    // surfacearea:propertyData.data.surfacearea,
    // rentprice:propertyData.data.rentprice,
    // securityDeposit:propertyData.data.securityDeposit,
    // rentalIncrement:propertyData.data.rentalIncrement,
    // rentfrequency:propertyData.data.rentfrequency,
    // images:imageUrls
    //      }
        };
    }
  };
export const addtentantDetails={
  type:new GraphQLObjectType({
    name:'TentantResponse',
    fields:{
      detail:{type:GraphQLString},
      code:{type:GraphQLInt},
      tenantData:{type:TenantType}
    }
  }),
  args:{
  userUuid:{type:GraphQLString},
    state: {type:GraphQLString},
    city: {type:GraphQLString},
    country: {type:GraphQLString},
    zipcode: {type:GraphQLInt},
    idnumber:{type:GraphQLString},
    iddocs:{type:GraphQLString},
  },
  resolve:async(parent:any,args:any,context:any)=>{
    const {userUuid}=args;
    const { req } = context;
    await withVerifyToken(() => {})(parent, args, context);
    const userData=await getUserByUserId(userUuid);
    if(!userData){
      return{
        code: userData.code,
        detail: userData.error,
        status: "400",
      };
    }
    if (userData.role_id!==3){
      return{
        code: 0,
        detail: `User not a tentant`,
        status: "400",
      };
    }

    const tenantData=await updateTentantDetails(args);
    if (!tenantData.data) {
      return{
        code: 0,
        detail: `User status not updated`,
        status: "400",
      };
    }
    return{
      detail: "User status update successfully",
      code: 1,
    
       tenantData:{
        userid:tenantData.data[0].userid,
        name:tenantData.data[0].name,
        city:tenantData.data[0].city,
        state:tenantData.data[0].state,
        country:tenantData.data[0].country,
        zipcode:tenantData.data[0].zipcode,
        idnumber:tenantData.data[0].idnumber,
        iddocs:tenantData.data[0].iddocs
       }
      
    };
  }
  };
export const getLandlordDetailsByUuid={
  type:new GraphQLObjectType({
    name:'GetLandLordDataByUseruuidResponse',
    fields:{
      detail:{type:GraphQLString},
        code:{type:GraphQLInt},
        landLordData:{type:LandlordType}
    }
  }),
  args:{
    userUuid:{type:GraphQLString}
  },
  resolve:async(parent:any,args:any,context:any)=>{
  const {userUuid}=args;
  const { req } = context;
  await withVerifyToken(() => {})(parent, args, context);
  const landLordData=await getLandlordbyUuid(userUuid);
  if(landLordData.error){
    return{
      detail:landLordData.error,
      code:0
    }
  }

  return {
    detail:`LandLord Found successfully`,
    code:1,
    landLordData:landLordData.data
  }
  }
  };
export const getTentantDetailsByUuid={type:new GraphQLObjectType({
  name:'GetTenantDataByUseruuidResponse',
  fields:{
    detail:{type:GraphQLString},
      code:{type:GraphQLInt},
      tenantData:{type:TenantType}
  }
}),
args:{
  userUuid:{type:GraphQLString}
},
resolve:async(parent:any,args:any,context:any)=>{
const {userUuid}=args;
const { req } = context;
await withVerifyToken(() => {})(parent, args, context);
const tenantData=await getTenantbyUuid(userUuid);

if(!tenantData.data){
  return{
    detail:`tenant not found`,
    code:0
  }
}
return {
  detail:`Tenant Found successfully`,
  code:1,
  tenantData:{

      userid:tenantData.data.userid,
      name:tenantData.data.name,
      city:tenantData.data.city,
      state:tenantData.data.state,
      country:tenantData.data.country,
      zipcode:tenantData.data.zipcode,
      idnumber:tenantData.data.idnumber,
      iddocs:tenantData.data.iddocs
     }

  }
}
  };
export const getPropertyDetailsById={
  type:new GraphQLObjectType({
    name:'PropertyResponseForId',
    fields:{
      detail:{type:GraphQLString},
      code:{type:GraphQLInt},
      propertyData:{type:PropertyType}
    }
  }),
  args:{
  id:{type:GraphQLInt}
  
},
  resolve:async(parent:any,args:any,context:any)=>{
    const {id}=args;
    const { req } = context;
    await withVerifyToken(() => {})(parent, args, context);
    const propertyData=await getPropertybyId(id);
    if (!propertyData.data) {
      return{
        code: 0,
        detail: `Property not founded`,
        status: "400",
      };
    }
   
   return{
      detail: "Property found successfully",
      code: 1,
    
       propertyData:propertyData.data
      };
  }
  };
export const getPropertyDetailsBylandLordUuid={
  type:new GraphQLObjectType({
    name:'PropertyResponseForLandlordId',
    fields:{
      detail:{type:GraphQLString},
      code:{type:GraphQLInt},
      propertyData:{type:new GraphQLList(PropertyType)}
    }
  }),
  args:{
    userUuid:{type:GraphQLString},
  
},
  resolve:async(parent:any,args:any,context:any)=>{
    const {userUuid}=args;
    const { req } = context;
    await withVerifyToken(() => {})(parent, args, context);
    
    const propertyData=await getPropertybyLandlordUuid(userUuid);
    if (!propertyData.data) {
      return{
        code: 0,
        detail: propertyData.error,
        status: "400",
      };
    }
   return{
      detail: "Property found successfully",
      code: 1,
      propertyData:propertyData.data,

      };
  }
  };
export const updatePropertyDetails={
  type:new GraphQLObjectType({
    name:'UpdatePropertyResponseForId',
    fields:{
      detail:{type:GraphQLString},
      code:{type:GraphQLInt},
      propertyData:{type:PropertyType}
    }
  }),
  args:{
  id:{type:GraphQLInt},
  userUuid:{type:GraphQLString},
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
    name:{type:GraphQLString},
    rentfrequency:{type:GraphQLString},
    type:{type:GraphQLString},
    latefees:{type:GraphQLInt},
    leaseduration:{type:GraphQLInt},
    availablefrom:{type:GraphQLString},
    propertyname:{type:GraphQLString},
    constructionyear:{type:GraphQLInt},
    additionalcomments:{type:GraphQLString},
    images:{ type:new GraphQLList(GraphQLUpload)}
},
  resolve:async(parent:any,args:any,context:any)=>{
    const {id}=args;
    const { req } = context;
    await withVerifyToken(() => {})(parent, args, context);
    req.params = { userUuid: args.userUuid };
    await verifyUser(()=>{})(parent, args, context);
    let imageUrls;
    if(args.images){
     imageUrls = await Promise.all(args.images.map(async (image:any) => {
        const { createReadStream, filename } = await image;
        const stream = await createReadStream();
        const url = await saveImageToFirebase(stream, filename);
        return url;
    }));
    }
   const propertyData=await updatePropertyById(id,{...args,imageUrls});
   if(propertyData.error){
    return{
    detail:propertyData.error,
    code:propertyData.code}
   }
   return{
      detail: "Property updated successfully",
      code: 1,
     propertyData:propertyData.data
//        propertyData:{

//   address:propertyData.data.address, 
//   state: propertyData.data.state,
//   city: propertyData.data.city,
//   country: propertyData.data.country,
//   zipcode:propertyData.data.zipcode,
//   number_of_rooms:propertyData.data.number_of_rooms,
//   surfacearea:propertyData.data.surfacearea,
//   rentprice:propertyData.data.rentprice,
//   securityDeposit:propertyData.data.securityDeposit,
// rentalIncrement:propertyData.data.rentalIncrement,
//   images:propertyData.data.images
//        }
      };
  }
  };
export const getfilterPropertyDertails={
  type:new GraphQLObjectType({
    name:"filterPropertyResponse",
    fields:{
      detail:{type:GraphQLString},
      code:{type:GraphQLString},
      totalrecords:{type:GraphQLInt},
      totalpages:{type:GraphQLInt},
      filterData:{type:new GraphQLList(FilterPropertyType)},
      hasNextPage: { type: GraphQLBoolean },
      nextPage: { type: GraphQLInt } 
    }
  }),
  args:{
    address:{type:GraphQLString}, 
    name:{type:GraphQLString},
    state: {type:GraphQLString},
    city: {type:GraphQLString},
    country: {type:GraphQLString},
    number_of_rooms: {type:GraphQLInt},
    minPrice:{type:GraphQLInt},
    maxPrice:{type:GraphQLInt},
    page: { type: GraphQLInt }
  },
 resolve:async(parent:any,args:any,context:any)=>{
  await withVerifyToken(() => {})(parent, args, context);
  const limit = args.limit || 5;
  const page = args.page || 1;  
  const filteredData=await getFilterResponseByTenant(args,limit,page);
  if(!filteredData || typeof filteredData.hasNextPage === 'undefined'){
    return{
      detail:`No matching found`,
      code:0
    }
  }
  
  else{
 
    return{
      detail:`Property found`,
      code:1,
      totalrecords:filteredData.totalRecords,
      totalpages:filteredData.totalPages,
      filterData:filteredData.filterData,
      hasNextPage: filteredData.hasNextPage,
      nextPage: filteredData.nextPage
      
    }
  }
 }
  }
export const deletePropertyDetailsbyId={
  type:new GraphQLObjectType({
    name:"deletePropertyResponse",
    fields:{
      detail:{type:GraphQLString},
      code:{type:GraphQLString},
     
    }
  }),
  args:{
    id:{type:GraphQLInt},
    userUuid:{type:GraphQLString}
  },
 resolve:async(parent:any,args:any,context:any)=>{
  const {id}=args;
  const { req } = context;
  await withVerifyToken(() => {})(parent, args, context);
  req.params = { userUuid: args.userUuid };
  await verifyUser(()=>{})(parent, args, context);
  const filteredData=await deletePropertybyId(id);
  if(filteredData.error){
    return{
      detail:filteredData.error,
      code:0
    }
  }
  else{
    return{
      detail:filteredData.detail,
      code:1,
    
    }
  }
 }
  }
export const getLandlord={
  type:new GraphQLObjectType({
    name:'LandLordsResponse',
    fields:{
    detail:{type:GraphQLString},
    code:{type:GraphQLInt},
    landlordData:{type:new GraphQLList(LandlordType)}
    }}),
    resolve:async(parent:any,args:any,context:any)=>{
      const {req}=context;
      await withVerifyToken(()=>{})(parent,args,context);
      const landlordData=await getLandlordDetails();
      const userData=await getUserByUserId(req.user);

      if(userData.role_id===2 || userData.role_id===3){
        return{
          code:0,
          detail:'Not allowed to access'
        }
      }
      
      if(landlordData.error){
        return{
        detail:landlordData.error,
        code:landlordData.code
        }
      }
      return{
        detail:'Landlords Details',
        code:1,
        landlordData:landlordData.data
      }
    }
  }
export const getTenant={
    type:new GraphQLObjectType({
      name:'TenantsResponse',
      fields:{
      detail:{type:GraphQLString},
      code:{type:GraphQLInt},
      tenantData:{type:new GraphQLList(TenantType)}
      }}),
      resolve:async(parent:any,args:any,context:any)=>{
        const {req}=context;
        await withVerifyToken(()=>{})(parent,args,context);
        const tenantData=await getTenantDetails();
        const userData=await getUserByUserId(req.user);
  
        // if(userData.role_id===2 || userData.role_id===3){
        //   return{
        //     code:0,
        //     detail:'Not allowed to access'
        //   }
        // }
        
        if(tenantData.error){
          return{
          detail:tenantData.error,
          code:tenantData.code
          }
        }
        return{
          detail:'Tenant Details',
          code:1,
          tenantData:tenantData.data
        }
      }
  }
export const sendTeantApplication={
  type:new GraphQLObjectType({
    name:'SendTeantResponse',
    fields:{
      detail:{type:GraphQLString},
      code:{type:GraphQLString}
    }
  }),
  args:{
    propertyId:{type:GraphQLInt},
    tenantId:{type:GraphQLString},
    occupation:{type:GraphQLString},
    income:{type:GraphQLInt},
  
  },
  resolve:async(parent:any,args:any,context:any)=>{
  await withVerifyToken(()=>{})(parent,args,context);
  const propertyData=await getPropertybyId(args.propertyId);
 
  const tenantData=await getTenantbyUuid(args.tenantId)
  if(!tenantData.data.idverified){
return {
  code:0,
  detail:`please verify the id detils with us`
}
  }
  const sendData=await sendApplicationEmail(propertyData.data.email,propertyData.data.ownername,tenantData.data.name,args.occupation,args.income,tenantData.data.idnumber,tenantData.data.iddocs)
  if(sendData.success===true){
return{
  code:1,
  detail:`Application send Successfully`
}
  }
  else{
    return{
    code:0,
  detail:`Application not send Successfully`
}}
  
  }
}
const RentPaymentResponseType = new GraphQLObjectType({
  name: 'RentPaymentResponse',
  fields: {
    detail: { type: GraphQLString },
    clientSecret: { type: GraphQLString },
    code: { type: GraphQLInt },
  },
});

// export const initiateRentPayment = {
//   type: RentPaymentResponseType,
//   args: {
//     tenantUuid: { type: GraphQLString },
//     tenantName: { type: GraphQLString },
//     landlordUuid: { type: GraphQLString },
//     paymentMethodId:{type:GraphQLString},
//     amount: { type: GraphQLInt }, 
//   },
//   resolve: async (parent: any, args: any, context: any) => {
//     const { req } = context;
//     await withVerifyToken(() => {})(parent, args, context); 

//     const { tenantUuid, tenantName, landlordUuid, amount,paymentMethodId} = args;

//     try {

//       const paymentIntent = await stripe.paymentIntents.create({
//         amount,
//         currency: 'usd',
//         payment_method: paymentMethodId,
//             payment_method_types: ['card'],
//             automatic_payment_methods: {
//                 enabled: false,
//             },
//             confirm: true,
//         metadata: {
//           tenantUuid,
//           tenantName,
//           landlordUuid,
//         },
//       });

   
      

     
//       if (paymentIntent.status === 'succeeded') {
        
       

//         return {
//           detail: "Rent payment completed successfully",
//           clientSecret: paymentIntent.client_secret,
//           code: 1,
//         };
//       }

     
//       return {
//         detail: "Rent payment initiated, please confirm payment on frontend",
//         clientSecret: paymentIntent.client_secret,
//         code: 1,
//       };

//     } catch (error: any) {
//       console.error("Stripe Error:", error);
//       return {
//         detail: "Failed to initiate rent payment",
//         code: 0,
//       };
//     }
//   },
// };
