const db = require('./connection');
const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');


// const PLAYHT_BASEURL = 'https://api.play.ht';
const PLAYHT_BASEURL = 'https://play.ht/api/v2/tts';
const PLAYHT_BASEURLID = 'https://play.ht/api/v2/tts/id';
const PLAYHT_STREAMURL = 'https://play.ht/api/v2/tts/stream';

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

// const getTextToSpeech = async (req, res) => {

//     try {
//         const { text, voice } = req.body;
//         console.log('req.body', req.body);
//         // const response = await axios.post(`${PLAYHT_BASEURL}`, {
//         //     text, 
//         //     voice
//         //     // apiKey : process.env.PLAYHT_SECRET
//         // },
//         // {
//         //     headers: {
//         //         accept: 'application/json',
//         //         'content-type': 'application/json',
//         //         AUTHORIZATION: 'Bearer c37d087023b7411098cb3543c8fcb318',
//         //         'X-USER-ID': 'XUnitmVg1kM4LrGdA82ePX5Owvi2'
//         //       }
//         // });

//         // const options = {
//         //     method: 'POST',
//         //     headers: {
//         //         // accept: 'application/json',
//         //         accept: 'audio/mpeg',
//         //         'content-type': 'application/json',
//         //         AUTHORIZATION: 'Bearer c37d087023b7411098cb3543c8fcb318',
//         //         'X-USER-ID': 'XUnitmVg1kM4LrGdA82ePX5Owvi2'
//         //     },
//         //     body: JSON.stringify({text: 'Helloooo', voice: 'larry'})
//         //     // body: JSON.stringify({
//         //     //     text: '\'Hello!\' said the ultra-realistic voice.',
//         //     //     voice: 'larry',
//         //     //     quality: 'medium',
//         //     //     output_format: 'mp3',
//         //     //     speed: 1,
//         //     //     sample_rate: 24000,
//         //     //     seed: null,
//         //     //     temperature: null
//         //     // })
//         // };

//         // const options = {
//         //     method: 'POST',
//         //     headers: {
//         //       accept: 'audio/mpeg',
//         //       'content-type': 'application/json',
//         //       AUTHORIZATION: 'Bearer c37d087023b7411098cb3543c8fcb318',
//         //       'X-USER-ID': 'XUnitmVg1kM4LrGdA82ePX5Owvi2'
//         //     },
//         //     body: JSON.stringify({text: 'bvbvhvg', voice: 'larry'})
//         //   };


//         // fetch(PLAYHT_BASEURL, options)
//         // .then(res => res.json())
//         // .then(json => console.log(json))
//         // .catch(err => console.error('error:' + err));




//         const response = await axios.post(`${PLAYHT_BASEURL}`, {
//             text,
//             voice,
//             output_format: 'wav',
//             quality: 'medium'
//             // apiKey : process.env.PLAYHT_SECRET
//         },
//             {
//                 headers: {
//                     accept: 'audio/wav',
//                     // accept: 'application/json',
//                     'content-type': 'application/json',
//                     AUTHORIZATION: `Bearer ${process.env.PLAYHT_SECRET}`,
//                     'X-USER-ID': process.env.PLAYHT_USER_ID
//                 },
//                 responseType: 'arraybuffer'
//             });

//         console.log('response>>>>>>>>>', response.data);

//         // console.log(response.data);
//         console.log(response.status);
//         console.log(response.headers);

//         if (response.data) {

//             saveBinaryDataToMP3(response.data, 'D:/BITROOT/AI-GROUP-CHAT/openai-groupchat/public/file.mp3')
//         }

        // function saveBinaryDataToMP3(binaryData, filePath) {

        //     const buffer = Buffer.from(binaryData, 'binary');

        //     fs.writeFile(filePath, buffer, (err) => {
        //         if (err) {
        //             console.error('Error writing the MP3 file:', err);
        //         } else {
        //             console.log('MP3 file saved successfully!');
        //         }
        //     });
        //     console.log(`inside ffmpeg`)

        //     ffmpeg(binaryData)
        //         .output(filePath)
        //         .on('end', () => {
        //             console.log('Audio file converted to MP3.');
        //         })
        //         .on('error', (err) => {
        //             console.error('Error converting audio to MP3:', err);
        //         })
        //         .run();
        // }


//         // fetch(PLAYHT_BASEURL, options)
//         //     .then(res => res.json())
//         //     .then(json => console.log(json))
//         //     .catch(err => console.error('error:' + err));

//         // console.log('response', response.data);

//         res.status(200).send({
//             success: true,
//             message: "VOICE GENERATED",
//             // data: response.data
//         });
//     } catch (error) {
//         console.log('error', error);

//         res.status(200).send({
//             success: false,
//             message: error.message
//         })
//     }
// }


// const getTextToSpeech = async (req, res) => {
//     const payload = req.body;
//     const { text, voice } = payload;
//     console.log('payload', payload);
//     try {

//         // const options = {
//         //     method: 'POST',
//         //     url: "https://play.ht/api/v2/tts",
//         //     // url: 'https://play.ht/api/v2/tts/id',
//         //     headers: {
//         //         accept: 'application/json',
//         //         'content-type': 'application/json',
//         //         AUTHORIZATION: `Bearer ${process.env.PLAYHT_SECRET}`,
//         //         'X-USER-ID': process.env.PLAYHT_USER_ID
//         //     },
//         //     data: JSON.stringify(payload)
//         // }


//         // const response = await axios.post(options)

//         // console.log('response', response);

//         const response = await axios.post(`${PLAYHT_BASEURL}`, {
//             text,
//             voice,
//         },
//             {
//                 headers: {
//                     accept: 'application/json',
//                     'content-type': 'application/json',
//                     AUTHORIZATION: `Bearer ${process.env.PLAYHT_SECRET}`,
//                     'X-USER-ID': process.env.PLAYHT_USER_ID
//                 },
//             });

//         console.log('response>>>>>>>>>', response.data);

//         if (response.data) {

//             const response1 = await axios.get(`${PLAYHT_BASEURLID}`, 
//                 {
//                     method : "GET",
//                     headers: {
//                         accept: 'application/json',
//                         AUTHORIZATION: `Bearer ${process.env.PLAYHT_SECRET}`,
//                         'X-USER-ID': process.env.PLAYHT_USER_ID
//                     },
//                 });

//             console.log('response11111111111', response1.data);

//         }
//         res.status(200).send({
//             success: true,
//             message: "VOICE GENERATED",
//             // data: response.data
//         });
//     } catch (error) {
//         console.log('error', error);

//         res.status(200).send({
//             success: true,
//             message: error.message,
//             // data: response.data
//         });
//     }
// }

const getTextToSpeech = async (req, res) => {
    const payload = req.body;
    const { text, voice } = payload;
    const options = {
        method: 'POST',
        url: 'https://play.ht/api/v2/tts',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            AUTHORIZATION: `Bearer ${process.env.PLAYHT_SECRET}`,
            'X-USER-ID': process.env.PLAYHT_USER_ID
        },
        data:{
            text,
            voice,
            quality: 'medium',
            output_format: 'mp3',
            speed: 1,
            sample_rate: 24000,
            seed: null,
            temperature: null
        } 
    };
    console.log('options', options);
    axios
        .request(options)
        .then(function (response1) {
            console.log(`response1`,response1.data);

            const options = {
                method: 'GET',
                url: `https://play.ht/api/v2/tts/${response1.data.id}`,
                headers: {
                  accept: 'application/json',
                  AUTHORIZATION: `Bearer ${process.env.PLAYHT_SECRET}`,
                  'X-USER-ID': process.env.PLAYHT_USER_ID
                }
              };

              console.log('options from ', options)
              
              axios
                .request(options)
                .then(function (response) {
                  console.log(`response2`,response.data);

                  const options = {
                    method: 'POST',
                    url: 'https://play.ht/api/v2/tts/stream',
                    headers: {
                    //   accept: 'audio/mpeg',\
                    accept: 'application/json',
                      'content-type': 'application/json',
                      AUTHORIZATION: `Bearer ${process.env.PLAYHT_SECRET}`,
                      'X-USER-ID': process.env.PLAYHT_USER_ID
                    },
                    data: {
                      text,
                      voice,
                      quality: 'draft',
                      output_format: 'mp3',
                      speed: 1,
                      sample_rate: 24000,
                      seed: null,
                      temperature: null
                    }
                  };
                  
                  axios
                    .request(options)
                    .then(async function (response) {
                      console.log(`response3`,response.data);
                      const file = await axios.get(response.data.href, {
                        headers : {
                            AUTHORIZATION: `Bearer ${process.env.PLAYHT_SECRET}`,
                            'X-USER-ID': process.env.PLAYHT_USER_ID
                        }
                      });
                      console.log('file', file.data)

                      saveBinaryDataToMP3(file.data, 'D:/BITROOT/AI-GROUP-CHAT/openai-groupchat/public/file.mpeg');


                      function saveBinaryDataToMP3(binaryData, filePath) {

                        const buffer = Buffer.from(binaryData, 'binary');
            
                        fs.writeFile(filePath, buffer, (err) => {
                            if (err) {
                                console.error('Error writing the MP3 file:', err);
                            } else {
                                console.log('MP3 file saved successfully!');
                            }
                        });
                        console.log(`inside ffmpeg`)
            
                        // ffmpeg(binaryData)
                        //     .output(filePath)
                        //     .on('end', () => {
                        //         console.log('Audio file converted to MP3.');
                        //     })
                        //     .on('error', (err) => {
                        //         console.error('Error converting audio to MP3:', err);
                        //     })
                        //     .run();
                    }




                      
                    })
                    .catch(function (error) {
                      console.error(error);
                    });
                })
                .catch(function (error) {
                  console.error(error);
                });
        })
        .catch(function (error) {
            console.error(error);
        });
}

module.exports = { getChatHistory, getChatBot, getTextToSpeech };