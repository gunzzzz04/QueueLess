
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

// Home Page
function Home() {
  const [selectedService, setSelectedService] = useState("");

  const services = [
    { icon: "📄", name: "Document Verification" },
    { icon: "💳", name: "Fee Related Queries" },
    { icon: "🎓", name: "Scholarship Assistance" },
    { icon: "🪪", name: "ID Card Services" },
    { icon: "📝", name: "Examination Queries" },
    { icon: "🏫", name: "Bonafide Certificate" },
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">🎟️ QueueLess</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#how-it-works">How It Works</a>

          <Link to="/student" className="login-btn">
            Student Dashboard
          </Link>

          <Link to="/admin" className="login-btn">
            Admin Dashboard
          </Link>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="tagline">SMART CAMPUS SERVICES</span>

          <h1>
            Skip the Queue.
            <br />
            <span>Save Your Time.</span>
          </h1>

          <p>
            Book appointments, generate virtual tokens,
            and track your queue status without waiting
            in long lines at the college office.
          </p>

          <div className="hero-buttons">
            <a href="#services" className="primary-btn">
              Book Appointment
            </a>

            <a href="#how-it-works" className="secondary-btn">
              How It Works
            </a>
          </div>
        </div>

        <div className="token-preview">
          <p>YOUR VIRTUAL TOKEN</p>
          <h2>A-025</h2>
          <span>Document Verification</span>

          <div className="token-details">
            <div>
              <strong>4</strong>
              <small>People Ahead</small>
            </div>

            <div>
              <strong>20 min</strong>
              <small>Estimated Wait</small>
            </div>
          </div>

          <div className="token-status">
            ● Queue Active
          </div>
        </div>
      </section>

      <section className="services-section" id="services">
        <h2>Our College Services</h2>
        <p>Select a service to get started.</p>

        <div className="services-grid">
          {services.map((service) => (
            <div
              className={
                selectedService === service.name
                  ? "service-card selected"
                  : "service-card"
              }
              key={service.name}
              onClick={() => setSelectedService(service.name)}
            >
              <div className="service-icon">
                {service.icon}
              </div>

              <h3>{service.name}</h3>
              <span>Book Now →</span>
            </div>
          ))}
        </div>

        {selectedService && (
          <div className="selection-message">
            Selected service:{" "}
            <strong>{selectedService}</strong>

            <p>
              Continue to the Student Dashboard to
              generate a token or book an appointment.
            </p>

            <Link to="/student" className="primary-btn">
              Go to Student Dashboard
            </Link>
          </div>
        )}
      </section>

      <section className="how-section" id="how-it-works">
        <h2>How QueueLess Works</h2>

        <div className="steps-grid">
          <div>
            <h3>01. Select Service</h3>
            <p>Choose the college service you need.</p>
          </div>

          <div>
            <h3>02. Book Your Slot</h3>
            <p>
              Get a virtual token or schedule an appointment.
            </p>
          </div>

          <div>
            <h3>03. Track Your Turn</h3>
            <p>
              Monitor your queue and visit when your turn arrives.
            </p>
          </div>
        </div>
      </section>

      <footer>
        © 2026 QueueLess | Smart College Queue Management
      </footer>
    </div>
  );
}

// Application Routes
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
