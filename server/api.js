const db = require('./connection');

const getChatHistory = (req, res) => {

    const { room_id } = req.body;

    db.query(`select * from chat_master where room_id = ${room_id}`,
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

module.exports = { getChatHistory };