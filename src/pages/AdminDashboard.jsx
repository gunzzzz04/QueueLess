
import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const TOKEN_API = "http://localhost:8081/api/tokens";
const APPOINTMENT_API = "http://localhost:8081/api/appointments";

export default function AdminDashboard() {
    const [tokens, setTokens] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [appointmentError, setAppointmentError] = useState("");
    const [updatingAppointmentId, setUpdatingAppointmentId] = useState(null);

    // Fetch all tokens
    async function fetchTokens() {
        try {
            const response = await fetch(TOKEN_API);

            if (!response.ok) {
                throw new Error("Unable to load tokens");
            }

            const data = await response.json();
            setTokens(data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Unable to load student tokens.");
        } finally {
            setLoading(false);
        }
    }

    // Fetch all appointments
    async function fetchAppointments() {
        try {
            const response = await fetch(APPOINTMENT_API);

            if (!response.ok) {
                throw new Error("Unable to load appointments");
            }

            const data = await response.json();
            setAppointments(data);
            setAppointmentError("");
        } catch (err) {
            console.error(err);
            setAppointmentError("Unable to load appointments.");
        }
    }

    // Auto-refresh every 5 seconds
    useEffect(() => {
        fetchTokens();
        fetchAppointments();

        const interval = setInterval(() => {
            fetchTokens();
            fetchAppointments();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Update token status
    async function updateStatus(id, status) {
        try {
            const response = await fetch(
                `${TOKEN_API}/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            );

            if (!response.ok) {
                throw new Error("Unable to update token");
            }

            await fetchTokens();
        } catch (err) {
            console.error(err);
            alert("Failed to update token status.");
        }
    }

    // Confirm or cancel appointment
    async function updateAppointmentStatus(id, status) {
        setUpdatingAppointmentId(id);

        try {
            const response = await fetch(
                `${APPOINTMENT_API}/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            );

            if (!response.ok) {
                throw new Error("Unable to update appointment");
            }

            await fetchAppointments();

            alert(
                status === "CONFIRMED"
                    ? "Appointment confirmed successfully!"
                    : "Appointment cancelled successfully!"
            );
        } catch (err) {
            console.error(err);
            alert("Failed to update appointment status.");
        } finally {
            setUpdatingAppointmentId(null);
        }
    }

    // Token statistics
    const waiting = tokens.filter(
        (token) => token.status === "WAITING"
    ).length;

    const serving = tokens.filter(
        (token) => token.status === "SERVING"
    ).length;

    const completed = tokens.filter(
        (token) => token.status === "COMPLETED"
    ).length;

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>🎟️ QueueLess Admin</h1>
                <a href="/">Back to Home</a>
            </header>

            <main className="admin-main">
                <h2>Admin Queue Management</h2>
                <p>Manage student tokens and appointments.</p>

                {/* Queue Statistics */}
                <div className="admin-stats">
                    <div className="admin-stat-card">
                        <h3>Waiting</h3>
                        <h2>{waiting}</h2>
                    </div>

                    <div className="admin-stat-card">
                        <h3>Serving</h3>
                        <h2>{serving}</h2>
                    </div>

                    <div className="admin-stat-card">
                        <h3>Completed</h3>
                        <h2>{completed}</h2>
                    </div>
                </div>

                {/* Token Management */}
                <section className="admin-table-card">
                    <h3>Student Queue</h3>

                    {loading && <p>Loading tokens...</p>}
                    {error && <p>{error}</p>}

                    {!loading && !error && (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Token</th>
                                        <th>Service</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {tokens.map((token) => (
                                        <tr key={token.id}>
                                            <td>A-{token.id}</td>
                                            <td>{token.service}</td>
                                            <td>{token.status}</td>
                                            <td>
                                                {token.status === "WAITING" && (
                                                    <button
                                                        onClick={() =>
                                                            updateStatus(
                                                                token.id,
                                                                "SERVING"
                                                            )
                                                        }
                                                    >
                                                        Start Serving
                                                    </button>
                                                )}

                                                {token.status === "SERVING" && (
                                                    <button
                                                        onClick={() =>
                                                            updateStatus(
                                                                token.id,
                                                                "COMPLETED"
                                                            )
                                                        }
                                                    >
                                                        Mark Completed
                                                    </button>
                                                )}

                                                {token.status === "COMPLETED" && (
                                                    <span>Done ✓</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {tokens.length === 0 && (
                                        <tr>
                                            <td colSpan="4">
                                                No tokens available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Appointment Management */}
                <section
                    className="admin-table-card"
                    style={{ marginTop: "30px" }}
                >
                    <h3>📅 Booked Appointments</h3>
                    <p>View and manage student appointments.</p>

                    {appointmentError && (
                        <p>{appointmentError}</p>
                    )}

                    {!appointmentError && (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Appointment ID</th>
                                        <th>Service</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td>APT-{appointment.id}</td>
                                            <td>{appointment.service}</td>
                                            <td>{appointment.appointmentDate}</td>
                                            <td>{appointment.appointmentTime}</td>
                                            <td>{appointment.status}</td>

                                            <td>
                                                {appointment.status === "BOOKED" ? (
                                                    <>
                                                        <button
                                                            disabled={
                                                                updatingAppointmentId ===
                                                                appointment.id
                                                            }
                                                            onClick={() =>
                                                                updateAppointmentStatus(
                                                                    appointment.id,
                                                                    "CONFIRMED"
                                                                )
                                                            }
                                                        >
                                                            Confirm
                                                        </button>

                                                        <button
                                                            disabled={
                                                                updatingAppointmentId ===
                                                                appointment.id
                                                            }
                                                            onClick={() =>
                                                                updateAppointmentStatus(
                                                                    appointment.id,
                                                                    "CANCELLED"
                                                                )
                                                            }
                                                            style={{
                                                                marginLeft: "8px",
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span>
                                                        {appointment.status === "CONFIRMED"
                                                            ? "Confirmed ✓"
                                                            : appointment.status === "CANCELLED"
                                                                ? "Cancelled"
                                                                : appointment.status}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {appointments.length === 0 && (
                                        <tr>
                                            <td colSpan="6">
                                                No appointments available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
