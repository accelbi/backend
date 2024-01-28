import express from "express";
import {toMan , toEmp} from "../controller/authController.js"
const authRouter = express.Router();

authRouter.post("/toMan", toMan) // http://localhost:8000/api/auth/toMan
authRouter.post("/toEmp", toEmp) // http://localhost:8000/api/auth/toEmp

export default authRouter;