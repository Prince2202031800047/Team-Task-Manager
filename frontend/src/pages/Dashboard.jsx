import { useEffect, useState } from "react";
import API from "../api/api";
import { Grid, Paper, Typography } from "@mui/material";

export default function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    API.get("/api/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">Dashboard</Typography>

      <Grid container spacing={3} style={{ marginTop: 20 }}>
        <Grid item xs={4}>
          <Paper style={{ padding: 20 }}>
            Total Tasks: {data.totalTasks}
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper style={{ padding: 20 }}>
            Completed: {data.completed}
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper style={{ padding: 20 }}>
            Overdue: {data.overdue}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}