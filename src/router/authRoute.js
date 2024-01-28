import express from "express";
import {toMan , toEmp} from "../controller/authController.js"
const authRouter = express.Router();

authRouter.post("/toMan", toMan) // https://accelbi-backend.onrender.com/api/auth/toMan
authRouter.post("/toEmp", toEmp) // https://accelbi-backend.onrender.com/api/auth/toEmp

export default authRouter;