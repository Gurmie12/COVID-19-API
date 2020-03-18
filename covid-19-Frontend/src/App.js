import React, { useState } from 'react';
import './App.css';
import {Container, Navbar, Alert, Button} from 'react-bootstrap';

function App() {
  const [show, setShow] = useState(true);
  var today = new Date();
  const[date, setDate] = useState(today.getFullYear() + '-' +  (today.getMonth() + 1) + '-' + today.getDate());
  const[time, setTime] = useState((today.getHours() - 12) + ':' + today.getMinutes() + ':' + today.getSeconds());

  return (
    <div className="body-nav">
      <Navbar sticky="top" expand = "lg" style={{background:"#1F2833"}}>
        <Container>
          <Navbar.Brand style={{color:"#66FCF1", fontFamily:"'Righteous', cursive", fontSize:"2em", justifyContent:"left"}}>COVID-19 LIVE UPDATES</Navbar.Brand>
        </Container>
        <p className = "date">Date of update: {date}</p>
        <p className = "time">Time of update: {time}</p>
      </Navbar>
      <Alert variant= 'danger' show = {show}>
          If you are feeling ill and/or have recently traveled outside of Canada please contact a health care professional and self-isolate.       
          <div className="alert-button">
          <Button onClick={() => setShow(false)} variant="outline-danger">
              Understood.
          </Button>
          </div>                                     
      </Alert>
      <div className = "body">
          <h2 style={{justifyContent: "center", textAlign: "center", paddingTop: "4em", color: "#45A29E", fontFamily:"'Righteous', cursive"}}>
            All-time Cases
          </h2>
          <h2 style={{justifyContent: "center", textAlign: "center", paddingTop: "3em", color: "#45A29E", fontFamily:"'Righteous', cursive"}}>
            All-time Deaths
          </h2>
          <h2 style={{justifyContent: "center", textAlign: "center", paddingTop: "3em", color: "#45A29E", fontFamily:"'Righteous', cursive"}}>
            All-time recoverd
          </h2>
      </div>
    </div>
  );
}

export default App;
