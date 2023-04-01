const express = require('express');
const config = require('dotenv').config();
const cors = require('cors');
const chatSocket = require('./server/chat');
const bodyParser =require('body-parser')


const app = express();

const cosrOptions = {
    origin : "*", 
    credentials : true, 
    optionSuccessStatus : 200
}

app.use(cors(cosrOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const PORT = 80 || process.env.PORT;

// const http = require('http').Server(app);

app.get('/',(req, res)=>{
    res.json("get request")
})


const server = app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`)

})
chatSocket(server);


