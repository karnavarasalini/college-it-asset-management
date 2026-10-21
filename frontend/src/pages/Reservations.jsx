
import React, { useState } from "react";

const sampleReservations = [
  {
    id: "RES-101",
    lab: "Computer Lab 1",
    purpose: "Programming Practice",
    date: "2026-10-22",
    start: "09:00",
    end: "10:00",
    status: "Confirmed",
  },
  {
    id: "RES-102",
    lab: "Computer Lab 2",
    purpose: "Project Work",
    date: "2026-10-22",
    start: "11:00",
    end: "12:00",
    status: "Confirmed",
  },
  {
    id: "RES-103",
    lab: "Electronics Lab",
    purpose: "Lab Session",
    date: "2026-10-23",
    start: "14:00",
    end: "15:00",
    status: "Pending",
  },
];

const labTimings = [
  { lab: "Computer Lab 1", hours: "09:00–17:00", slots: ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"] },
  { lab: "Computer Lab 2", hours: "09:00–17:00", slots: ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"] },
  { lab: "Electronics Lab", hours: "10:00–16:00", slots: ["10:00", "11:00", "12:00", "14:00", "15:00"] },
];

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Reservations() {
  const [reservations, setReservations] = useState(() => {
    try {
      const saved = localStorage.getItem("college_it_reservations");
      return saved ? JSON.parse(saved) : sampleReservations;
    } catch {
      return sampleReservations;
    }
  });

  const [selectedDate, setSelectedDate] = useState("2026-10-22");
  const [lab, setLab] = useState("Computer Lab 1");
  const [purpose, setPurpose] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [message, setMessage] = useState("");

  const dayReservations = reservations.filter(
    (item) => item.date === selectedDate
  );

  const upcomingReservations = reservations
    .filter((item) => item.date >= new Date().toLocaleDateString("en-CA"))
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));

  function saveReservations(updated) {
    setReservations(updated);
    try {
      localStorage.setItem("college_it_reservations", JSON.stringify(updated));
    } catch {
      setMessage("Could not save changes in this browser.");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!purpose.trim()) {
      setMessage("Please enter the purpose of your reservation.");
      return;
    }

    if (start >= end) {
      setMessage("End time must be later than start time.");
      return;
    }

    const conflict = reservations.some(
      (item) =>
        item.lab === lab &&
        item.date === selectedDate &&
        start < item.end &&
        end > item.start
    );

    if (conflict) {
      setMessage("That lab already has a reservation during this time.");
      return;
    }

    const newReservation = {
      id: `RES-${Date.now().toString().slice(-6)}`,
      lab,
      purpose: purpose.trim(),
      date: selectedDate,
      start,
      end,
      status: "Pending",
    };

    saveReservations([...reservations, newReservation]);
    setPurpose("");
    setMessage("Reservation added successfully. Status: Pending.");
  }

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e1e8e1",
    borderRadius: 8,
    padding: 18,
    minWidth: 0,
  };

  const inputStyle = {
    width: "100%",
    padding: 10,
    border: "1px solid #cbd5cc",
    borderRadius: 5,
    font: "inherit",
    background: "#fff",
  };

  return (
    <main style={{ padding: "28px clamp(16px, 3vw, 40px)", color: "#25382c" }}>
      <div style={{ marginBottom: 22 }}>
        <p style={{ color: "#64806b", fontSize: 11, fontWeight: 700, letterSpacing: 1.3 }}>
          LAB SERVICES
        </p>
        <h1 style={{ margin: "8px 0", fontSize: 28, fontWeight: 600 }}>
          Reservations & Lab Availability
        </h1>
        <p style={{ color: "#68776c", fontSize: 13 }}>
          View reservations, check lab timings, and request a lab time slot.
        </p>
      </div>

      <div
        style={{
          padding: 12,
          marginBottom: 20,
          background: "#fff6df",
          borderLeft: "4px solid #c49a4b",
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        Demo mode: reservation information is sample data saved in this browser.
        Confirm actual lab timings and bookings with your college before relying on them.
      </div>

      <section style={{ ...cardStyle, marginBottom: 22 }}>
        <h2 style={{ fontSize: 17, marginTop: 0 }}>Reservation calendar / list</h2>
        <label htmlFor="reservation-date" style={{ display: "block", marginBottom: 7, fontSize: 13 }}>
          Select date
        </label>
        <input
          id="reservation-date"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          style={{ ...inputStyle, maxWidth: 280 }}
        />

        <div style={{ overflowX: "auto", marginTop: 18 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f3f7f3" }}>
                {["Reservation ID", "Lab", "Purpose", "Time", "Status"].map((heading) => (
                  <th key={heading} style={{ padding: 12, borderBottom: "1px solid #e1e8e1" }}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dayReservations.length ? (
                dayReservations.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: 12, borderBottom: "1px solid #edf0ed" }}>{item.id}</td>
                    <td style={{ padding: 12, borderBottom: "1px solid #edf0ed" }}>{item.lab}</td>
                    <td style={{ padding: 12, borderBottom: "1px solid #edf0ed" }}>{item.purpose}</td>
                    <td style={{ padding: 12, borderBottom: "1px solid #edf0ed" }}>{item.start}–{item.end}</td>
                    <td style={{ padding: 12, borderBottom: "1px solid #edf0ed" }}>{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: 18, color: "#758178", textAlign: "center" }}>
                    No reservations listed for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 20 }}>
        <section style={cardStyle}>
          <h2 style={{ fontSize: 17, marginTop: 0 }}>Upcoming reservations</h2>
          {upcomingReservations.length ? (
            upcomingReservations.map((item) => (
              <article key={item.id} style={{ padding: "12px 0", borderBottom: "1px solid #edf0ed" }}>
                <strong style={{ display: "block", fontSize: 13 }}>{item.lab}</strong>
                <p style={{ margin: "5px 0", fontSize: 12, color: "#68776c" }}>{item.purpose}</p>
                <span style={{ fontSize: 12 }}>{formatDate(item.date)} · {item.start}–{item.end}</span>
                <span style={{ display: "block", marginTop: 5, fontSize: 11, color: item.status === "Confirmed" ? "#286343" : "#936c20" }}>
                  {item.status}
                </span>
              </article>
            ))
          ) : (
            <p style={{ color: "#758178", fontSize: 13 }}>No upcoming reservations.</p>
          )}
        </section>

        <section style={cardStyle}>
          <h2 style={{ fontSize: 17, marginTop: 0 }}>Lab availability timings</h2>
          {labTimings.map((item) => {
            const booked = reservations.filter(
              (reservation) => reservation.lab === item.lab && reservation.date === selectedDate
            );
            return (
              <article key={item.lab} style={{ padding: "12px 0", borderBottom: "1px solid #edf0ed" }}>
                <strong style={{ fontSize: 13 }}>{item.lab}</strong>
                <p style={{ margin: "5px 0 8px", color: "#68776c", fontSize: 12 }}>
                  Operating hours: {item.hours}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {item.slots.map((slot) => {
                    const reservation = booked.find(
                      (entry) => slot >= entry.start && slot < entry.end
                    );
                    return (
                      <span
                        key={slot}
                        title={reservation ? `Booked: ${reservation.purpose}` : "No booking recorded at this start time"}
                        style={{
                          padding: "5px 7px",
                          borderRadius: 4,
                          fontSize: 11,
                          background: reservation ? "#f8e7e4" : "#e6f2e9",
                          color: reservation ? "#9a4037" : "#286343",
                        }}
                      >
                        {slot} {reservation ? "Booked" : "Listed"}
                      </span>
                    );
                  })}
                </div>
              </article>
            );
          })}
          <p style={{ color: "#758178", fontSize: 11 }}>
            Timings and slots are examples, not verified live availability.
          </p>
        </section>
      </div>

      <section style={{ ...cardStyle, marginTop: 22 }}>
        <h2 style={{ fontSize: 17, marginTop: 0 }}>Request a reservation</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))", gap: 14 }}>
          <label style={{ fontSize: 12 }}>
            Lab
            <select value={lab} onChange={(event) => setLab(event.target.value)} style={{ ...inputStyle, display: "block", marginTop: 6 }}>
              {labTimings.map((item) => <option key={item.lab} value={item.lab}>{item.lab}</option>)}
            </select>
          </label>

          <label style={{ fontSize: 12 }}>
            Date
            <input type="date" value={selectedDate} min="2026-10-21" onChange={(event) => setSelectedDate(event.target.value)} style={{ ...inputStyle, display: "block", marginTop: 6 }} required />
          </label>

          <label style={{ fontSize: 12 }}>
            Start time
            <input type="time" value={start} onChange={(event) => setStart(event.target.value)} style={{ ...inputStyle, display: "block", marginTop: 6 }} required />
          </label>

          <label style={{ fontSize: 12 }}>
            End time
            <input type="time" value={end} onChange={(event) => setEnd(event.target.value)} style={{ ...inputStyle, display: "block", marginTop: 6 }} required />
          </label>

          <label style={{ fontSize: 12, gridColumn: "1 / -1" }}>
            Purpose
            <input value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder="e.g. Project work" style={{ ...inputStyle, display: "block", marginTop: 6 }} required />
          </label>

          <button type="submit" style={{ padding: "11px 16px", border: 0, borderRadius: 5, background: "#24583b", color: "white", font: "inherit", cursor: "pointer" }}>
            Request reservation
          </button>
        </form>
        {message && <p role="status" style={{ marginBottom: 0, fontSize: 13 }}>{message}</p>}
      </section>
    </main>
  );
}

export default Reservations;
