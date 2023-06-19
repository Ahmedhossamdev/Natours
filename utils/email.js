const nodemailer = require('nodemailer');
const pug = require('pug');
const {htmlToText} = require('html-to-text');

// new Email(user , url).sendWelcome();
module.exports = class Email {

  // Function will be going to run when new object created from this class
  constructor(user , url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Ahmed Hossam <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
       return nodemailer.createTransport({
         // host : 'smtp-relay.sendinblue.com',
         // port:  '587',
         service: 'SendinBlue',
         auth :{
           user: process.env.SENDINBLUE_USERNAME,
           pass: process.env.SENDINBLUE_PASSWORD,
         },
       });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      // service : "Gmail",
      // Activate in gmail "less secure app " options
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  // Send the actual email
  async send(template , subject){

    // 1) render HTML based on the template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug` , {
      firstName : this.firstName,
      url: this.url,
      subject
    });
    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text : htmlToText(html)
      // text: htmlToText.fromString(html)
      //html:
    };

    // 3) Create a transport and send email
     await this.newTransport().sendMail(mailOptions);

  }

  // this is useful so we can create multiple different subjects
  async sendWelcome(){
   await this.send('welcome' , 'Welcome to the Natours Family');
  }

  async sendPasswordReset(){
    await this.send('passwordReset' , 'Your password reset token (valid for only 10 minutes)');
  }
};




// const sendEmail = async options => {
//   1) Create a transporter
//   const transporter = nodemailer.createTransport({
//
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     //service : "Gmail",
//     // Activate in gmail "less secure app " options
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });
//   2) Define the email options
//   const mailOptions = {
//     from: 'Ahmed Hossam <ahmedhossamdev1@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//     //html:
//   };
//
//   3) Actually send the email
//   await transporter.sendMail(mailOptions);
// };
//
// module.exports = sendEmail;
