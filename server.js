const express = require("express");
require('dotenv').config();
const cors=require('cors');
const dbconnect=require('./connections/conn');
const bodyParser=require('body-parser');
const checkToken = require('./helper/verifytoken');


dbconnect();

const port = process.env.PORT || 3000;


const app = express();


const contactRoute=require('./routes/contactRoute')
const resisterAndLogin = require('./routes/ResisterAndLogin');
const contactDetails=require('./routes/contactDetailsRoute')

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }))


app.use(bodyParser.json())


app.use(resisterAndLogin);



app.use('/contacts',checkToken,contactRoute);



app.use('/contacts',checkToken,contactDetails);




app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
