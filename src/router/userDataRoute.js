import express from 'express';
import { data , all , codeSpecific , savingEmployeeData , checkWhetherExist, addNameToSuper , editToUserData } from '../controller/userDataController.js'
const userDataRouter = express.Router();

userDataRouter.get('/data/:email', data)
userDataRouter.get('/all/:position', all)
userDataRouter.get('/codeSpecific/:position/:code', codeSpecific)
userDataRouter.post('/savingEmployeeData', savingEmployeeData)
userDataRouter.post('/checkWhetherExist', checkWhetherExist)
userDataRouter.post('/addNameToSuper', addNameToSuper)
userDataRouter.post('/edit/:codeIn', editToUserData)

export default userDataRouter;