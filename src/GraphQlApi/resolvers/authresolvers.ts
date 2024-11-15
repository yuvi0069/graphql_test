import { bcryptPassword, comparePassword, createUserClient } from "../helpers/function";
import {
  checkUserByEmail,
  deleteUnverifiedUser,
  getUserByEmail,
  getUserByUserId,
  updateOtpByUserId,
  updatePasswordByUserUuid,
  updateUserDataByUserId,
  updateUserverifiedEmailByUserId,
  updateRoleDetails,
} from "../models/db";
import { sign } from "jsonwebtoken";
import { ApiError } from "../../errors/api";
import { otpSendEmail,otpSendEmailSignInVerification } from "../../email";
import {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt} from 'graphql';
import { UserLoginType,UserSignUpType } from "../schema/authschema";
export const logIn={
    type:new GraphQLObjectType({
      name:'LogInResponse',
      fields:{
      detail:{type:GraphQLString},
      code:{type:GraphQLInt},
      logInUser:{type:UserLoginType}
      }
    }),
    args:{
      email:{type:GraphQLString},
      password:{type:GraphQLString}
    }, resolve:async(parent:any,args:any)=>{
     
        const { email, password } = args;
        const userData = await getUserByEmail(email);
        if(!userData.uuid){
          return{
            code: userData.code,
            detail: userData.error,
            status: "400",
          };
        }
        if(!userData.verified_email){
          await deleteUnverifiedUser(userData.uuid);
          
            return{
              code: userData.code,
              detail: userData.error,
              status: "400",
            };
          
        }
        const isPasswordValid = await comparePassword(password, userData.password);
        if (!isPasswordValid) {
          return{
            code: 0,
            detail: `Invalid password`,
            status: "400",
          };
        }
        else{
        const jwtToken = sign({ userId: userData.uuid }, "rent-payment") as string;
        const userUpdatedData = await updateUserDataByUserId(
          userData.uuid,
          jwtToken
        );
    
        if (!userUpdatedData) {
          return{
            code: 0,
            detail: `User not found`,
            status: "400",
          };
        }
       else{
        return{
          detail:'login sucessfully',
          code:1,
          logInUser:{
          uuid:userData.uuid,
         first_name:userData.first_name,
         last_name:userData.last_name,
         email:userData.email,
         mobile:userData.mobile,
          token:jwtToken
          }
        }
      }
      
    } 
    }
  }
export const signInUser = {
    type: new GraphQLObjectType({
      name: 'SignInResponse',
      fields: {
        detail: { type: GraphQLString },
        code: { type: GraphQLInt },
        signInUser: { type: UserSignUpType }
      }
    }),
    args: {
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      mobileNo: { type: GraphQLString },
      role: { type: GraphQLString },
    },
    resolve:async(parent:any, args:any)=> {
      const { email, firstName, lastName, password, mobileNo, role } = args;
      const unverifiedUser=await getUserByEmail(email);
      if(!unverifiedUser.verified_email){
        await deleteUnverifiedUser(unverifiedUser.uuid);
      }
      const userData = await checkUserByEmail(email);
     
      if (userData.length !== 0) {
        return{
          code: 0,
          detail: `User email already exists..`,
          status: "400",
        };
      }
      const data = args;
      const otp = 123456;
      const userDetail = await createUserClient(data,otp);
      if (!userDetail.userId) {
        return{
          code: 0,
          detail: `User Register failed Please try again..`,
          status: "400",
        };
      }
      // const sendEmail = await otpSendEmailSignInVerification(
      //   email,
      //   `${data.firstName + " " + data.lastName}`,
      //   otp
      // );
      // if(sendEmail.success===true)
      {
        return {
          detail:'signed in sucessfuly',
          code:1,
          signInUser:{firstName,
          lastName,
          email,
          mobileNo,
          role,
        }};
    }
  // else{
  //   return{
  //     code: 0,
  //     detail: `Email not send`,
  //     status: "400",
  //   };
  // };
  }
  }
export const verifyUserSignUp={
  type:new GraphQLObjectType({
    name:'VerifySignInResponse',
    fields:{
      detail:{type:GraphQLString},
      code:{type:GraphQLString}
    }
  }),
  args:{
    email:{type:GraphQLString},
    otp:{type:GraphQLString}
  },
  resolve:async(parent:any,args:any)=>{
    const {email}=args;
    const userData=await getUserByEmail(email);
    if(userData.error){
      return{
        code: userData.code,
        detail: userData.error,
        status: "400",
      };
    }
  else{
    
      if (Number(userData?.otp) === Number(args.otp)){
        
        await updateUserverifiedEmailByUserId(userData.uuid,true);
        let name;
        if(userData.last_name===null){
          name=userData.first_name;
        }
        name=userData.first_name+" "+userData.last_name;
        await updateRoleDetails(userData.uuid,name,userData.role_id);
       return{
        detail:`otp verfied`,
        code:1
       }
      }else{
        return{
          code: 0,
          detail: `Your OTP not matched`,
          status: "400",
        };
      }
  
  }
  }
  }
export const forgotPassword={
    type:new GraphQLObjectType({
      name:'ForgotPasswordResponse',
      fields:{
        detail:{type:GraphQLString},
        code:{type:GraphQLInt},
      }
    }),
    args:{
      email:{type:GraphQLString}
    },
    resolve:async(parent:any,args:any)=>{
       const {email}=args;
     
       const userData = await getUserByEmail(email);
   
       
        if(!userData.uuid){
          return{
            code: userData.code,
            detail: userData.error,
            status: "400",
          };
        }
       
       const otp = Math.floor(100000 + Math.random() * 9000);
       const sendEmail = await otpSendEmail(
         email,
         `${userData.first_name + " " + userData.last_name}`,
         otp
       );
       if (sendEmail.success === true) {
         const data = await updateOtpByUserId(userData.uuid, otp);
         if (data.code === 1) {
           return{
            detail:`otp send successfully`,
            code:1
           }
         }
         else {
          return{
            code: 0,
            detail: `OTP not send Please try again`,
            status: "400",
          };
       }
      }
    }
  }
export const verifyOtpByUserUuid={
  type:new GraphQLObjectType({
    name:'verifyUserOtpResponse',
    fields:{
      detail:{type:GraphQLString},
      code:{type:GraphQLString},
    }
  }),
  args:{
    userUuid:{type:GraphQLString},
    otp:{type:GraphQLString},
    newPassword:{type:GraphQLString}
  },
  resolve:async(parent:any,args:any)=>{
    const { userUuid, otp, newPassword } = args;
      const userData = await getUserByUserId(userUuid);
  
      if(!userData.uuid){
        return{
          code: userData.code,
          detail: userData.error,
          status: "400",
        };
      }
      if (Number(userData?.otp) === Number(otp)) {
        const encryptPassword = await bcryptPassword(newPassword); 
        const updatePassword = await updatePasswordByUserUuid(
          userUuid,
          encryptPassword
        );
        if (updatePassword.data) {
          return{
            detail:"Password change successfully",
            code:1
          }
        }
        return{
          code: 0,
          detail: `Password change failed`,
          status: "400",
        };
      }
      return{
        code: 0,
        detail: `Your OTP not matched`,
        status: "400",
      };
  }
  }