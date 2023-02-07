const app = require("./app.js");

const dotenv = require("dotenv");

const connDataBase  = require("./DataBase/connDataBase");

// Handling Uncaught Exception -- Error(console.log(undefined Variable))

process.on("uncaughtException" , (err) => {

    console.log(`Error :  ${err.message}`);
    console.log(`Shutting Down the Server due to uncaughtException`)
    process.exit(1);

})


// Config
dotenv.config({ path:"backend/config/config.env"});

// Connection with MongoDb
connDataBase();

const server =  app.listen(  process.env.PORT ,() => {
    console.log(`server is working on app listening on port ${ process.env.PORT }!`)
});








/* Unhandeled Promise Rejection  --Error of MongoDb OR Sting Error*/
process.on("unhandledRejection", (err) => {
    console.log(`Error :  ${err.message}`);
    console.log(`Shutting Down the Server due to Unhandeled Promise Rejection`)
    server.close( () => {
        process.exit(1);
    })
})