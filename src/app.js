const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.route");



/**  express ke jo server hai by default body ke data ko read  nhi kar pta hai 
 then hum user karte hai  express.json()

*/
app.use(express.json());    
app.use(cookieParser());


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/account", accountRouter);







module.exports = app;