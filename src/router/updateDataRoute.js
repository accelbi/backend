import express from 'express';
import { employee,manager,editBySuper,addBySuper,sendToMan,deleteBySuper,employeeUpdateData,applyLeave,employeeUpdateWork,employeeUpdateNewWork,cancelAppliedLeave,unSubmit,approve,reject,addManToManBySuper } from '../controller/updateDataController.js'
const updateDataRouter = express.Router();


updateDataRouter.post('/employee/:id', employee)
updateDataRouter.post('/employee/data/row/:code/:weekToBeDisplayed/update', employeeUpdateData)

updateDataRouter.post('/employee/work/:code/:weekToBeDisplayed', employeeUpdateWork)
updateDataRouter.post('/employee/newWork/:code/:weekToBeDisplayed', employeeUpdateNewWork)

updateDataRouter.post('/employee/applyLeave/:code/:weekToBeDisplayed', applyLeave)
updateDataRouter.post('/employee/cancelAppliedLeave/:code/:weekToBeDisplayed', cancelAppliedLeave)

updateDataRouter.post('/manager/:id', manager)
updateDataRouter.post('/edit/:code/:position', editBySuper)
updateDataRouter.post('/delete/:code/:position', deleteBySuper)
updateDataRouter.post('/add/:position', addBySuper)
updateDataRouter.post('/addManToManBySuper/:code', addManToManBySuper)
updateDataRouter.post('/sendToMan/:empCode/:manCode/:MonDate/:date/:name', sendToMan)
updateDataRouter.post('/unSubmit/:empCode/:manCode/:MonDate/:date', unSubmit)

updateDataRouter.post('/manager/approve/:empCode/:manCode/:MonDate/:date', approve)
updateDataRouter.post('/manager/reject/:empCode/:manCode/:MonDate/:date', reject)

export default updateDataRouter;