import { useState, useEffect } from "react";
import "./StudentDashboard.css";

const services = [
    "Document Verification",
    "Fee Related Queries",
    "Scholarship Assistance",
    "ID Card Services",
    "Examination Queries",
    "Bonafide Certificate",
];

export default function StudentDashboard() {
    const [service, setService] = useState("");
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [appointment, setAppointment] = useState(null);

    // Generate token using Spring Boot API
    async function generateToken() {
        if (!service) {
            alert("Please select a service first.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8081/api/tokens",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ service }),
                }
            );

            if (!response.ok) {
                throw new Error("Token generation failed");
            }


            const data = await response.json();

            const queueResponse = await fetch(
                `http://localhost:8081/api/tokens/${data.id}/queue-status`
            );

            if (!queueResponse.ok) {
                throw new Error("Unable to fetch queue status");
            }

            const queueData = await queueResponse.json();

            setToken({
                number: `A-${data.id}`,
                service: data.service,
                peopleAhead: queueData.peopleAhead,
                waitingTime: "Not available yet",
            });


            alert("Token generated successfully!");

        } catch (error) {
            console.error("Error generating token:", error);
            alert(
                "Unable to generate token. Please check backend connection."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!token) return;

        const tokenId = token.number.replace("A-", "");

        const interval = setInterval(async () => {
            try {
                const response = await fetch(
                    `http://localhost:8081/api/tokens/${tokenId}/queue-status`
                );

                if (!response.ok) return;

                const data = await response.json();

                setToken((previousToken) => {
                    if (!previousToken) return previousToken;

                    return {
                        ...previousToken,
                        peopleAhead: data.peopleAhead,
                        status: data.status,
                    };
                });
            } catch (error) {
                console.error("Queue status update failed:", error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [token?.number]);


    // Appointment booking (frontend only for now)

    async function bookAppointment() {
        if (!service || !appointmentDate || !appointmentTime) {
            alert("Please select a service, date, and time.");
            return;
        }

        const timeSlots = {
            "09:00 AM": "09:00",
            "10:00 AM": "10:00",
            "11:00 AM": "11:00",
            "12:00 PM": "12:00",
            "02:00 PM": "14:00",
            "03:00 PM": "15:00",
        };

        try {
            const response = await fetch(
                "http://localhost:8081/api/appointments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        service: service,
                        appointmentDate: appointmentDate,
                        appointmentTime: timeSlots[appointmentTime],
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Appointment booking failed");
            }

            const data = await response.json();

            setAppointment({
                id: data.id,
                service: data.service,
                date: data.appointmentDate,
                time: appointmentTime,
            });

            alert("Appointment booked successfully!");
        } catch (error) {
            console.error(error);
            alert("Unable to book appointment. Check backend connection.");
        }
    }


    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>🎟️ QueueLess</h1>
                <a href="/">Back to Home</a>
            </header>

            <main className="dashboard-main">
                <h2>Student Dashboard</h2>
                <p>Manage your college office visits in one place.</p>

                <div className="dashboard-grid">

                    {/* Generate Virtual Token */}
                    <section className="dashboard-card">
                        <h3>🎫 Generate Virtual Token</h3>
                        <p>Join the college office queue remotely.</p>

                        <label htmlFor="service">
                            Select Service
                        </label>

                        <select
                            id="service"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                        >
                            <option value="">
                                Choose a service
                            </option>

                            {services.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={generateToken}
                            disabled={loading}
                        >
                            {loading
                                ? "Generating..."
                                : "Generate Token"}
                        </button>

                        {token && (
                            <div className="dashboard-result">
                                <h4>Token Generated!</h4>
                                <h2>{token.number}</h2>
                                <p>{token.service}</p>
                                <p>
                                    People Ahead: {token.peopleAhead}
                                </p>
                                <p>
                                    Estimated Wait: {token.waitingTime}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Book Advance Appointment */}
                    <section className="dashboard-card">
                        <h3>📅 Book Advance Appointment</h3>
                        <p>Schedule your college office visit.</p>

                        <label htmlFor="appointment-date">
                            Appointment Date
                        </label>

                        <input
                            id="appointment-date"
                            type="date"
                            min={new Date().toLocaleDateString("en-CA")}
                            value={appointmentDate}
                            onChange={(e) =>
                                setAppointmentDate(e.target.value)
                            }
                        />

                        <label htmlFor="appointment-time">
                            Appointment Time
                        </label>

                        <select
                            id="appointment-time"
                            value={appointmentTime}
                            onChange={(e) =>
                                setAppointmentTime(e.target.value)
                            }
                        >
                            <option value="">
                                Choose a time
                            </option>
                            <option>09:00 AM</option>
                            <option>10:00 AM</option>
                            <option>11:00 AM</option>
                            <option>12:00 PM</option>
                            <option>02:00 PM</option>
                            <option>03:00 PM</option>
                        </select>

                        <button onClick={bookAppointment}>
                            Book Appointment
                        </button>

                        {appointment && (
                            <div className="dashboard-result">
                                <h4>Appointment Booked!</h4>
                                <p>
                                    Service: {appointment.service}
                                </p>
                                <p>
                                    Date: {appointment.date}
                                </p>
                                <p>
                                    Time: {appointment.time}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Live Queue Status */}
                    <section className="dashboard-card">
                        <h3>📊 Live Queue Status</h3>
                        <p>Track your current queue position.</p>

                        {token ? (
                            <div className="queue-information">
                                <h2>{token.number}</h2>
                                <p>
                                    People Ahead: {token.peopleAhead}
                                </p>
                                <p>
                                    Estimated Wait: {token.waitingTime}
                                </p>
                                <span className="queue-active">
                                    ● Active
                                </span>
                            </div>
                        ) : (
                            <p>
                                No active token. Generate one
                                to get started.
                            </p>
                        )}
                    </section>

                </div>
            </main>
        </div>
    );
}
