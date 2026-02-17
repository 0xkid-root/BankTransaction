require('dotenv').config();
const nodemailer = require('nodemailer');

// transporter ka kam hota hai jo email ka server hota hai SMTP server us se contact krna ke liye transporter ke need hote hai 


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail,name) {
    const subject = 'Welcome to Backend Ledger!';
    const text = `Hello ${name},\n\nWelcome to Backend Ledger! We are excited to have you on board.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<h1>Hello ${name},</h1>\n<p>Welcome to Backend Ledger! We are excited to have you on board.</p>\n<p>Best regards,</p>\n<p>The Backend Ledger Team</p>`;
   await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
};