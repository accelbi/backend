import bcrypt from "bcrypt";

const secret = "a";
const salt = bcrypt.genSaltSync(10, secret);

const password = "Accelbi@2022";
const hash = bcrypt.hashSync(password, salt);
// console.log(hash);


// const salt = bcrypt.genSaltSync(1000, "aasdcscsfdszcs");
// const password = "Accelbi@2022";

const result = bcrypt.compareSync(password, hash)
// console.log(result);