const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
//const {setupWebSocket} = require("./utils/websocket");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { Server } = require("ws");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Import Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Initialize WebSocket server
//setupWebSocket(Server);
