// const socket = require("socket.io");
// const db = require('../../../config/connection');

// initializing the socket io connection
// const GroupChat = (server) => {
//     const io = socket(server, { cors: { origin: "*" }, allowEIO3: true });
//     console.log("in socket");

//     io.on("connection", (socket) => {
//         console.log("socket", socket);
//         //for a new user joining the room
//         socket.on("joinRoom",async (body) => {
//             console.log("join room body", body);
//             console.log("socket id", socket.id);
//             await socket.join(body.room_id);
//             console.log("socket.rooms",socket.rooms);
//             const sockets = await io.in(body.room_id).fetchSockets();
//             const socketIds = sockets.map(socket => socket.id);
//             console.log("socketIds", socketIds);
//             db.query(`select count(*) as status from room_members where room_id = ${body.room_id} and user_id = ${body.user_id} `, function (error, data, fields) {
//                 if (error) {
//                     console.log("error", error);
//                 } else {
//                     if (data.length != 0 && data[0].status == 0) {
//                         db.query(`insert into room_members(user_id,room_id,socket_id) values(?,?,?)`, [body.user_id, body.room_id, socket.id], function (error, joined, fields) {
//                             if (error) {
//                                 console.log("error", error);
//                             } else {
//                                 console.log("joined", joined);
//                             }
//                         });
//                     }
//                 }
//             });

//             //display a welcome message to the user who have joined a room
//             // socket.emit("message", {
//             //     user_id: body.user_id,
//             //     username: body.username,
//             //     text: body.text,
//             //     type: body.type,
//             //     created_at: new Date()
//             // });

//             // const chatQuery = `select count(cr.id),cr.id,e.user_id as expert_user_id,c.user_id as customer_user_id from chat_request cr left join expert e on e.id = cr.expert_id left join customer c on c.id = cr.customer_id where cr.room_id = ?`;
//             // const [[getChatID]] = await db.promise().query(chatQuery, JSON.stringify(body.room_id));

//             // if (getChatID.status != 0 && getChatID.chat_request_id != null) {
//             //     db.query(`insert into chat_content(chat_id,sender,receiver,text) values( ${getChatID.chat_request_id}, ${getChatID.expert_user_id}, ${getChatID.customer_user_id}, ${JSON.stringify(body.text)} )`, function (error, chats, fields) {
//             //         console.log("update password", results);
//             //         if (error) {
//             //             console.log("error", error);
//             //         } else {
//             //             console.log("error", chats);
//             //         }
//             //     });
//             // }
//             const dateUTC = new Date()
//             var dateIST = new Date(dateUTC.getTime() + 330 * 60000);

//             //displays a joined room message to all other room users except that particular user
//             socket.broadcast.to(body.room_id).emit("status", {
//                 user_id: body.user_id,
//                 username: body.username,
//                 is_online: true,
//                 created_at: dateIST
//             });
//         });

//         //user sending message
//         socket.on("chat", (body) => {
//             console.log("chat body", body);

//             // socket.emit("message", {
//             //     user_id: body.user_id,
//             //     username: body.username,
//             //     text: body.text,
//             //     type: body.type,
//             //     created_at: new Date()
//             // });

//             // const chatQuery = ``;
//             // const [getChatID] = db.promise().query(chatQuery,body.room_id);

//             db.query(`select count(*) as status from room_members where room_id = ${body.room_id} and user_id = ${body.user_id} `, function (error, data, fields) {
//                 console.log("data", data);
//                 if (data.length != 0) {
//                     if (data[0].status != 0) {
//                         db.query(`insert into chat_master(room_id,user_id,message ,message_type) values(?,?,?,?)`, [body.room_id, body.user_id, body.message, body.message_type], function (error, chats, fields) {
//                             if (error) {
//                                 console.log("error", error);
//                             } else {
//                                 console.log("chats", chats);
//                                 console.log("chat", chats.insertId);
//                                 const dateUTC = new Date()
//                                 var dateIST = new Date(dateUTC.getTime() + 330 * 60000);
//                                 //gets the room user and the message sent
//                                 io.to(body.room_id).emit("message", {
//                                     message_id: chats.insertId,
//                                     user_id: body.user_id, //sender_user_id
//                                     username: body.username,
//                                     message: body.message,
//                                     message_type: body.message_type,
//                                     created_at: dateIST,
//                                    image_url : body.image_url
//                                 });
//                             }
//                         });
//                     }
//                 }

//             });


//         });

//         //when the user exits the room
//         // socket.on("disconnect", () => {
//         //     //the user is deleted from array of users and a left room message displayed
//         //     // const p_user = user_Disconnect(socket.id); //delete room id
//         //     socket.broadcast.to(body.room_id).emit("status", {
//         //         user_id: body.user_id,
//         //         username: body.username,
//         //         is_online: false,
//         //         created_at: new Date()
//         //     });
//         // });

//         socket.on('leave', function (body) {
//             console.log('======Left Room========== ', body)
//             socket.leave(body.room_id, function (err) {
//                 if (err) {
//                     console.log("err", err)
//                 } else {
//                     db.query(`update room_members set is_active = 0 where room_id = ${body.room_id} and user_id = ${body.user_id} `, function (error, data, fields) {
//                         console.log("data", data)
//                     });
//                     console.log("left");
//                 }
//             })
//         })
//     });
// }


// module.exports = { GroupChat };

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// // const socket = require('socket.io');
// // const db = require('./config');
// // const openai = require('openai');

// // const  chatSocket = (server) => {
// //     const io = socket(server, {cors : { origin : "*" }, allowEIO3 : true});
// //     console.log(`in socket`); 

// //     const openaiApiKey = process.env.OPENAI_API_KEY;
// //     const prompt = 'Is this message appropriate for the group chat?';

// //     io.on("connection", (socket) => {
// //         console.log('socket', socket);

// //         //new user joining
// //         socket.on("joinRoom", async (body) => {
// //             console.log(`join room body`, body);
// //             console.log(`socket id`, socket.id);
// //             await socket.join(body.room_id);
// //             console.log(`socket.rooms`, socket.rooms);
// //             const sockets = await io.in(body.room_id).fetchSockets();
// //             const socketIds = sockets.map(socket => socket.id);
// //             console.log('socketIds', socketIds);
// //             db.query(`select count(*) as status from room_members where room_id = ${body.room_id} and user_id = ${body.user_id}`, 
// //             function(error, data , fields) {
// //                 if(error) {
// //                     console.log('error', error)
// //                 } else {
// //                     if( data.length != 0 && data[0].status == 0) {
// //                         db.query(`insert into room_members(user_id, room_id, socket_id) values(?,?,?)`, [body.user_id, body.room_id, socket.id], 
// //                         function (error, joined, fields) {
// //                             if(error) {
// //                                 console.log('error', error)
// //                             } else {
// //                                console.log('joined', joined)
// //                             }
// //                         })
// //                     }
// //                 }
// //             })
// //             const dateUTC =  new Date()
// //             var dateIST = new Date(dateUTC.getTime() + 330 * 60000);

// //             socket.broadcast.to(body.room_id).emit("status", {
// //                 user_id : body.user_id,
// //                 username : body.username,
// //                 is_online : true,
// //                 created_at : dateIST
// //             });
// //         });

// //         socket.on("chat", (body) => {
// //             console.log("chat body", body);
// //             db.query(`select count(*) as status from room_members where room_id = ${body.room_id} and user_id = ${body.user_id} `, function (error, data, fields) {
// //                 console.log("data", data);
// //                 if (data.length != 0) {
// //                     if (data[0].status != 0) {
// //                         openai.apiKey = openaiApiKey;
// //                         openai.complete({
// //                             engine: 'text-davinci-002',
// //                             prompt: prompt,
// //                             maxTokens: 1,
// //                             temperature: 0.5,
// //                             prompt: body.message,
// //                         })
// //                         .then(function(response) {
// //                             const isAppropriate = response.data.choices[0].text.toLowerCase().trim() === 'yes';

// //                             if (!isAppropriate) {
// //                                 io.to(socket.id).emit('moderation', {
// //                                     message: body.message,
// //                                     username: body.username,
// //                                 });

// //                                 return;
// //                             }

// //                             db.query(`insert into chat_master(room_id,user_id,message ,message_type) values(?,?,?,?)`, [body.room_id, body.user_id, body.message, body.message_type], function (error, chats, fields) {
// //                                 if (error) {
// //                                     console.log("error", error);
// //                                 } else {
// //                                     console.log("chats", chats);
// //                                     console.log("chat", chats.insertId);
// //                                     const dateUTC = new Date()
// //                                     var dateIST = new Date(dateUTC.getTime() + 330 * 60000);
// //                                     //gets the room user and the message sent
// //                                     io.to(body.room_id).emit("message", {
// //                                         message_id: chats.insertId,
// //                                         user_id: body.user_id, //sender_user_id
// //                                         username: body.username,
// //                                         message: body.message,
// //                                         message_type: body.message_type,
// //                                         created_at: dateIST,
// //                                        image_url : body.image_url
// //                                     });
// //                                 }
// //                             });   
// //                         })    
// //                     }    
// //                 }
// //             })
// //         })            
// //     });    
// // };


// // module.exports = chatSocket;











