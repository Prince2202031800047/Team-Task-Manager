import { useEffect, useState } from "react";
import API from "../api/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const res = await API.get("/api/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    if (!title) return alert("Enter task title");

    await API.post("/api/tasks", {
      title,
      project: null, // later connect project
    });

    setTitle("");
    fetchTasks();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/api/tasks/${id}`, { status });
    fetchTasks();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tasks</h2>

      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={createTask}>Create</button>

      <ul>
        {tasks.map((t) => (
          <li key={t._id}>
            {t.title} - {t.status}

            <button onClick={() => updateStatus(t._id, "To Do")}>
              To Do
            </button>

            <button onClick={() => updateStatus(t._id, "In Progress")}>
              In Progress
            </button>

            <button onClick={() => updateStatus(t._id, "Done")}>
              Done
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}