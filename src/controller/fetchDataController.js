import e from "express";
import {dbEmp , dbUser ,dbMan, databaseconnect, dbSuper} from "../config/databaseConfig.js";
export async function employee(req,res){
    const { id } = req.params;
    const {date} = req ;
    databaseconnect().then(async() => {
        const response = await dbEmp.collection("data").findOne({ empCode : id , MonDate:date});
        console.log(date);
        console.log(id);
    res.json(response);
    }).catch(console.error);
    
}

function getThisWeekDatesArray(mondayDate) {
    const datesArray = [];
    const startDate = new Date(mondayDate);
  
    // Loop through the days of the week (0 = Monday, 6 = Sunday)
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      datesArray.push(formattedDate);
    }
  
    return datesArray;
  }

export async function manReview(req,res){
    const { code , MonDate} = req.params;
    const arr  = getThisWeekDatesArray(MonDate);
    console.log(arr);
    let response2 = [];
    databaseconnect().then(async() => {
        const responses = await Promise.all(
            arr.map(async (day) => {
              const response = await dbMan.collection("empTSreq").find({
                manCode: code,
                subDate: day,
              }).toArray();
              response2.push(...response);
            })
          );
        res.json(response2);
    }).catch(console.error);
    
}
export async function manDisplayReview(req,res){
    const { code , MonDate } = req.params;
    databaseconnect().then(async() => {
        const response = await dbEmp.collection("work").findOne({
            empCode: code,
            MonDate: MonDate,
          })
        const response1 = await dbEmp.collection("data").findOne({
            empCode: code,
            MonDate: MonDate,
          })
        console.log(code)
        console.log(MonDate , "MonDate")
        console.log(response1)
        console.log(response)
        const result = {
            code : code,
            subDate : response1.submittedDate,
            data: response.data,
            approval: response1.approved,
            approvalDate: response1.approvedDate,
            leave: response1.leave,
            MonDate: MonDate,
        }
        res.json(result);
    }).catch(console.error);
    
}

export async function superVerification(req,res){
    const { code , email , manCode } = req.query;
    console.log(req.query);
    console.log(code);
    console.log(email);
    console.log(manCode);
    databaseconnect().then(async() => {
        const response = await dbSuper.collection("employee").findOne({
            code,
            manCode,
            email,
          })
        if (response){
          console.log("true");
          res.json(true);
        } else {
          console.log("false");
          res.json(false);
        }
        
    }).catch(console.error);
    
}

export async function employeeData(req, res) {
  const { code } = req.params;
  const { weekToBeDisplayed } = req.params;

  databaseconnect()
    .then(async () => {
      let data = await dbEmp.collection("data").findOne({ empCode: code, MonDate: weekToBeDisplayed });
      res.json(data);
    })
    .catch(console.error);
}

export async function employeeRowData(req, res) {
  const { code , weekToBeDisplayed  } = req.params;

  databaseconnect()
    .then(async () => {
      let data = await dbEmp.collection("work").findOne({ empCode: code, MonDate: weekToBeDisplayed });
      res.json(data);
    })
    .catch(console.error);
}

