const express = require('express');
const config = require('dotenv').config();
const cors = require('cors');
const chatSocket = require('./server/chat');
const bodyParser =require('body-parser');
const { getChatHistory, getChatBot, getTextToSpeech } = require('./server/api');


const app = express();

const cosrOptions = {
    origin : "*", 
    credentials : true, 
    optionSuccessStatus : 200
}

app.use(cors(cosrOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const PORT = 8080 || process.env.PORT;

// const http = require('http').Server(app);

app.get('/',(req, res)=>{
    res.status(200).send({
        message : `<< group chat ai >>`
    })
    // res.json("get request")
})

app.post('/chatHistory', getChatHistory)
app.post('/chatBot', getChatBot)
app.post('/textToSpeech', getTextToSpeech)


const server = app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`)

})
chatSocket(server);


