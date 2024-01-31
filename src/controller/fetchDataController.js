import e from "express";
import bcrypt from "bcrypt";
import {dbEmp , dbUser ,dbMan, databaseconnect, dbSuper} from "../config/databaseConfig.js";
export async function employee(req,res){
    const { id } = req.params;
    const {date} = req ;
    databaseconnect().then(async() => {
        const response = await dbEmp.collection("data").findOne({ empCode : id , MonDate:date});
        // console.log(date);
        // console.log(id);
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
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      datesArray.push(formattedDate);
    }
  
    return datesArray;
  }

export async function manReview(req,res){
    const { code , MonDate} = req.params;
    const arr  = getThisWeekDatesArray(MonDate);
    // console.log(arr);
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

export async function getGeneralData(req,res){
    const { dates , manCode} = req.body;
    // console.log(dates);
    let response2 = [];
    let response3 = [];
    databaseconnect().then(async() => {
        const responses = await Promise.all(
          dates.map(async (day) => {
              let temp2 = getThisWeekDatesArray(day)
              let res = []
              let response = await Promise.all(
                temp2.map(async (day) => {
                  const response = await dbMan.collection("empTSreq").find({
                    manCode: manCode,
                    subDate: day,
                  }
                  ).toArray();
                  res.push(...response);
                })

              );
              response = res ;
              response3.push(day);
              response = response.map((item) => {
                return {
                  "Name":item ? item.name : "",
                  "Emp_Id":item ? item.code : "",
                  "Type":item ? item.type : "",
                  "Total_Hours":item ? item.totalHours : "",
                  "Total_Projects":item ? item.projects : "",
                  "Total_Tasks":item ? item.tasks : "",
                  "Leaves_Availed":item ? item.leave : "",
                };
              })
              response2.push((response.length !== 0) ? response : [{
                "Name":"",
                "Emp_Id":"",
                "Type":"",
                "Total_Hours":"",
                "Total_Projects":"",
                "Total_Tasks":"",
                "Leaves_Availed":"",
              
              }]);
            })
          );
        res.json({data:response2 , dates:response3});
    }).catch(console.error);
}


export async function getSpecificData(req,res){
    const { dates , manCode , code} = req.body;
    // console.log(dates);
    // console.log(manCode);
    // console.log(code);
    let response2 = [];
    let response3 = [];
    databaseconnect().then(async() => {
        const responses = await Promise.all(
          dates.map(async (day) => {
              let temp2 = getThisWeekDatesArray(day)
              let res = []
              let response = await Promise.all(
                temp2.map(async (day) => {
                  const response = await dbMan.collection("empTSreq").find({
                    manCode: manCode,
                    subDate: day,
                    code : code,
                  }
                  ).toArray();
                  res.push(...response);
                })

              );
              response = res ;
              response3.push(day);
              response = response.map((item) => {
                return {
                  "Name":item ? item.name : "",
                  "Emp_Id":item ? item.code : "",
                  "Type":item ? item.type : "",
                  "Total_Hours":item ? item.totalHours : "",
                  "Total_Projects":item ? item.projects : "",
                  "Total_Tasks":item ? item.tasks : "",
                  "Leaves_Availed":item ? item.leave : "",
                };
              })
              response2.push((response.length !== 0) ? response : [{
                "Name":"",
                "Emp_Id":"",
                "Type":"",
                "Total_Hours":"",
                "Total_Projects":"",
                "Total_Tasks":"",
                "Leaves_Availed":"",
              
              }]);
            })
          );
        // console.log(response2);
        res.json({data:response2 , dates:response3});
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
        // console.log(code)
        // console.log(MonDate , "MonDate")
        // console.log(response1)
        // console.log(response)
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
    // console.log(req.query);
    // console.log( "code" , code);
    // console.log("email" , email);
    // console.log("manCode" , manCode);
    databaseconnect().then(async() => {
        const response = await dbSuper.collection("employee").findOne({
            code,
            manCode,
            email,
          })
        if (response){
          // console.log("true");
          res.json(true);
        } else {
          // console.log("false");
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

export async function checkSupPass(req, res) {
  const { pass , email } = req.params;
  databaseconnect().then(async () => {
    const response = await dbUser.collection("data").findOne({ position: "super", email: email });
    if (response){
      const match = await bcrypt.compare(pass, response.encrypted);
      res.status(200).json(match);
    } else {
      res.status(404).json("Not Found");
    }
  });
}
function getWeekDates(mondayDate) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const startDate = new Date(mondayDate);
  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    weekDates.push(formatDate(currentDate));
  }

  return weekDates;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function lastWeek(req, res) {
  const { manCode, date, type , code } = req.query;
  console.log(date);
  const weekDays = getWeekDates(date);
  console.log(weekDays);
  try {
    await databaseconnect();
    if (type === "General"){
    const cursor = dbMan.collection("empTSreq").find({ 
      manCode: manCode,
      subDate: { $in: weekDays }
    });
    const responseArray = await cursor.toArray();

    console.log(responseArray);

    if (responseArray.length > 0) {
      res.status(200).json({ found: true, data: responseArray });
    } else {
      res.status(200).json({ found: false, url: "" });
    }
    } else {
      const cursor = dbMan.collection("empTSreq").find({ 
        manCode: manCode,
        subDate: { $in: weekDays },
        code : req.query.code
      });
      const responseArray = await cursor.toArray();
  
      console.log(responseArray);
  
      if (responseArray.length > 0) {
        res.status(200).json({ found: true, data: responseArray });
      } else {
        res.status(200).json({ found: false, url: "" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

