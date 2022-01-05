import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData } from "./util";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import {stats_number} from "./util";

function App() {
  const[countries,setCountries]=useState([]);
  const[country,setCountry]=useState("worldwide");
  const[countryInfo,setCountryInfo]=useState({});
  const[tableData,setTableData]=useState([]);
  const[mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const[mapZoom, setMapZoom] = useState(3);
  const[mapCountries,setMapCountries] = useState([]);
  const[casesType,setCasesType] = useState("cases");

  useEffect(()=>{
    fetch("https://corona.lmao.ninja/v2/all")
    .then(response => response.json())
    .then(data=>{
      setCountryInfo(data);
    });
  },[]);

  useEffect(()=>{
    const getCountries = async() => {
     await fetch ("https://disease.sh/v3/covid-19/countries")
     .then((response)=>response.json())
     .then((data)=>{
       const countries_data = data.map((countryAlone)=>(
         {
           name: countryAlone.country,
           value: countryAlone.countryInfo.iso2
         }));
       const sortedData = sortData(data);
       setTableData(sortedData);
       setMapCountries(data);
       setCountries(countries_data);
     })
    }
    getCountries();
  },[]);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://corona.lmao.ninja/v2/all"
        : `https://corona.lmao.ninja/v2/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  return (
    <div className="app">

      <div className="app_left">

      <div className="app_header">

        <h1><i className="fas fa-virus"></i> COVID-19 TRACKER</h1>

        <FormControl className="app_dropdown">
            <Select 
            onChange={onCountryChange}
            variant="outlined" 
            value={country}>
               <MenuItem value="worldwide">Worldwide</MenuItem>
               {countries.map((country)=>{
                   return(
                     <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
                   );
                  })}
            </Select>
        </FormControl>

      </div>
      <div className="app_stats">

      <InfoBox isRed active={casesType==="cases"} onClick={(e)=>setCasesType("cases")} title="Coronavirus Cases" cases={stats_number(countryInfo.todayCases)} total={stats_number(countryInfo.cases)}/>
      <InfoBox active={casesType==="recovered"} onClick={(e)=>setCasesType("recovered")} title="Recovered" cases={stats_number(countryInfo.todayRecovered)} total={stats_number(countryInfo.recovered)}/>
      <InfoBox isRed active={casesType==="deaths"} onClick={(e)=>setCasesType("deaths")} title= "Death" cases={stats_number(countryInfo.todayDeaths)} total={stats_number(countryInfo.deaths)}/>

      </div>

      <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />

      </div>
      <Card className="app_right">

        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData}/>
          <h3 className="worldwide_cases">Worldwide new {casesType}</h3>
          <LineGraph className="app_graph" casesType={casesType}/>
        </CardContent>

      </Card>
    </div>
  );
}

export default App;
