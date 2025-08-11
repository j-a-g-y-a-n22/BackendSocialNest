import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

let otp1 = Math.floor(Math.random() * 999);
let otp2 = Math.floor(Math.random() * 999);
console.log(otp1, "-", otp2);

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'xyz@gmail.com',
    subject: 'Welcome',
    text: `Thank you for signing up! for Cat Caring JOB Your OTP is ${otp1}-${otp2}`
};

const exprtnodeail = transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});

export default exprtnodeail;