const dotenv = require('dotenv');
process.on('uncaughtException', err => {
    console.log('UNHANDIER REJECTION! (: Shutting down');
    console.log(err.name , err.message);
    process.exit(1);
});
dotenv.config({
    path: 'config.env'
});
const app = require('./app.js');
const mongoose = require('mongoose');


// Secure way
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('DB connection successful');
});




const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});


// process.on('unhandledRejection', err => {
//     console.log(err.name, err.message);
//     console.log('UNHANDIER REJECTION! (: Shutting down');
//     server.close(()  => {
//         process.exit(1);
//     });
// });


process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    // Perform any necessary cleanup and error handling
    // ...
    process.exit(1); // Terminate the process with a non-zero exit code
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Perform any necessary cleanup and error handling
    // ...
    process.exit(1); // Terminate the process with a non-zero exit code
});

process.on('SIGTERM' , () => {
   console.log('SIGTERM RECEIVED, SHUTTING DOWN');
   server.close(() =>{
       console.log('Process terminated successfully');
   });
});
