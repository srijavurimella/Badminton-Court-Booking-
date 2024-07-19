import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookingPage = () => {
  const [userEmail, setUserEmail] = useState(''); // New state for user's email
  const [studentName, setStudentName] = useState('');
  const [section, setSection] = useState('');
  const [courtNumber, setCourtNumber] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!userEmail || !studentName || !section || !courtNumber || !timeSlot) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const newBooking = {
      userEmail,
      studentName,
      section,
      courtNumber,
      timeSlot,
    };

    // const newBooking=JSON.stringify(newBookingArray);
    console.log(newBooking);
    axios
      .post('http://localhost:5000/bookings', newBooking)
      .then((response) => {
        console.log(response.data);
        setUserEmail(''); // Clear userEmail after successful submission
        setStudentName('');
        setSection('');
        setCourtNumber('');
        setTimeSlot('');
        setErrorMessage('');
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage('An error occurred. Please try again later.');
      });
  };
  return (
    <div className="container">
      <h1>Booking Page</h1>
      {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className='form-label'>User Email: </label>
          <input
            type="email"
            value={userEmail}
            onChange={(event) => setUserEmail(event.target.value)}
          />
        </div> 
        <div className="mb-3">
          <label className="form-label">Student Name:</label>
          <input
            type="text"
            className="form-control"
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Class Section:</label>
          <select
            className="form-select"
            value={section}
            onChange={(event) => setSection(event.target.value)}
          >
            <option value="">Select your Class Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>


        <div className="mb-3">
          <label className="form-label">Court Number:</label>
          <select
            className="form-select"
            value={courtNumber}
            onChange={(event) => setCourtNumber(event.target.value)}
          >
            <option value="">Select Court Number</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
  
        <div className="mb-3">
          <label className="form-label">Time Slot:</label>
          <select
            className="form-select"
            value={timeSlot}
            onChange={(event) => setTimeSlot(event.target.value)}
          >
            <option value="">Select a time slot</option>
            <option value="02:30-03:45">02:30-03:45</option>
            <option value="03:45-04:30">03:45-04:30</option>
            <option value="04:30-05:30">04:30-05:30</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Book Now</button>
      </form>
    </div>
  );
  };
  
  export default BookingPage;