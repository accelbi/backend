import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import authRoute from "./router/authRoute.js";
import fetchDataRoute from "./router/fetchDataRoute.js";
import updateDataRoute from "./router/updateDataRoute.js";
import userDataRoute from "./router/userDataRoute.js";
import { readFileSync } from 'fs';

const credentials = JSON.parse(readFileSync('./credentials.json', 'utf8'));

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

app.post("/api/delete", async (req, res) => {
  try {
    const userRecord = await admin.auth().getUserByEmail(req.body.email);
    await admin.auth().deleteUser(userRecord.uid);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(200).json({ success: false });
  }
});

app.post("/api/create", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    res.status(201).json({ success: true, uid: userRecord.uid });
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
