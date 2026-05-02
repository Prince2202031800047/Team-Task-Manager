import { useEffect, useState } from "react";
import API from "../api/api";

export default function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    API.get("/api/dashboard").then(res => setData(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      <p>Total: {data.totalTasks}</p>
      <p>Done: {data.completed}</p>
      <p>In Progress: {data.inProgress}</p>
      <p>To Do: {data.todo}</p>
      <p>Overdue: {data.overdue}</p>
    </div>
  );
}