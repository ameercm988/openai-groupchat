const express = require('express');
const config = require('dotenv').config();
const cors = require('cors');
const chatSocket = require('./chat');

const app = express();

const cosrOptions = {
    origin : "*", 
    credentials : true, 
    optionSuccessStatus : 200
}

app.use(cors(cosrOptions));

const PORT = 3000 || process.env.PORT;

// const http = require('http').Server(app);

app.get('/',(req, res)=>{
    res.json("get request")
})

const server = app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`)
})

chatSocket(server);