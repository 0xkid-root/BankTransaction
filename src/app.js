const express = require("express");
const app = express();
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");



/**  express ke jo server hai by default body ke data ko read  nhi kar pta hai 
 then hum user karte hai  express.json()

*/
app.use(express.json());    
app.use(cookieParser());


app.use("/api/v1/auth", authRouter);






module.exports = app;