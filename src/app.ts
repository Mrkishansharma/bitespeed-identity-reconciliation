require("dotenv").config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import identityRoutes from "./routes/identityRoutes";
import sequelize from "./database";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Define your API routes
app.use("/api/identity", identityRoutes);

// Start the server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
