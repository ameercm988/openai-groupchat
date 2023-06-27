const db = require('./connection');
const {Configuration, OpenAIApi} = require('openai');

// configuring openai with api key
const config = new Configuration({
    apiKey : process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config);

const getChatHistory = (req, res) => {

    const { room_id } = req.body;

    db.query(`select * from chat_master where room_id = ${room_id} order by id DESC limit 20`,
        function (error, data, fields) {
            if (error) {
                console.log('error', error)
            } else {
                if (data.length != 0 ) {
                    return res.status(200).send({
                        success: true,
                        msg: "Chat List",
                        data: data
                    })
                }
            }
        })
}

const getChatBot = async (req, res) => {

    const { message, bot_name, preference, trait} = req.body;
    console.log('req.body', req.body)

    try {
        const response = await openai.createChatCompletion({
            model : "gpt-3.5-turbo",
            messages : [
                {
                    role : "system",
                    content : `you're a helpful assistant named ${bot_name} that specializes in ${preference} related questions`
                },
                {
                    role : "user",
                    content : message
                },
                {
                    role : "assistant",
                    content : `Only answer to ${preference} related question and always be ${trait}`
                }
            ],
            temperature : 0.8
        })
    
        console.log('response', response.data.choices);
        
        res.status(200).send({
            success : true,
            message : "AI Response",
            data : response.data.choices[0].message.content
        })
    } catch (error) {
        console.log('error', error)
        res.status(200).send({
            success : false,
            message : error.message || "something went wrong"
        })
    }

}

// const prateekFunda = 00;

module.exports = { getChatHistory, getChatBot };