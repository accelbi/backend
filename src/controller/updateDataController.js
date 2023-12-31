import {
  dbEmp,
  dbSuper,
  dbUser,
  dbMan,
  databaseconnect,
} from "../config/databaseConfig.js";

export async function employeeUpdateWork(req, res) {
  const { code, weekToBeDisplayed } = req.params;
  const { dataInside } = req.body;
  const newData = {};
  newData.MonDate = weekToBeDisplayed;
  newData.empCode = code;
  newData.data = dataInside;
  databaseconnect()
    .then(async () => {
      console.log(dataInside);
      console.log("dataInside");
      await dbEmp
        .collection("work")
        .replaceOne({ empCode: code, MonDate: weekToBeDisplayed }, newData);

      res.send("employeeUpdate");
    })
    .catch(console.error);
}
//addingNew
export async function employeeUpdateNewWork(req, res) {
  const { code, weekToBeDisplayed } = req.params;
  const { data } = req.body;
  
  databaseconnect()
    .then(async () => {
      const response = await dbEmp
        .collection("work")
        .findOne({ empCode: code, MonDate: weekToBeDisplayed });

      if (response) {
        if (response.data === null || response.data === undefined) { response.data = []; }
        response.data.push(data);
        console.log("pushing");
        await dbEmp
          .collection("work")
          .updateOne({ empCode: code, MonDate: weekToBeDisplayed }, {
            $push : { data : data }
          });
      } else {
        console.log("addingNew");
        console.log(data);
        await dbEmp.collection("data").insertOne({
          empCode: code,
          MonDate: weekToBeDisplayed,
          data: `https://accelbi-backend.onrender.com//api/fetch/employee/data/row/${code}/${weekToBeDisplayed}`,
          submitted: null,
          submittedDate: null,
          approved: null,
          approvedDate: null,
          reason: null,
          leave: [],
        });
        await dbEmp.collection("work").insertOne({
          empCode: code,
          MonDate: weekToBeDisplayed,
          data: [data],
        });
      }

      res.send("employeeUpdate");
    })
    .catch(console.error);
}

export async function employee(req, res) {
  const { id } = req.params;
  const { temp } = req.body;
  databaseconnect()
    .then(async () => {
      await dbEmp
        .collection("data")
        .updateOne({ empCode: id }, { $set: { empCode, ...temp } });
      res.send("employeeUpdate");
    })
    .catch(console.error);
}

export async function employeeUpdateData(req, res) {
  const { dataInside } = req.body;
  const { code, weekToBeDisplayed } = req.params;
  databaseconnect()
    .then(async () => {
      await dbEmp
        .collection("data")
        .replaceOne(
          { empCode: code, MonDate: weekToBeDisplayed },
          { ...dataInside }
        );

      res.send("Updated Emp Data");
    })
    .catch(console.error);
}

export async function manager(req, res) {
  res.send("managerUpdate");
}

export async function editBySuper(req, res) {
  const { code, position } = req.params;
  const { data2 } = req.body;
  databaseconnect()
    .then(async () => {
      await dbSuper
        .collection(`${position}`)
        .updateOne({ code: code }, { $set: {phone : data2.phone , email:data2.email , name:data2.name} });
      res.send("employeeUpdated");
    })
    .catch(console.error);
}

export async function deleteBySuper(req, res) {
  const { code, position } = req.params;

  databaseconnect()
    .then(async () => {
      await dbSuper.collection(`${position}`).deleteOne({ code: code });

      if (position === "employee") {
        await dbUser.collection("data").deleteOne({ empCode: code });
        await dbEmp.collection("data").deleteMany({ empCode: code });
      } else if (position === "manager") {
        await dbUser.collection("data").deleteOne({ code: code });
        await dbMan.collection("empTSreq").deleteMany({ code: code });
      }

      res.send("deleted");
    })
    .catch(console.error);
}

export async function addBySuper(req, res) {
  const { position } = req.params;
  const { data2 } = req.body;
  databaseconnect()
    .then(async () => {
      if (position === "employee") {
      const response = await dbSuper.collection("manager").findOne({ code: data2.manCode });
         if (response){
         await dbSuper.collection(`${position}`).insertOne(data2);
         } else {
            res.status(200).json({
              error : "Manager not found"
            })
         }
      } else if (position === "manager") {
      await dbSuper.collection(`${position}`).insertOne(data2);
      }

      res.status(200).json({succes:true , message:"Added"});
    })
    .catch(console.error);
}

export async function managerAccount(req, res) {
  const { data2 } = req.body;
  console.log(data2);
  databaseconnect()
    .then(async () => {
      data2.position = "manager";
      await dbUser.collection("data").insertOne(data2);
      res.send("managerAcountAdded");
    })
    .catch(console.error);
}

export async function applyLeave(req, res) {
  const { code, weekToBeDisplayed } = req.params;
  const { date, reason, type } = req.body;

  try {
    await databaseconnect();

    // Fetch the employee data once
    const response = await dbEmp
      .collection("data")
      .findOne({ empCode: code, MonDate: weekToBeDisplayed });

    if (!response.leave) {
      response.leave = [];
    }

    // Use Promise.all to wait for all async operations to complete
    await Promise.all(date.map(async (item) => {
      // Check if leave for the date already exists
      const leaveIndex = response.leave.findIndex((leave) => leave.date === item);

      if (leaveIndex === -1) {
        // Leave for the date doesn't exist, so add it
        response.leave.push({
          date: item,
          reason: reason,
          type: type,
        });
      } else {
        // Leave for the date exists, so update it
        response.leave[leaveIndex] = {
          date: item,
          reason: reason,
          type: type,
        };
      }

      // Update the database for each date
      await dbEmp
        .collection("data")
        .updateOne(
          { empCode: code, MonDate: weekToBeDisplayed },
          { $set: { leave: response.leave } }
        );
    }));

    res.send("Updated Emp Data");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}


export async function cancelAppliedLeave(req, res) {
  const { code, weekToBeDisplayed } = req.params;
  const { leave } = req.body;
  databaseconnect()
    .then(async () => {
      const response = await dbEmp
        .collection("data")
        .findOne({ empCode: code, MonDate: weekToBeDisplayed });

      response.leave = response.leave.filter(
        (item) => item.date !== leave.date
      );

      await dbEmp
        .collection("data")
        .updateOne(
          { empCode: code, MonDate: weekToBeDisplayed },
          { $set: { leave: response.leave } }
        );

      console.log(response);
    })
    .catch(console.error);
}



export async function sendToMan(req, res) {
  const { empCode, manCode, MonDate, date , name } = req.params;
  databaseconnect()
    .then(async () => {

      const check = await dbMan
                    .collection("empTSreq")
                    .findOne({ code: empCode, manCode: manCode, MonDate: MonDate });
      
      if (check){
        console.log("already sent");
        const response = await dbEmp
        .collection("data")
        .findOne({ empCode: empCode, MonDate: MonDate });


        const response0 = await dbEmp
        .collection("work")
        .findOne({ empCode: empCode, MonDate: MonDate });
        

        let leaves = 0 ;

        if (response.leave !== undefined || response.leave !== null){
          response.leave.map((a) => leaves++);
        }

        let arr = [];
        response0.data.map((item) => {
          arr.push(item && item.project);
        });
        const set = new Set(arr);
        const UniqueProject = set.size;
     
        arr = [];
        response0.data.map((item) => {
          arr.push(item && item.task);
        });
        const set1 = new Set(arr);
        const UniqueTask = set1.size;
     

        let total = 0;
        response0.data.map((item) => {
          total += item && item.hours.reduce((a, b) => a + b, 0);
        });
        const totalHours =  total;

       
          await dbMan
          .collection("empTSreq")
          .updateOne({ code: empCode, manCode: manCode, MonDate: MonDate } , { $set: { 
            status: "pending" , 
            leave: leaves  ,
            projects: UniqueProject,
            tasks: UniqueTask,
            totalHours: totalHours,
            subDate : date,
        } });
          await dbEmp
          .collection("data")
          .updateOne(
            { empCode: empCode, MonDate: MonDate },
            { $set: { approved: null, submitted:true  } }
          );
        

      } else {
        
        console.log("Sending New")
        const response = await dbEmp
        .collection("data")
        .findOne({ empCode: empCode, MonDate: MonDate });
      const response0 = await dbEmp
        .collection("work")
        .findOne({ empCode: empCode, MonDate: MonDate });
      response.submitted = true;
      response.submittedDate = date;

        let arr = [];
        response0.data.map((item) => {
          arr.push(item && item.project);
        });
        const set = new Set(arr);
        const UniqueProject = set.size;
     
        arr = [];
        response0.data.map((item) => {
          arr.push(item && item.task);
        });
        const set1 = new Set(arr);
        const UniqueTask = set1.size;
     

        let total = 0;
        response0.data.map((item) => {
          total += item && item.hours.reduce((a, b) => a + b, 0);
        });
        const totalHours =  total;
      

      let leaves = response.leave && response.leave.length ;
      

      await dbEmp
        .collection("data")
        .updateOne(
          { empCode: empCode, MonDate: MonDate },
          {
            $set: {
              submitted: response.submitted,
              submittedDate: response.submittedDate,
            },
          }
        );

      let response3 = await dbSuper
        .collection("employee")
        .findOne({ code: empCode });
      if (!response3) {
        response3 = await dbSuper
        .collection("manager")
        .findOne({ code: empCode });
      }

      const linkOfReview = `https://accelbi-backend.onrender.com//api/fetch/manDisplayReview/${empCode}/${MonDate}`;


      await dbMan
        .collection("empTSreq")
        .insertOne({
          name: name,
          code: empCode,
          manCode: manCode,
          MonDate: MonDate,
          type: response3.type,
          status: "pending",
          subDate: response.submittedDate,
          projects: UniqueProject,
          tasks: UniqueTask,
          leave: leaves,
          totalHours: totalHours,
          review: linkOfReview,
        });
      
      }
      res.status(200).json({
        success : true
      })
    })
    
    .catch(console.error)
      
    
}
export async function unSubmit(req, res) {
  const { empCode, manCode, date , MonDate} = req.params;
  databaseconnect()
    .then(async () => {
      await dbMan
        .collection("empTSreq")
        .deleteOne({ code: empCode, manCode: manCode, subDate: date , MonDate: MonDate });
      await dbEmp
        .collection("data")
        .updateOne(
          { empCode: empCode, MonDate: MonDate },
          { $set: { submitted: false, submittedDate: null } }
        );
    })
    .catch(console.error);
}
export async function approve(req, res) {
  const { empCode, manCode, MonDate, date} = req.params;
  databaseconnect()
    .then(async () => {
      await dbMan
        .collection("empTSreq")
        .updateOne({ code: empCode, manCode: manCode, MonDate: MonDate } , {
          $set: { status: "approved" },
        });
      await dbEmp
        .collection("data")
        .updateOne(
          { empCode: empCode, MonDate: MonDate },
          { $set: { approved: true, approvedDate: date } }
        );
    })
    .catch(console.error);
}
export async function reject(req, res) {
  const { empCode, manCode, MonDate , date } = req.params;
  const { reason } = req.body;
  console.log(reason);
  console.log(empCode);
  console.log(manCode);
  console.log(MonDate);
  databaseconnect()
  .then(async () => {
    await dbMan
        .collection("empTSreq")
        .updateOne({ code: empCode, manCode: manCode, MonDate: MonDate } , {
          $set: { status: "rejected" },
        });
      await dbEmp
      .collection("data")
        .updateOne(
          { empCode: empCode, MonDate: MonDate },
          { $set: { approved: false, approvedDate: date , reason: reason } }
          );
        })
    .catch(console.error);
}
export async function addManToManBySuper(req, res) {
  const { code } = req.params;
  const { manCode } = req.body;
  
  databaseconnect()
  .then(async () => {

    const response = await dbSuper
        .collection("manager")
        .findOne({ code: manCode });

      if (response){
        await dbSuper
        .collection("manager")
        .updateOne({ code: code } , {
          $set: { manCode: manCode },
        });

        await dbUser
        .collection("data")
        .updateOne({ code: code } , {
          $set: { 
            empCode: code , 
            manCode: manCode ,
            manPhone: response.phone,
            manName: response.name,
            manEmail: response.email,
          },
        });
        
        res.status(200).json({
          success : true
        })
      } else {
        res.status(200).json({
          success : false,
          error : "Manager not found"
        })
      }
      
    })
    .catch(console.error);
}

export async function changeImage(req, res) {
  const { code , position , image_b , image_m , image_s } = req.body;
  console.log(code , position , image_b , image_m , image_s);
  databaseconnect()
    .then(async () => {
      await dbUser
        .collection("data")
        .updateOne({ code: code, position:position } , {
          $set: { image_b: image_b ,
                  image_m: image_m ,
                  image_s: image_s ,
                },  
        });
      if (position === "employee"){
      await dbSuper
        .collection("employee")
        .updateOne(
          { code: code },
          { $set: { image_b: image_b ,
                    image_m: image_m ,
                    image_s: image_s ,
                  },   }
        );
      } else if (position === "manager"){
        await dbSuper
        .collection("manager")
        .updateOne(
          { code: code },
          { $set: { image_b: image_b ,
                    image_m: image_m ,
                    image_s: image_s ,
                  },   }
        );
      }
      res.status(200).json({
        success : true
      })
    })
    .catch(console.error);
}
