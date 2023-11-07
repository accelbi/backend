import express from "express";
import cors from "cors";
import fs from "fs";
import admin from "firebase-admin";
import authRoute from "./router/authRoute.js";
import fetchDataRoute from "./router/fetchDataRoute.js";
import updateDataRoute from "./router/updateDataRoute.js";
import userDataRoute from "./router/userDataRoute.js";

const credentials = JSON.parse(fs.readFileSync("./src/credentials.json"));
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());
app.use(cors());

app.use(async (req, res, next) => {
  const { authtoken } = req.headers;

  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
      return res.sendStatus(400);
    }
  }
  req.user = req.user || {};
  next();
});



//Controllers
app.use("/api/auth", authRoute);
app.use("/api/fetch", fetchDataRoute);
app.use("/api/update", updateDataRoute);
app.use("/api/user", userDataRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
