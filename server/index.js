
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const {checkFirebaseConnection} = require("./config/firebase");

const architectRoutes = require("./routes/architectRoutes");
const leadRoutes = require("./routes/leadRoutes");
const designRoutes = require("./routes/designRoutes");
const activityLogRoutes = require("./routes/activitylogRoute");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoute");

const app = express();
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({extended: true})); // Parses URL-encoded requests (optional)

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    // origin: ["http://localhost:3000", "http://your-production-domain.com"] ----- enable during production
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/architect", architectRoutes);
app.use("/leads", leadRoutes);
app.use("/designs", designRoutes);
app.use("/activityLog", activityLogRoutes);
app.use("/user", userRoutes);
app.use("/customer", customerRoutes);
app.use("/images", require("./routes/imgRoute"));
app.use("/workProgress", require("./routes/workProgressRoute"));

const port = process.env.PORT || 5000;

checkFirebaseConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error initializing the app:", error.message);
  });
