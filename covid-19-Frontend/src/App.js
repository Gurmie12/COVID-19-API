//Author: Gurman Brar
//Date: 3/28/2020
//All Rights Reserved




import React, { useState, useEffect } from 'react';
import './App.css';
import {Container, Navbar, Alert, Button, Table, NavDropdown, Form, FormControl, Nav, ListGroup, Tabs, Tab, Toast, } from 'react-bootstrap';
import virus from './data/bacteria.svg';
import emoji from './data/emoji-wave.png';
import ReactMapGl,{Marker} from 'react-map-gl';


function App() {
  const [show, setShow] = useState(true);

  var today = new Date();

  const[date] = useState(today.getFullYear() + '-' +  ('0' + (today.getMonth() + 1)).slice(-2) + '-' + today.getDate());

  const[time] = useState((today.getHours()) + ':' + today.getMinutes() + ':' + today.getSeconds());

  const[casesByCountry, setCasesByCountry] = useState([]);

  const[countrySearch, setCountrySearch] = useState("");

  const[provinceSearch, setProvince] = useState("");

  const[CanadaProvincesConfirmed, setCanadaConfirmed] = useState([]);

  const[usStatesConfirmed, setUSConfirmed] = useState([]);

  const[stateSearch, setState] = useState("");

  const handleTextChange = event => {
    setCountrySearch(event.target.value);
  }

  const handleProvinceTextChange = event =>{
    setProvince(event.target.value);
  }

  const handleStateTextChange = event =>{
    setState(event.target.value);
  }

  const filterSearches = () => {
    const filtered = casesByCountry.filter(country => country.Country.toLowerCase().includes(countrySearch.toLowerCase()));
    setCasesByCountry(filtered)
  }

  const filterProvinceSearches = () => {
    const filteredProvinces = CanadaProvincesConfirmed.filter(province => province.Province.toLowerCase().includes(provinceSearch.toLowerCase()));
    setCanadaConfirmed(filteredProvinces);
  }

  const filterStateSearches = () =>{
    const filteredStates = usStatesConfirmed.filter(state => state.Province.toLowerCase().includes(stateSearch.toLowerCase()));
    setUSConfirmed(filteredStates);
  }

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  useEffect(() =>{
    fetch("https://api.covid19api.com/summary", requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.Countries){
        setCasesByCountry([...casesByCountry, ...result.Countries]);
      }
    })
  }, []);

  useEffect(() => {
    fetch("https://api.covid19api.com/live/country/canada/status/confirmed")
    .then(response => response.json())
    .then(data =>
      setCanadaConfirmed([...CanadaProvincesConfirmed, ...data.reverse()])
    )
  }, []);

  useEffect(() =>{
    fetch("https://api.covid19api.com/live/country/us/status/confirmed")
    .then(response => response.json())
    .then(data => {
      setUSConfirmed([...usStatesConfirmed, ...data.reverse()]);
    })
  }, [])

  function totalCases() {
    var total = 0;
    casesByCountry.map((country) =>{
      total = total + country.TotalConfirmed;
    })
    return total;
  }

  function totalDeaths() {
    var total = 0;
    casesByCountry.map((country) =>{
      total = total + country.TotalDeaths;
    })
    return total;
  }

  function totalRecovered(){
    var total = 0;
    casesByCountry.map((country) =>{
      total = total + country.TotalRecovered;
    })
    return total;
  }

  function precentChange(stat1, stat2){
    if(stat1 === 0 || stat2 === 0){
      return "No Change"
    }
    if(stat1 === stat2){
      return "100%";
    }
    var percent = 0;
    var difference = 0;
    difference = stat1 - stat2;
    percent = (stat1/difference - 1) * 100;
    percent = parseFloat(percent.toFixed(2));

    if(percent > 0 && percent < Infinity){
       return percent + "%";
    }
    else{
       return "No Change";
    }
  }

  const ascendingTotal = () => {
    const sorted = [...casesByCountry].sort((a,b) => {return b.TotalConfirmed - a.TotalConfirmed}).reverse();
    setCasesByCountry(sorted);
  }

  const descendingTotal = () => {
    const sorted = [...casesByCountry].sort((a,b) => {return b.TotalConfirmed - a.TotalConfirmed});
    setCasesByCountry(sorted);
  }

  const ascendingDeaths = () => {
    const sorted = [...casesByCountry].sort((a,b) => {return b.TotalDeaths - a.TotalDeaths}).reverse();
    setCasesByCountry(sorted);
  }

  const descendingDeaths = () => {
    const sorted = [...casesByCountry].sort((a,b) => {return b.TotalDeaths - a.TotalDeaths});
    setCasesByCountry(sorted);
  }

  const ascendingRecovered = () => {
    const sorted = [...casesByCountry].sort((a,b) => {return b.TotalRecovered - a.TotalRecovered}).reverse();
    setCasesByCountry(sorted);
  }

  const descendingRecovered = () => {
    const sorted = [...casesByCountry].sort((a,b) => {return b.TotalRecovered - a.TotalRecovered});
    setCasesByCountry(sorted);
  }

  const ascendingProvinces = () =>{
    const sorted = [...CanadaProvincesConfirmed].sort((a,b) => {return b.Cases - a.Cases});
    setCanadaConfirmed(sorted);
  }

  const descendingProvinces = () =>{
    const sorted = [...CanadaProvincesConfirmed].sort((a,b) => {return b.Cases - a.Cases}).reverse();
    setCanadaConfirmed(sorted);
  }

  const ascendingStates = () =>{
    const sorted = [...usStatesConfirmed].sort((a,b) => {return b.Cases - a.Cases});
    setUSConfirmed(sorted);
  }

  const descendingStates = () =>{
    const sorted = [...usStatesConfirmed].sort((a,b) => {return b.Cases - a.Cases}).reverse();
    setUSConfirmed(sorted);
  }

  const [showSelfTest, setSelfTest] = useState(false);

  const [viewport, setViewport] = useState({
    width: '1400px',
    height: '600px',
    latitude: 43.651893,
    longitude: -79.381713,
    zoom: 5
  });

  function renderAlert(){
    if(showSelfTest){
      return(
        <Alert variant="danger" onClose={() => setSelfTest(false)} dismissible style={{borderRadius:'2em'}}>
          <Alert.Heading>Don't Wait Till Its Too Late!</Alert.Heading>
            <p>
              Click the button to be redirected to a Canadian self-assesment for the COVID-19 Virus.
            </p>
            <Button variant="outline-success" href="https://covid-19.ontario.ca/self-assessment/#q0" onClick={() => setSelfTest(false)}>Take Self-Assesment</Button>
        </Alert>
      )
    }
  }

  return (
    <div className="body-nav">
      <Navbar sticky="top" expand = "lg" style={{background:"#1F2833"}}>
        <img
          src = {virus}
          alt = "virus"
          style={{width: '90px', height:'90px', textAlign: 'left'}}
        />
        <Container>
          <Navbar.Brand style={{color:"#66FCF1", fontFamily:"'Righteous', cursive", fontSize:"2em", justifyContent:"left"}}>COVID-19 LIVE UPDATES</Navbar.Brand>
        </Container>
        <p className = "date">Date of update: {date}</p>
        <p className = "time">Time of update: {time}</p>
      </Navbar>
      <Alert variant= 'danger' show = {show}>
          If you are feeling ill and/or have recently traveled, please contact a health care professional and self-isolate.   
          <div className="alert-button">
          <Button onClick={() => setShow(false)} variant="outline-danger">
              Understood.
          </Button>
          </div>                                     
      </Alert>
      <div style={{display: 'flex'}}>
      <div className = "body" style={{paddingLeft:'3em'}}>
          <h2 style={{justifyContent: "center", textAlign: "center", paddingTop: "2em", color: "#66FCF1", fontFamily:"'Righteous', cursive"}}>
            Total Confirmed Cases
          </h2>
          <h4 style={{justifyContent: "center", textAlign: "center", paddingTop: "2em", color: "#FFC300 ", fontFamily:"'Righteous', cursive"}}>{totalCases()}</h4>
          <h2 style={{justifyContent: "center", textAlign: "center", paddingTop: "3em", color: "#66FCF1", fontFamily:"'Righteous', cursive"}}>
            All-time Deaths
          </h2>
          <h4 style={{justifyContent: "center", textAlign: "center", paddingTop: "2em", color: "#C70039", fontFamily:"'Righteous', cursive"}}>{totalDeaths()}</h4>
          <h2 style={{justifyContent: "center", textAlign: "center", paddingTop: "3em", color: "#66FCF1", fontFamily:"'Righteous', cursive"}}>
            All-time Recoveries
          </h2>
          <h5 style={{justifyContent: "center", textAlign: "center", paddingTop: "2em", color: "#DAF7A6", fontFamily:"'Righteous', cursive"}}>{totalRecovered()}</h5>
      </div>
          <div style={{width: 'auto', height: 'auto', paddingLeft: '3em', paddingTop:'3em'}}>
              <ReactMapGl
                  mapboxApiAccessToken="pk.eyJ1IjoiZ3VybWFuYnJhcjEyMzQiLCJhIjoiY2s4ZmNvbzA4MDMwdjNlcGM4YTh3Y2lpeCJ9.ndxIUedpKzKqlw3a7QqVzA"
                  {...viewport}
                  onViewportChange={viewport => {setViewport(viewport)}}
                  mapStyle="mapbox://styles/gurmanbrar1234/ck8fdgjqk2m991inzvgahervq/draft"
                     >
              </ReactMapGl>
              <h4 style={{justifyContent: "center", textAlign: "center", paddingTop: "1em", color: "#66FCF1", fontFamily:"'Righteous', cursive"}}>
                <span style={{color: "#DAF7A6"}}>0 </span>
                Cases to 
                <span style={{color: "#581845"}}> 67000 </span>
                Cases (Each circle represents a Province/State)
                </h4>
          </div>
      </div>

      <div className="country-Chart">
        <Tabs defaultActiveKey="charts-by-country" variant="pills" className="homepage-tabs">
            <Tab eventKey ="charts-by-country" title="Charts by Country" style={{background: "#66FCF1"}}>
                  <Navbar bg="dark" expand="lg">
                      <Navbar.Brand style={{color: "#66FCF1", fontFamily:"'Righteous', cursive"}}>Cases By Country</Navbar.Brand>
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                      <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                          <NavDropdown style={{color: "#66FCF1", fontFamily:"'Righteous', cursive"}} title="Sort" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={descendingTotal}>Highest Cases to Lowest</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={ascendingTotal} >Lowest Cases to Highest</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={descendingDeaths}>Highest Deaths to Lowest</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={ascendingDeaths} >Lowest Deaths to Highest</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={descendingRecovered}>Highest Recoveries to Lowest</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={ascendingRecovered}>Lowest Recoveries to Highest</NavDropdown.Item>
                            <NavDropdown.Divider />
                          </NavDropdown>
                        </Nav>
                        <Form inline>
                          <FormControl type="text" placeholder="Search by Country" className="mr-sm-2" onChange={handleTextChange} style={{color: "black", fontFamily:"'Righteous', cursive"}} />
                          <Button variant="outline-danger" onClick={filterSearches} >Search</Button>
                        </Form>
                      </Navbar.Collapse>
                    </Navbar>
              <Table hover variant="dark" size="sm">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Total Cases</th>
                  <th>Total New Cases</th>
                  <th>Change in Cases(%)</th>
                  <th>Total Deaths</th>
                  <th>Total New Deaths</th>
                  <th>Change in Deaths(%)</th>
                  <th>Total Recoveries</th>
                  <th>Total New Recoveries</th>
                  <th>Change in Recoveries(%)</th>
                </tr>
              </thead>
              <tbody>
                {casesByCountry.map((country, index) =>{
                  if(country.Country != ""){
                    return(
                        <tr key={index}>
                          <td>{country.Country.toUpperCase()}</td>
                          <td>{country.TotalConfirmed}</td>
                          <td>{country.NewConfirmed}</td>
                          <td style={{color: (precentChange(country.TotalConfirmed, country.NewConfirmed) != "No Change") ? "#FFC300":""}}>{precentChange(country.TotalConfirmed, country.NewConfirmed)}</td>
                          <td>{country.TotalDeaths}</td>
                          <td>{country.NewDeaths}</td>
                          <td style={{color: (precentChange(country.TotalDeaths, country.NewDeaths) != "No Change") ? "#C70039 ":""}}>{precentChange(country.TotalDeaths, country.NewDeaths)}</td>
                          <td>{country.TotalRecovered}</td>
                          <td>{country.NewRecovered}</td>
                          <td style={{color: (precentChange(country.TotalRecovered, country.NewRecovered) != "No Change") ? "#DAF7A6 ":""}}>{precentChange(country.TotalRecovered, country.NewRecovered)}</td>
                          <td></td>
                        </tr>
                    )
                  }
                })}
              </tbody>
              </Table>
            </Tab>
            <Tab eventKey="charts-by-State" title="Charts by Province (Canada)">
                    <Navbar bg="dark" expand="lg">
                      <Navbar.Brand style={{color: "#66FCF1", fontFamily:"'Righteous', cursive"}}>Cases By State/Province</Navbar.Brand>
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                      <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                          <NavDropdown style={{color: "#66FCF1", fontFamily:"'Righteous', cursive"}} title="Sort" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={ascendingProvinces}>Highest Cases to Lowest</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={descendingProvinces}>Lowest Cases to Highest</NavDropdown.Item>
                            <NavDropdown.Divider />
                          </NavDropdown>
                        </Nav>
                        <Form inline>
                          <FormControl type="text" placeholder="Search by Province" className="mr-sm-2" onChange={handleProvinceTextChange} style={{color: "black", fontFamily:"'Righteous', cursive"}} />
                          <Button variant="outline-danger" onClick={filterProvinceSearches} >Search</Button>
                        </Form>
                      </Navbar.Collapse>
                    </Navbar>
            <Table hover variant="dark" size="sm">
              <thead>
                <tr>
                  <th>Province</th>
                  <th>Confirmed Cases</th>
                  <th>Date of data</th>
                </tr>
              </thead>
              <tbody>
                {CanadaProvincesConfirmed.map((province, index) =>{
                        if(province.Date.includes(date) && province.Province != "Recovered"){
                          return(
                              <tr key={index}>
                                <td>{province.Province.toUpperCase()}</td>
                                <td style={{color: (province.Cases >= 100) ? "#FFC300":""}}>{province.Cases}</td>
                                <td>{province.Date.substring(0,10) + ' --- ' + province.Date.substring(11,18)}</td>
                              </tr>
                          )
                        }
                  })} 
              </tbody>
              </Table>
            </Tab>
            <Tab eventKey="charts-by-Province" title="Charts by State (US)">
                    <Navbar bg="dark" expand="lg">
                      <Navbar.Brand style={{color: "#66FCF1", fontFamily:"'Righteous', cursive"}}>Cases By State</Navbar.Brand>
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                      <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                          <NavDropdown style={{color: "#66FCF1", fontFamily:"'Righteous', cursive"}} title="Sort" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={ascendingStates}>Highest Cases to Lowest</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={descendingStates}>Lowest Cases to Highest</NavDropdown.Item>
                            <NavDropdown.Divider />
                          </NavDropdown>
                        </Nav>
                        <Form inline>
                          <FormControl type="text" placeholder="Search by State" className="mr-sm-2" onChange={handleStateTextChange} style={{color: "black", fontFamily:"'Righteous', cursive"}} />
                          <Button variant="outline-danger" onClick={filterStateSearches} >Search</Button>
                        </Form>
                      </Navbar.Collapse>
                    </Navbar>
                    <Table hover variant="dark" size="sm">
                      <thead>
                        <tr>
                          <th>State</th>
                          <th>Confirmed Cases</th>
                          <th>Date of data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usStatesConfirmed.map((province, index) =>{
                                if(province.Date.includes(date) && province.Province != "Recovered"){
                                  return(
                                      <tr key={index}>
                                        <td>{province.Province.toUpperCase()}</td>
                                        <td style={{color: (province.Cases >= 100) ? "#FFC300":""}}>{province.Cases}</td>
                                        <td>{province.Date.substring(0,10) + ' --- ' + province.Date.substring(11,18)}</td>
                                      </tr>
                                  )
                                }
                          })} 
                      </tbody>
                    </Table>
                  
            </Tab>
            <Tab eventKey="information/symptoms" title="Information/Symptoms" onEnter={() => setSelfTest(true)}>
            <div className="info" style={{textAlign: "center"}}>
              <h2 style={{justifyContent: "center", textAlign: "center", paddingTop: "2em", color: "red", fontFamily:"'Righteous', cursive"}}>
                  Common Symptoms / Information
              </h2>
              <ListGroup style={{paddingBottom: '4em'}}>
                <ListGroup.Item style={{background: "#0B0C10", color: "#45A29E"}}>- You may be sick with the virus for up to 2 weeks before developing symptoms</ListGroup.Item>
                <ListGroup.Item style={{background: "#0B0C10", color: "#45A29E"}}>- Cough</ListGroup.Item>
                <ListGroup.Item style={{background: "#0B0C10", color: "#45A29E"}}>- High Fever</ListGroup.Item>
                <ListGroup.Item style={{background: "#0B0C10", color: "#45A29E"}}>- Tiredness</ListGroup.Item>
                <ListGroup.Item style={{background: "#0B0C10", color: "#45A29E"}}>- Difficulty Breathing</ListGroup.Item>
                <ListGroup.Item style={{background: "#0B0C10", color: "#45A29E"}}>- COVID-19 is an airborne virus</ListGroup.Item>
                <ListGroup.Item style={{background: "#0B0C10", color: "#45A29E"}}>- Most commonly transmited through exchange of droplets during coughing</ListGroup.Item>
              </ListGroup>
              {renderAlert()}
            </div>
            </Tab>
        </Tabs>
        <Navbar style={{background:"#1F2833"}}>
        <img
          src = {virus}
          alt = "virus"
          style={{width: '90px', height:'90px', textAlign: 'left'}}
        />
        <Navbar.Brand style={{color:"#66FCF1", fontFamily:"'Righteous', cursive", fontSize:"2em", justifyContent:"left", paddingLeft:"1em"}}>COVID-19 LIVE UPDATES</Navbar.Brand>
        <Container>
          <p style={{color:"#66FCF1", fontFamily:"'Righteous', cursive", fontSize:"14px", textAllign:"right"}}>
          This website was designed and developed by Gurman Brar to provide insight and constant updates to the current global pandemic. If you wish to inquire more please visit the link below to my website.
           This website is not intended to be the original source of updates and fetches data from API sources. Please remember to stay safe and stay clean!
          </p>
          <Button variant="danger" style={{paddingLeft: '1em', textAlign: 'center'}} href="https://gurmanbrar.com">Click Here to Learn More</Button>
        </Container>
      </Navbar>
      </div>
    </div>
  );
}

export default App;
