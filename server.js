const express = require('express');
const connectDB = require('./config/db')
var cors = require('cors');
const app = express();

// for connecting to db
connectDB();
app.use(cors());
// INIT MIDDLEWARE
app.use(express.json({ extended:false }))

// for apis
// app.get makes a request to '/' 
// '/' is the base api
app.get('/',(req,res,next)=> {
  res.send('API RUNNING')
  next();
})

// ------------NEXT()----------------
// ORDER MATTERS IN EXPRESS, NORMALLY IT WOULD DO THIS GET AND NOT REQUESTS EXECUTE ANYTHING AFTER IT,
// USING next() WE ARE TELLING IT TO GO AND EXECUTE THE FOLLOWING THINGS AS WELL

// mock request test req=r equest, res = response (.send sends data to the browser)



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




// Define Routes
app.use('/api/users' ,require('./routes/api/users'))
app.use('/api/auth' ,require('./routes/api/auth'))
app.use('/api/posts' ,require('./routes/api/posts'))
app.use('/api/profile' ,require('./routes/api/profile'))


// ----WHAT IS APP.USE------

// app.use() executes whenever a request is made
// for app.use('./something') it executes whenever a request is made to ./something
// ----------------------------
// this makes api/users pertain to '/' as for the routes we have used '/'.
// so instead of doing /routes/api/users/something we can do /api/(users/profile...)
// for each request app.use gets for its specified link, it will run whatever is there in its second parameter require()



const PORT = process.env.PORT ||5000;
// for deploying website we use process.env.port 5000 is what we use locally
// env is enviroment variable



app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))

// app.listen will connect to the port the callback function is called if the connection is successful