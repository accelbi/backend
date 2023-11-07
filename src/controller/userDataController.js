import { dbUser, dbSuper, databaseconnect } from "../config/databaseConfig.js";
export async function data(req, res) {
  const { email } = req.params;
  databaseconnect().then(async () => {
    const response = await dbUser.collection("data").findOne({ email });
    res.json(response);
  });
}
export async function all(req, res) {
  const { position } = req.params;
  databaseconnect().then(async () => {
    let response;

    if (position === "employee") {
      response = await dbSuper.collection("employee").find({}).toArray();
    } else if (position === "manager") {
      response = await dbSuper.collection("manager").find({}).toArray();
    }
    res.json(response);
  });
}
export async function codeSpecific(req, res) {
  const { position , code } = req.params;
  databaseconnect().then(async () => {
    let response;

    if (position === "employee") {
      response = await dbSuper.collection("employee").findOne({code:code});
    } else if (position === "manager") {
      response = await dbSuper.collection("manager").findOne({code:code});
    }

    const response2 = await dbUser.collection("data").findOne({ code: code.toString() });
    response && (response.manCode = response2 ? response2.manCode : "" );
    res.json(response);
  });
}
export async function savingEmployeeData(req, res) {
  const { email , manCode , name , code } = req.body;
  databaseconnect().then(async () => {
    
    const response = await dbSuper.collection("manager").findOne({ code : manCode.toString() });
    console.log(response);

    const data = {
      email: email,
      manCode : manCode,
      name : name,
      empCode : code,
      manPhone: response.phone,
      manName: response.name,
      position: "employee",
      manEmail: response.email,
    };
    console.log("savingEmployeeData",data);
    await dbUser.collection("data").insertOne(data);
    
    await dbSuper.collection("employee").updateOne({code:code},{$set:{name:name}});
    
    res.sendStatus(200);
  });
}
export async function addNameToSuper(req, res) {
  const { name, code } = req.body;
  databaseconnect().then(async () => {
    const response = await dbSuper.collection("employee").findOne({ code: code.toString() });

    if (response) {
      response.name = name;

      await dbSuper.collection("employee").replaceOne({ code: code.toString() }, response);
      res.sendStatus(200);
    } else {
      res.status(404).send("Employee not found");
    }
  });
}

export async function checkWhetherExist(req, res) {
  const { email , manCode , name , code } = req.body;
  databaseconnect().then(async () => {
    const data = {
      manCode,
      email,
      code,
      position: "employee",
    };
    const response = await dbUser.collection("data").findOne(data);
    console.log("checkWhetherExist",response)
    if (response){
      res.json(true);
    } else {
      res.json(false);
    }
  });
}

export async function editToUserData(req, res) {
  const { codeIn } = req.params;
  const { data2  } = req.body;
  databaseconnect().then(async () => {
    const response = await dbUser.collection("data").findOne({ code: codeIn.toString() });
    const response1 = await dbUser.collection("data").findOne({ empCode: codeIn.toString() });
    if (response) {

      await dbUser.collection("data").updateOne({ code: codeIn.toString() }, {
        $set: {
          name: data2.name,
          phone: data2.phone,
        },
      });

      await dbUser.collection("data").updateMany({ manCode: codeIn.toString() }, {
        $set: {
          manName: data2.name,
          manPhone: data2.phone,
        },
      });

      res.sendStatus(200);
    } else if (response1) {

      await dbUser.collection("data").updateOne({ empCode: codeIn.toString() }, {
        $set: {
          name: data2.name,
          phone: data2.phone,
        },
      });
      

      res.sendStatus(200);
    }
  });
}
