// INSTALL PG
let pg = require('pg');

// GET URL AND PASSWORD FROM ELEPHANTSQL
let conString =
  'postgres://jpcvoxvs:EyR6lIZrq2zFwptFem1UT1HYo1tIxJV-@snuffleupagus.db.elephantsql.com/jpcvoxvs'; //Can be found in the Details page

// CREATE A VARIABLE FOR CONNECTING THE CLIENT FOR ELEPHANTSQL AND THIS BACKEND
let client = new pg.Client(conString);

// DB CONNECTION AND ERROR HANDLING 
client.connect((err) => {
  if (err) {
    return console.error('Could not connect to postgres', err);
  }
});

module.exports = client;
