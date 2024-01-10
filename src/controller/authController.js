import "dotenv/config";
import nodemailer from 'nodemailer' ;
import util from 'util' ;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

function formatDateRange(dateString) {
    // Convert the input date string to a Date object
    const dateParts = dateString.split('-').map(Number);
    const inputDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  
    // Find the Monday of the current week
    const monday = new Date(inputDate);
    monday.setDate(inputDate.getDate() - inputDate.getDay() + (inputDate.getDay() === 0 ? -6 : 1));
  
    // Find the Sunday of the current week
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
  
    // Format the dates to the desired string format
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedMonday = monday.toLocaleDateString('en-US', options);
    const formattedSunday = sunday.toLocaleDateString('en-US', options);
  
    // Construct and return the result string
    return `${formattedMonday} to ${formattedSunday}`;
  }

const sendMail = util.promisify(transporter.sendMail).bind(transporter);

async function mail(toEmail , toSubject , toText) {
  try {
    const info = await sendMail({
        from: 'accelbi.info@gmail.com',
        to: toEmail ,
        subject: toSubject,
        text: toText
      });
    return 1;
  } catch (error) {
    return 0;
  }
}


export async function toMan(req,res){
    const {toEmail , empName , manName , code , date , resubmit} = req.body;
    const todaysDate = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = todaysDate.toLocaleDateString('en-US', options);
    let mailSent = 0;
    if(resubmit){
        mailSent = mail(toEmail , `${formatDateRange(date)} Time-Sheet Resubmitted by ${empName} (${code})` , `Dear ${manName},\n\n    Time Sheet of ${formatDateRange(date)} is resubmitted by ${empName} on ${formattedDate}. Kindly respond to the request.` )
    }
    else{
        mailSent = mail(toEmail , `${formatDateRange(date)} Time-Sheet Submitted by ${empName} (${code})` , `Dear ${manName},\n\n    Time Sheet of ${formatDateRange(date)} is submitted by ${empName} on ${formattedDate}. Kindly respond to the request.` )
    }

    if(mailSent){
        res.status(200).json({
            success : true
        })
    } else {
        res.status(200).json({
            success : false
        })
    }
    
    
}


export async function toEmp(req,res){
    const {toEmail , empName , manName , code , date , status , reason} = req.body;
    
    const todaysDate = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = todaysDate.toLocaleDateString('en-US', options);
    let mailSent = 0;
    if(status){
        mailSent = mail(
            toEmail , 
            `${formatDateRange(date)} Time-Sheet Approved by ${manName} (${code})` , 
            `Dear ${empName},\n\n    Time Sheet of ${formatDateRange(date)} is approved by ${manName} on ${formattedDate}. ` 
            )
    }
    else{
        mailSent = mail(
            toEmail , 
            `${formatDateRange(date)} Time-Sheet Rejected by ${manName} (${code})` , 
            `Dear ${empName},\n\n    Time Sheet of ${formatDateRange(date)} is rejected by ${manName} on ${formattedDate}. Kindly check your timesheet.\n\nReason: ${reason}` )
    }

    if(mailSent){
        res.status(200).json({
            success : true
        })
    } else {
        res.status(200).json({
            success : false
        })
    }
}


// var nodemailer = require('nodemailer');
// import nodemailer from 'nodemailer' ;

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'accelbi.info@gmail.com',
//     pass: 'luoe jhix bwwu bpiw'
//   }
// });

// var mailOptions = {
//   from: 'accelbi.info@gmail.com',
//   to: 'salimehdi96@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     // console.log(error);
//   } else {
//     // console.log('Email sent: ' + info.response);
//   }
// });