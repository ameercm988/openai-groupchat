const db = require('./connection');
const axios = require('axios');
const fs = require('fs');


const { Configuration, OpenAIApi } = require('openai');

// configuring openai with api key
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config);

const getChatHistory = (req, res) => {

    const { room_id } = req.body;

    db.query(`select * from chat_master where room_id = ${room_id} order by id DESC limit 20`,
        function (error, data, fields) {
            if (error) {
                console.log('error', error)
            } else {
                if (data.length != 0) {
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

    const { message, bot_name, preference, trait } = req.body;
    console.log('req.body', req.body)

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `you're a helpful assistant named ${bot_name} that specializes in ${preference} related questions`
                },
                {
                    role: "user",
                    content: message
                },
                {
                    role: "assistant",
                    content: `Only answer to ${preference} related question and always be ${trait}`
                }
            ],
            temperature: 0.8
        })

        console.log('response', response.data.choices);

        res.status(200).send({
            success: true,
            message: "AI Response",
            data: response.data.choices[0].message.content
        })
    } catch (error) {
        console.log('error', error)
        res.status(200).send({
            success: false,
            message: error.message || "something went wrong"
        })
    }

}

// ultra realistic voices
const getTextToSpeech = async (req, res) => {

    try {
        const { text, voice } = req.body;
        console.log('req.body', req.body);

        const response = await axios.post(`${process.env.PLAYHT_BASEURL}`, {
            text,
            voice,
            quality: 'high',
            speed : 0.9,
            temperature : 0.5
        },
            {
                headers: {
                    accept: 'text/event-stream',
                    'content-type': 'application/json',
                    AUTHORIZATION: `Bearer ${process.env.PLAYHT_SECRET}`,
                    'X-USER-ID': process.env.PLAYHT_USER_ID
                },
            });

        console.log('response>>>>>>>>>', response.data);

        const events = response.data.split('\n');
        console.log('events', events);

        // const finishedEvent = events.find(ele => ele.includes('"stage":"complete"'))
        // console.log('finishedEvent', finishedEvent);

        // const finishedEventData = JSON.parse(finishedEvent);
        // console.log('finishedEventData', finishedEventData);


        let completedEventData = null;

        for (const line of events) {
            if (line.includes('data: ')) {
                const eventData = JSON.parse(line.split('data: ')[1]);
                if (eventData.stage === 'complete') {
                    completedEventData = eventData;
                    break;
                }
            }
        }

        console.log('completedEventData', completedEventData);

        if (completedEventData) {

            const downloadUrl = completedEventData.url;
            const outputFilePath = 'D:/BITROOT/AI-GROUP-CHAT/openai-groupchat/public/ultrarealistic/file.mp3';

            downloadAudioFile(downloadUrl, outputFilePath)
                .then(() => {
                    console.log('Audio file downloaded successfully.');

                    res.status(200).send({
                        success: true,
                        message: 'audio file created successfully',
                        data: downloadUrl
                    })

                })
                .catch((err) => {
                    console.error('Error while downloading audio file:', err);
                });

        }


        async function downloadAudioFile(url, outputFilePath) {
            try {
                const response = await axios({
                    method: 'GET',
                    url: url,
                    responseType: 'stream',
                });

                const writer = fs.createWriteStream(outputFilePath);
                response.data.pipe(writer);

                return new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });
            } catch (err) {
                console.error('Error while downloading audio file:', err);
            }
        }

    } catch (error) {
        console.log('error', error);

        res.status(200).send({
            success: false,
            message: error.message
        })
    }
}

//standard and premium voices
// const getTextToSpeech = async (req, res) => {

//     try {
//         const payload = req.body;
//         console.log('payload', payload);
//         const options = {
//             method: 'POST',
//             url: 'https://play.ht/api/v1/convert',
//             headers: {
//                 accept: 'application/json',
//                 'content-type': 'application/json',
//                 AUTHORIZATION: `Bearer ${process.env.PLAYHT_SECRET}`,
//                 'X-USER-ID': process.env.PLAYHT_USER_ID
//             },
//             data: payload 
//         };
//         console.log('options', options);
//         const response = await axios.request(options);
//         console.log('response', response.data);

//         if (response.data.transcriptionId) {
//             const options = {
//                 method: 'GET',
//                 url: `https://play.ht/api/v1/articleStatus?transcriptionId=${response.data.transcriptionId}`,
//                 headers: {
//                     accept: 'application/json',
//                     AUTHORIZATION: `Bearer ${process.env.PLAYHT_SECRET}`,
//                     'X-USER-ID': process.env.PLAYHT_USER_ID
//                 }
//             };

//             const responseFile = await axios.request(options);
//             console.log('audio response', responseFile.data);

//             if (responseFile.data) {

//                 const downloadUrl = responseFile.data.audioUrl;
//                 const outputFilePath = 'D:/BITROOT/AI-GROUP-CHAT/openai-groupchat/public/standardNpremium/file.mp3';

//                 downloadAudioFile(downloadUrl, outputFilePath)
//                     .then(() => {
//                         console.log('Audio file downloaded successfully.');

//                         res.status(200).send({
//                             success: true,
//                             message: 'audio file created successfully',
//                             data: downloadUrl
//                         })

//                     })
//                     .catch((err) => {
//                         console.error('Error while downloading audio file:', err);
//                     });

//             }


//             async function downloadAudioFile(url, outputFilePath) {
//                 try {
//                     const response = await axios({
//                         method: 'GET',
//                         url: url,
//                         responseType: 'stream',
//                     });

//                     const writer = fs.createWriteStream(outputFilePath);
//                     response.data.pipe(writer);

//                     return new Promise((resolve, reject) => {
//                         writer.on('finish', resolve);
//                         writer.on('error', reject);
//                     });
//                 } catch (err) {
//                     console.error('Error while downloading audio file:', err);
//                 }
//             }
//         }
//     } catch (error) {
//         console.log('error', error);

//         res.status(200).send({
//             success: false,
//             message: error.message
//         })
//     }


// }

module.exports = { getChatHistory, getChatBot, getTextToSpeech };