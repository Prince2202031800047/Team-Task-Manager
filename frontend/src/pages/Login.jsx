import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
} from "@mui/material";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      // ✅ Token save
      localStorage.setItem("token", res.data.token);

      alert("Login successful 🚀");

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={10}
        sx={{
          p: 5,
          mt: 10,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Team Task Manager
        </Typography>

        <Typography variant="h6" color="gray" mb={2}>
          Login to your account
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, py: 1.5, fontSize: "16px" }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Paper>
    </Container>
  );
}