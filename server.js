
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer')
require('dotenv').config();



const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected')) 
  .catch((err) => console.log(err));

 
// Nodemailer Configuration



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_GMAIL,
    pass: process.env.ADMIN_GMAIL_PASSWORD
  }, 
}); 
 

// Booking Model
const BookingSchema = new mongoose.Schema({
  studentName: String,
  section: String,
  courtNumber: Number,
  timeSlot: String,
  bookingDate: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', BookingSchema);
 

// API Endpoints
app.get('/bookings', (req, res) => {
  Booking.find()
    .then((bookings) => res.json(bookings))
    .catch((err) => res.status(400).json({ error: err.message }));
});


 


app.post('/bookings', (req, res) => {
  console.log(req.body);
  const { userEmail, studentName, section, courtNumber, timeSlot } = req.body;

  const sportsPeriodTimings = {
    A: '02:30-03:45',
    B: '03:45-04:30',
    C: '04:30-05:30',
  };

  if (sportsPeriodTimings[section] == timeSlot) {

    const newBooking = new Booking({
      studentName,
      section,
      courtNumber,
      timeSlot,
      bookingDate: new Date(),
    });
  
    newBooking
      .save()
      .then(() => 
      {
        const bookingUpdateMailOptions = {
          from: '', // SENDER GMAIL ID
          to: userEmail,
          subject: 'Booking Successful',
          text: 'You have successfully booked batminton court!!',
        };

        transporter.sendMail(bookingUpdateMailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('email sent: ' + info.response);
          }
        });

        res.json({ message: 'Booking added!' })
      })
      .catch((err) =>
      {
        const bookingUpdateErrorMailOptions = {
          from: '', // SENDER GMAIL ID
          to: userEmail,
          subject: 'Booking Rejected',
          text: 'Your Batminton Court Booking was Rejected due to server problem!!',
        };

        transporter.sendMail(bookingUpdateErrorMailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('email sent: ' + info.response);
          }
        });
        res.status(400).json({ error: err.message })
      });
  }
  else{
    const bookingUpdateErrorMailOptions = {
      from: '', // SENDER GMAIL ID
      to: userEmail,
      subject: 'Booking Rejected',
      text: 'Your Batminton Court Booking was Rejected due to your class time table clash!!',
    };

    transporter.sendMail(bookingUpdateErrorMailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('email sent: ' + info.response);
      }
    });
  }
  
});



app.delete('/bookings/:id', (req, res) => {
  Booking.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: 'Booking deleted!' }))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Start Server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});