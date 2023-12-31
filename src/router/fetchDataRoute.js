import express from "express";
import { employee,manReview,manDisplayReview,superVerification,employeeData,employeeRowData,getGeneralData,getSpecificData,checkSupPass,lastWeek } from "../controller/fetchDataController.js"
const fetchDataRouter = express.Router();

fetchDataRouter.get("/checkSupPass/:pass/:email", checkSupPass)
fetchDataRouter.get("/employee/:id", employee)
fetchDataRouter.get("/employee/data/:code/:weekToBeDisplayed", employeeData)
fetchDataRouter.get("/employee/data/row/:code/:weekToBeDisplayed", employeeRowData)
fetchDataRouter.get("/manReview/:code/:MonDate", manReview)
fetchDataRouter.get("/manDisplayReview/:code/:MonDate", manDisplayReview)
fetchDataRouter.get("/superVerification", superVerification)
fetchDataRouter.post("/general/getData", getGeneralData)
fetchDataRouter.get("/general/getData/lastWeek", lastWeek)
fetchDataRouter.post("/specific/getData", getSpecificData)



export default fetchDataRouter;