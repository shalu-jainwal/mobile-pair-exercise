import React, { useEffect, useState } from "react";
import Select from "react-select";
import moment, { Moment } from "moment";
import axios from "axios"; // for API requests

import logo from "./abc-glofox-logo.png";
import "./App.css";

type Staff = {
  createdAt: string;
  id: string;
  name: string;
  type: "trainer" | "receptionist" | "admin";
};

type Trainer = Staff & {
  type: "trainer";
};

type StaffAPIResponse = Staff[];

type AppointmentAPIRequestBody = {
  name: string;
  email: string;
  dateTime: string;
  trainerId: Trainer["id"];
};

const STAFF_ENDPOINT = "https://64df526f71c3335b25826fcc.mockapi.io/trainers";
const APPOINTMENT_ENDPOINT =
  "https://64df526f71c3335b25826fcc.mockapi.io/appointment";

function toMoment(x: string): Moment {
  const date = moment(x);
  if (date.isValid()) {
    return date;
  }
  throw new Error("computer says no");
}

function isTrainer(x: Staff): x is Trainer {
  return x.type === "trainer";
}

function App() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dateTime: "",
    trainerId: "",
  });

  // Fetch trainers from the API
  useEffect(() => {
    axios.get<StaffAPIResponse>(STAFF_ENDPOINT).then((response) => {
      const trainerData = response.data.filter(isTrainer);
      setTrainers(trainerData);
    });
  }, []);

  // Handle form submission
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const appointmentData: AppointmentAPIRequestBody = {
      name: formData.name,
      email: formData.email,
      dateTime: formData.dateTime,
      trainerId: selectedTrainer!,
    };

    // Post appointment data
    axios
      .post(APPOINTMENT_ENDPOINT, appointmentData)
      .then((response) => {
        console.log("Appointment booked successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error booking appointment:", error);
      });
  };

  // Handle trainer selection
  const handleTrainerChange = (selectedOption: any) => {
    setSelectedTrainer(selectedOption?.value || null);
    setFormData((prev) => ({
      ...prev,
      trainerId: selectedOption?.value || "",
    }));
  };

  return (
    <div className="App">
      <header className="app__header">
        <img src={logo} className="ApP--logo" alt="logo" />
      </header>
      <main className="appmain">
        <form onSubmit={onSubmit} className="customForm">
          <div>
            <label className="field">Name: </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="field">Email:</label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="field">Date & Time:</label>
            <input
              id="dateTime"
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) =>
                setFormData({ ...formData, dateTime: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="field">Trainer:</label>
            <Select
              id="trainer"
              name="trainer"
              options={trainers.map((trainer) => ({
                value: trainer.id,
                label: trainer.name,
              }))}
              onChange={handleTrainerChange}
              placeholder="Select a trainer"
              required
            />
          </div>
          <button type="submit" className="customButton">
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
