import React, {useEffect, useState} from 'react';
import moment, { Moment } from 'moment';
import axios from "axios";

import logo from './abc-glofox-logo.png';
import './App.css';

type Staff = {
  createdAt: string;
  id: string;
  name: string;
  type: 'trainer' | 'receptionist' | 'admin';
}
type StaffAPIResponse = Staff[];
type Trainer = Staff & {
  type: 'trainer'
};

type AppointmentAPIRequestBody = {
  name: string;
  email: string;
  dateTime: string;
  trainerId: Trainer['id'];
}

const STAFF_ENDPOINT = 'https://64df526f71c3335b25826fcc.mockapi.io/trainers';
const APPOINTMENT_ENDPOINT = 'https://64df526f71c3335b25826fcc.mockapi.io/appointment';

function toMoment(x: string): Moment {
  const date = moment(x);
  if (date.isValid()) {
    return date;
  }
  throw new Error('computer says no');
}

function isTrainer(x: Staff): x is Trainer {
  return x.type === 'trainer';
}

async function getTrainers() {
  try {
    const response = await axios.get(STAFF_ENDPOINT)
    return response.data.filter((item:Staff) => isTrainer(item))
  } catch (error) {
    return ["error"] 
  }
}

const config = {
  name: {
    id: 'name',
    name: 'name',
    type: 'email',
    minLength: 1,
    maxLength: 10,
    required: true,
  },
  email: {
    id: 'email',
    name: 'email',
    type: 'email',
    minLength: 5,
    maxLength: 100,
    required: true,
  },
  dateTime: {
    id: 'dateTime',
    name: 'dateTime',
    type: 'datetime-local',
    min: '1900-01-01',
    max: '2005-31-12',
    required: true,
  },
  trainer: {
    id: 'trainer',
    name: 'trainer',
    type: 'select',
    options: [/* fetch */],
    required: true,
  }
}

function onSubmit(e: any,data: object) {
  e.preventDefault()
  // POST to ${APPOINTMENTS_ENDPOINT}
  // Should match AppointmentAPIRequestBody type
  console.log("data",data)
}

function App() {
  const [trainer,setTrainer] = useState([])
  const [data, setData] = useState({})

  useEffect(() => {
    if(trainer.length === 0){
      callTrainer()
    }
  },[]);

  async function callTrainer(){
    const response = await getTrainers();
    setTrainer(response)
  }

  function handleChange(e: any){
    setData({...data, [e.target.name]: e.target.value});
  }

  return (
    <div className="App">
      <header className="app__header">
        <img src={logo} className="ApP--logo" alt="logo" />
      </header>
      <main className="appmain">
        <form onSubmit={(e) => onSubmit(e,data)}>
          <label className="label">
            Name:
            <input required id='name' name='name' onChange={(e) => handleChange(e)} />
          </label>
          <label className="label email-input">
            Email:
            <input required id='email' name='email' onChange={(e) => handleChange(e)} />
          </label>
          <label className="label ">
            Date:
            <input required className='date-input' name="datetime" onChange={(e) => handleChange(e)} id='dateTime' type="datetime-local" />
          </label>
          <label className="label-trainer">
            Trainer:
            <select required id='trainer' name="trainer" onChange={(e) => handleChange(e)}>
              {trainer.map( (item: any, index) => (
                <option key={index} value={`${item.id}`}>{item.name}</option>
              ))} 
            </select>
          </label>
          
          <input type="submit" />
        </form>
      </main>
    </div>
  );
}

export default App;
