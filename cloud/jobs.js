// Parse.Cloud.job("checkWhatsAppServers2", async (request) => {
//   let date = new Date();
//   let timeNow = date.getTime();
//   let intervalOfTime = 3 * 60 * 1000;  // the time set is 3 minutes in milliseconds
//   let timeThen = timeNow - intervalOfTime;

//   // Limit date
//   let queryDate = new Date();
//   queryDate.setTime(timeThen);

//   // The query object
//   let querySession = new Parse.Query(Parse.Session);

//   querySession.lessThanOrEqualTo("expiresAt", date);

//   const results = await querySession.find({ useMasterKey: true });

//   results.forEach(object => {
//     object.destroy({ useMasterKey: true }).then(destroyed => {
//       console.log("Successfully destroyed object" + JSON.stringify(destroyed));
//     }).catch(error => {
//       console.log("Error: " + error.code + " - " + error.message);
//     })
//   });

//   return ("Successfully retrieved " + results.length + " invalid logins.");
// });