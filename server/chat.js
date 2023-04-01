const socket = require('socket.io');
const db = require('./connection')
const { Configuration, OpenAIApi } = require('openai');


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration);

const chatSocket = (server) => {
    const io = socket(server, { cors: { origin: "*" }, allowEIO3: true });
    console.log(`in socket`);

    io.on("connection", (socket) => {
        console.log('socket', socket);

        //new user joining
        socket.on("joinRoom", async (body) => {
            console.log(`join room body`, body);
            console.log(`socket id`, socket.id);
            await socket.join(body.room_id);
            console.log(`socket.rooms`, socket.rooms);
            const sockets = await io.in(body.room_id).fetchSockets();
            const socketIds = sockets.map(socket => socket.id);
            console.log('socketIds', socketIds);
            db.query(`select count(*) as status from room_members where room_id = ${body.room_id} and user_id = ${body.user_id}`,
                function (error, data, fields) {
                    if (error) {
                        console.log('error', error)
                    } else {
                        if (data.length != 0 && data[0].status == 0) {
                            db.query(`insert into room_members(user_id, room_id, socket_id) values(?,?,?)`, [body.user_id, body.room_id, socket.id],
                                function (error, joined, fields) {
                                    if (error) {
                                        console.log('error', error)
                                    } else {
                                        console.log('joined', joined)
                                    }
                                })
                        }
                    }
                })
            const dateUTC = new Date()
            var dateIST = new Date(dateUTC.getTime() + 330 * 60000);

            socket.broadcast.to(body.room_id).emit("status", {
                user_id: body.user_id,
                username: body.username,
                is_online: true,
                created_at: dateIST
            });
        });

        socket.on("chat", (body) => {
            console.log("chat body", body);
            db.query(`select count(*) as status from room_members where room_id = ${body.room_id} and user_id = ${body.user_id} `, async function (error, data, fields) {
                console.log("data", data);
                if (data.length != 0) {
                    let response;

                    if (data[0].status != 0) {

                        if (body.message.includes('@chatbot')) {
                            const prompt = body.message.replace('@chatbot', '').trim();

                            response = await openai.createChatCompletion({
                                model: "gpt-3.5-turbo",
                                messages: [{ role: "user", content: prompt }],
                                "temperature": 0.7
                            });
                            console.log('response :>> ', response);
                            console.log('responsedata :>> ', response.data.choices[0]);
                            // socket.emit('message', response.data.choices[0].text);
                            // socket.emit('message', response.data.choices[0].message.content);

                        }

                        db.query(`insert into chat_master(room_id,user_id,message ,message_type) values(?,?,?,?)`, [body.room_id, body.user_id, body.message, body.message_type], function (error, chats, fields) {
                            if (error) {
                                console.log("error", error);
                            } else {
                                console.log("chats", chats);
                                console.log("chat", chats.insertId);
                                const dateUTC = new Date()
                                var dateIST = new Date(dateUTC.getTime() + 330 * 60000);
                                //gets the room user and the message sent
                                io.to(body.room_id).emit("message", {
                                    message_id: chats.insertId,
                                    user_id: body.user_id, //sender_user_id
                                    username: body.username,
                                    message: body.message,
                                    message_type: body.message_type,
                                    created_at: dateIST,
                                    image_url: body.image_url
                                });
                            }
                        }



                        );

                        if (response) {

                            db.query(`insert into chat_master(room_id,user_id,message ,message_type) values(?,?,?,?)`, [body.room_id, 666, response.data.choices[0].message.content, response.data.choices[0].message.role], function (error, chats, fields) {
                                if (error) {
                                    console.log("error", error);
                                } else {
                                    console.log("chats", chats);
                                    console.log("chat", chats.insertId);
                                    const dateUTC = new Date()
                                    var dateIST = new Date(dateUTC.getTime() + 330 * 60000);
                                    //gets the room user and the message sent
                                    io.to(body.room_id).emit("message", {
                                        message_id: chats.insertId,
                                        user_id: 666, //sender_user_id
                                        username: body.username,
                                        message: response.data.choices[0].message.content,
                                        message_type: response.data.choices[0].message.role,
                                        created_at: dateIST,
                                        image_url: body.image_url
                                    });
                                }
                            }



                            );

                        }
                    }
                }

            });
        });

        socket.on('leave', function (body) {
            console.log('======Left Room========== ', body)
            socket.leave(body.room_id, function (err) {
                if (err) {
                    console.log("err", err)
                } else {
                    db.query(`update room_members set is_active = 0 where room_id = ${body.room_id} and user_id = ${body.user_id} `, function (error, data, fields) {
                        console.log("data", data)
                    });
                    console.log("left");
                }
            })
        })

    })
}

module.exports = chatSocket;