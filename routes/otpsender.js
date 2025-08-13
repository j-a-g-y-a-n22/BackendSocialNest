import express from 'express';
import getuser from '../middleware/getuser.js';
import nodemailer from 'nodemailer';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
let generatedotp;
setTimeout(() => {
    console.log(generatedotp);
    generatedotp = null;
}, 600000);
router.post('/otp', (res, req) => {
    const email = req.email;
    let otp1 = Math.floor(Math.random() * 999);
    let otp2 = Math.floor(Math.random() * 999);
    generatedotp = `${otp1} -${otp2}`
    console.log(otp1, "-", otp2);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}`,
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
    res.json({ message: "otp sent sucessfully" })
})

router.get('/otpmatch', (req, res) => {
    const otp = req.otp;
    if (otp == generatedotp) {
        console.log("OTP Matched");

    }
})