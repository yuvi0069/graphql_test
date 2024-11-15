import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export interface ContactFormState {
  message: string;
  error: boolean;
  success: boolean;
  fieldValues: {
    sender_name: string;
    sender_email: string;
    sender_message: string;
  };
}
export async function otpSendEmailSignInVerification(emailTo: string,
  name: string,
  otpCode: number){
    const apiKey = process.env.BREVO_API_KEY;
    const response = await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: {
          email: process.env.EMAIL_FROM,
          name: process.env.EMAIL_FROM_NAME,
        },
        to: [{ email: emailTo }],
        subject: "RENT_PAYMENT - SIGN IN VERIFICATION",
        htmlContent: `<!DOCTYPE html>
      <html lang="en-US">
<head>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  <title>Rent_Payment - Account Verification</title>
  <meta name="description" content="User Verfication" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #FFFFFF;
    }
    h1 {
      color: #1E1E2D;
      font-weight: 700;
      margin: 0;
      font-size: 28px;
      font-family: 'DM Sans', 'Arial';
      position: relative;
    }
    p {
      font-size: 14px;
      color: #455056;
      margin: 8px 0 0;
      line-height: 24px;
      font-family: 'DM Sans', 'Arial';
      position: relative;
    }
    h2 {
      display: inline-block;
      padding: 10px 24px;
      margin-top: 24px;
      margin-bottom:0px;
      font-size: 16px;
      text-decoration: none !important;
      font-weight: 400;
      border-radius: 50px;
      background: #454545;
      color: #FFFFFF !important;
      font-family: 'Schibsted Grotesk', 'Arial';
    }
   
    .content-container {
      position: relative;
      z-index: 1;
      padding:15px 35px; /* Adjusted padding for top and bottom */
    }
    .gap {
      margin-bottom: 0px; /* Adjusted value for the gap */
    }
    .main-container {
       margin-top:-18px;
      position: relative;
      overflow: hidden;
      border-radius: 25px; /* Ensure the border radius matches the container */
      background-color: #F7F6FE;
     
      background-position: top right, bottom left;
      background-repeat: no-repeat, no-repeat;
      background-size: 120px, 120px;
      border: 1px solid #EFEFEF;
      border-radius: 20px;
    }
    h3{
     
margin:0px;
    margin-left:0px;
    margin-top:10px;
    font-size:15px
    }
    .header{
    height:60px;
    width:100%;
    background-color:black;
    margin:0;
    }
    .footer{
    height:60px;
    width:100%;
    background-color:black;
    margin-top:-30px;
    }
    
 
  </style>
</head>
<body>

  <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#FFFFFF" style="margin:0px;">
    <tr>
      <td>
        <table width="100%" border="0" style="background-color: #FFFFFF; max-width: 600px; margin: 0;" cellpadding="0" cellspacing="0">
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>
              <div class="main-container shadow" style="max-width: 670px; margin-left: 8px;">
                <div class="content-container">
        
                  <h1>Account verification</h1>
                  <p ><strong><span style="font-weight:1000">Hi, ${name}</span> </strong><br />
                Welcome to Rental Payment.Please use the below code for verification.</p>
                  <h2>  ${otpCode} </h2>
                   <h3>With Regards<h3>
                    <h3>Rental_payment Team</h3>
                  <div class="white-box shadow" style="border-radius:10px; margin:0px;padding: 10px 22px 7px 15px;">
                 <h3 style="margin: 0px; position: relative; font-size: 14px; letter-spacing: 0.04em; text-transform: uppercase; font-weight: 700; font-family: inherit; display: inline-block; min-width: 115px; z-index: 2;">
                    </h3> 
                    
              
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="height: 40px;">&nbsp;</td>
          </tr>
        </table>
            
      </td>
    </tr>
  </table>
        
</body>
</html>`,
    },
    { headers: { "Content-Type": "application/json", "api-key": apiKey } }
  );
    if (response.data.messageId) {
      return {
        success: true,
        message: "Email send successfully",
        messageId: response.data.messageId,
      };
    } else {
      return {
        success: false,
        message: "Email send Error",
      };
    }
  }
export async function otpSendEmail(
  emailTo: string,
  name: string,
  otpCode: number
) {
  const apiKey = process.env.BREVO_API_KEY;
  const response = await axios.post(
    "https://api.sendinblue.com/v3/smtp/email",
    {
      sender: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      to: [{ email: emailTo }],
      subject: "RENT_PAYMENT - New Password",
      htmlContent: `<!DOCTYPE html>
    <html lang="en-US">
<head>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  <title>Rent_Payment - Account Verification</title>
  <meta name="description" content="User Verfication" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #FFFFFF;
    }
    h1 {
      color: #1E1E2D;
      font-weight: 700;
      margin: 0;
      font-size: 28px;
      font-family: 'DM Sans', 'Arial';
      position: relative;
    }
    p {
      font-size: 14px;
      color: #455056;
      margin: 8px 0 0;
      line-height: 24px;
      font-family: 'DM Sans', 'Arial';
      position: relative;
    }
    h2 {
      display: inline-block;
      padding: 10px 24px;
      margin-top: 24px;
      margin-bottom:0px;
      font-size: 16px;
      text-decoration: none !important;
      font-weight: 400;
      border-radius: 50px;
      background: #454545;
      color: #FFFFFF !important;
      font-family: 'Schibsted Grotesk', 'Arial';
    }
   
    .content-container {
      position: relative;
      z-index: 1;
      padding:15px 35px; /* Adjusted padding for top and bottom */
    }
    .gap {
      margin-bottom: 0px; /* Adjusted value for the gap */
    }
    .main-container {
       margin-top:-18px;
      position: relative;
      overflow: hidden;
      border-radius: 25px; /* Ensure the border radius matches the container */
      background-color: #F7F6FE;
     
      background-position: top right, bottom left;
      background-repeat: no-repeat, no-repeat;
      background-size: 120px, 120px;
      border: 1px solid #EFEFEF;
      border-radius: 20px;
    }
    h3{
     
margin:0px;
    margin-left:0px;
    margin-top:10px;
    font-size:15px
    }
    .header{
    height:60px;
    width:100%;
    background-color:black;
    margin:0;
    }
    .footer{
    height:60px;
    width:100%;
    background-color:black;
    margin-top:-30px;
    }
    
 
  </style>
</head>
<body>

  <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#FFFFFF" style="margin:0px;">
    <tr>
      <td>
        <table width="100%" border="0" style="background-color: #FFFFFF; max-width: 600px; margin: 0;" cellpadding="0" cellspacing="0">
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>
              <div class="main-container shadow" style="max-width: 670px; margin-left: 8px;">
                <div class="content-container">
        
                  <h1>Forgot Password</h1>
                  <p ><strong><span style="font-weight:1000">Hi, ${name}</span> </strong><br />
                Please use the below code to reset the password.</p>
                  <h2>  ${otpCode} </h2>
                   <h3>With Regards<h3>
                    <h3>Rental payment Team</h3>
                    <p>If not done by you contact <a href='#'>admin@rentpayment</a></p>
                  <div class="white-box shadow" style="border-radius:10px; margin:0px;padding: 10px 22px 7px 15px;">
                 <h3 style="margin: 0px; position: relative; font-size: 14px; letter-spacing: 0.04em; text-transform: uppercase; font-weight: 700; font-family: inherit; display: inline-block; min-width: 115px; z-index: 2;">
                    </h3> 
                    
              
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="height: 40px;">&nbsp;</td>
          </tr>
        </table>
            
      </td>
    </tr>
  </table>
        
</body>
</html>`,
    },
    { headers: { "Content-Type": "application/json", "api-key": apiKey } }
  );
  if (response.data.messageId) {
    return {
      success: true,
      message: "Email send successfully",
      messageId: response.data.messageId,
    };
  } else {
    return {
      success: false,
      message: "Email send Error",
    };
  }
}
export async function sendApplicationEmail(
  emailTo: string,
  name: string,
  tenantName: string,
  occupation: string,
  income:number,
  idnumber: string,
  iddocs: string
) {
  const apiKey = process.env.BREVO_API_KEY;
  const response = await axios.post(
    "https://api.sendinblue.com/v3/smtp/email",
    {
      sender: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      to: [{ email: emailTo }],
      subject: "RENT_PAYMENT - Tenant Application Details",
      htmlContent: `<!DOCTYPE html>
        <html lang="en-US">
        <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>Rent_Payment - Tenant Application</title>
          <meta name="description" content="Tenant Application Details" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
            body { margin: 0; padding: 0; background-color: #FFFFFF; }
            h1 { color: #1E1E2D; font-weight: 700; margin: 0; font-size: 28px; font-family: 'DM Sans', 'Arial'; }
            p { font-size: 14px; color: #455056; margin: 8px 0; line-height: 24px; font-family: 'DM Sans', 'Arial'; }
            h2 { padding: 10px 24px; margin-top: 24px; font-size: 16px; background: #454545; color: #FFFFFF; }
            .content-container { padding:15px 35px; }
            .main-container { margin-top:-18px; background-color: #F7F6FE; border: 1px solid #EFEFEF; border-radius: 20px; }
            h3 { margin: 10px 0; font-size: 15px; }
            .header { height: 60px; width: 100%; background-color: black; }
            .footer { height: 60px; width: 100%; background-color: black; margin-top:-30px; }
          </style>
        </head>
        <body>
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#FFFFFF" style="margin:0px;">
            <tr><td>
              <table width="100%" border="0" style="max-width: 600px; margin: 0;" cellpadding="0" cellspacing="0">
                <tr><td>&nbsp;</td></tr>
                <tr><td>
                  <div class="main-container" style="max-width: 670px; margin-left: 8px;">
                    <div class="content-container">
                      <h1>Tenant Application Details</h1>
                      <p><strong>Hi, ${name}</strong><br />
                      Here are the details of the tenant's application:</p>
                      <div class="white-box" style="padding: 15px; background-color: #FFFFFF; border-radius: 10px;">
                        <p><strong>Tenant Name:</strong> ${tenantName}</p>
                         <p><strong>Tenant Income:</strong> ${income}</p>
                        <p><strong>Occupation:</strong> ${occupation}</p>
                        <p><strong>ID Number:</strong> ${idnumber}</p>
                        <p><strong>ID Documents:</strong> ${iddocs}</p>
                      </div>
                      <h3>With Regards</h3>
                      <h3>Rental Payment Team</h3>
                      <p>If you have any questions, contact <a href="mailto:admin@rentpayment">admin@rentpayment</a></p>
                    </div>
                  </div>
                </td></tr>
                <tr><td style="height: 40px;">&nbsp;</td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>`,
    },
    { headers: { "Content-Type": "application/json", "api-key": apiKey } }
  );

  if (response.data.messageId) {
    return {
      success: true,
      message: "Email sent successfully",
      messageId: response.data.messageId,
    };
  } else {
    return {
      success: false,
      message: "Email sending error",
    };
  }
}
