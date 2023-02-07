const mongoose = require("mongoose");



const connDataBase = () => {


    mongoose.connect( process.env.DB_URL , {
         useNewUrlParser : true ,
         useUnifiedTopology : true,
        //  useCreteIndex : true
    }).then( (data) => console.log(`Connection With Data Base is Successfull with data  is ${data.connection.host}`));


}


module.exports = connDataBase;
