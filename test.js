// import bcrypt from "bcrypt";

// const secret = "a";
// const salt = bcrypt.genSaltSync(10, secret);

// const password = "Accelbi@2022";
// const hash = bcrypt.hashSync(password, salt);
// // console.log(hash);


// // const salt = bcrypt.genSaltSync(1000, "aasdcscsfdszcs");
// // const password = "Accelbi@2022";

// const result = bcrypt.compareSync(password, hash)
// // console.log(result);

import moment from 'moment-timezone';

function getDatesInWeek(startingDateStr) {
  const timeZone = moment.tz.guess(); ;
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const startDate = moment.tz(startingDateStr, timeZone);
  
  const datesInWeek = [];

  for (let i = 0; i < 7; i++) {
    const date = startDate.clone().add(i, 'days');
    const day = daysOfWeek[i];

    const formattedDate = date.format('YYYY-MM-DD');
    const monthAndYear = date.format('MMM D');

    datesInWeek.push({ day, monthAndYear, date: formattedDate });
  }

  return datesInWeek;
}

// Example usage:
const datesInWeekIndia = getDatesInWeek('2024-02-01', 'Asia/Kolkata');
const datesInWeekUS = getDatesInWeek('2024-02-01', 'America/New_York');

// console.log('Dates in India:', datesInWeekIndia);
// console.log('Dates in US:', datesInWeekUS);


function getUserTimeZoneMoment() {
  const userTimeZone = moment.tz.guess();
  return userTimeZone;
}

// Example usage:
const userTimeZoneMoment = getUserTimeZoneMoment();
console.log(moment.tz.guess());