const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  if (req.session.auth) { // get the authorization object stored in the session
    token = req.session.auth['accessToken']; // retrieve the token from authorization object
    jwt.verify(token, "user_access", (err, user)=>{ // Use JWT to verify token
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).send(JSON.stringify({
          "message": "User not authenticated"
        }, null, 4));
      }
    });
  } else {
    return res.status(403).send(JSON.stringify({
      message: "User not logged in"
    }, null, 4));
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
