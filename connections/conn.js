const mongoose =require('mongoose');

mongoose.set('strictQuery', false);
const dbconnect = async ()=>{
    mongoose.connect(process.env.DB_URI,{ useNewUrlParser: true });
    mongoose.connection.on('connected',()=> console.log("Database Connected!!!"));
    mongoose.connection.on('error',(e)=>console.log(e));
    mongoose.connection.on('disconnected',()=>console.log("------------Database Disconnected---------"))
}

module.exports= dbconnect;
