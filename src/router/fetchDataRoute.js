import express from 'express';
import { employee,manReview,manDisplayReview,superVerification,employeeData,employeeRowData } from '../controller/fetchDataController.js'
const fetchDataRouter = express.Router();

fetchDataRouter.get('/employee/:id', employee)
fetchDataRouter.get('/employee/data/:code/:weekToBeDisplayed', employeeData)
fetchDataRouter.get('/employee/data/row/:code/:weekToBeDisplayed', employeeRowData)
fetchDataRouter.get('/manReview/:code/:MonDate', manReview)
fetchDataRouter.get('/manDisplayReview/:code/:MonDate', manDisplayReview)
fetchDataRouter.get('/superVerification', superVerification)
fetchDataRouter.get('/superVerification', superVerification)



export default fetchDataRouter;