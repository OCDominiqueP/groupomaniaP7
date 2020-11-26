const con = require('../mysqlConfig')
const jwt = require('jsonwebtoken')


exports.createMessage = (req, res, next) => {
    const message = req.body
    con.query('INSERT INTO messages SET ?', message, function(
        error,
        _results,
        _fields
    ) {
        if (error) {
            return res.status(400).json(error)
        }
        return res.status(201).json({ message: 'Votre message a bien été posté !' })
    })
}

exports.replyMessage = (req, res, next) => {
    const message = req.body
    con.query('INSERT INTO messages SET ?', message, function(
        error,
        _results,
        _fields
    ) {
        if (error) {
            return res.status(400).json(error)
        }
        return res.status(201).json({ message: 'Votre réponse a bien été postée !' })
    })
}

exports.getAllMessages = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, config.secret)
    const userId = decodedToken.userId
    con.query(
        "SELECT messages.*, COUNT(likes.idUSERS) AS 'likes', COUNT(myLikes.idUSERS) AS 'myLikes', DATE_FORMAT(created_at,\"%d/%m/%Y %H:%i:%s\") AS created_at_formated FROM messages LEFT JOIN likes ON messages.idMESSAGES = likes.idMESSAGES LEFT JOIN likes myLikes ON messages.idMESSAGES = myLikes.idMESSAGES AND myLikes.idUSERS= ? GROUP BY messages.idMESSAGES ORDER BY created_at DESC", [userId],
        function(error, results, _fields) {
            if (error) {
                return res.status(400).json(error)
            }
            return res.status(200).json({ results })
        }
    )
}

exports.modifyMessage = (req, res, next) => {
    con.query(
        'SELECT * FROM messages WHERE idMESSAGES=?',
        req.params.id,
        function(error, results, _fields) {
            if (error) {
                return res.status(400).json(error)
            }
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, config.secret)
            const userId = decodedToken.userId
            const role = decodedToken.role
            const messageId = results[0].idUSERS
            if (userId !== messageId && role !== 'admin') {
                return res.status(401).json({ message: 'Accès non autorisé' })
            }
            const updatedMessage = req.body
            con.query(
                'UPDATE messages SET ? WHERE idMESSAGES=?', [updatedMessage, req.params.id],
                function(error, _results, _fields) {
                    if (error) {
                        return res.status(400).json(error)
                    }
                    return res
                        .status(200)
                        .json({ message: 'Votre message a bien été modifié !' })
                }
            )
        }
    )
}

exports.deleteMessage = (req, res, next) => {
    con.query(
        'SELECT * FROM messages WHERE idMESSAGES=?',
        req.params.id,
        function(error, results, _fields) {
            if (error) {
                return res.status(400).json(error)
            }
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, config.secret)
            const userId = decodedToken.userId
            const role = decodedToken.role
            const messageId = results[0].idUSERS
            if (userId !== messageId && role !== 'admin') {
                return res.status(401).json({ message: 'Accès non autorisé' })
            }
            con.query(
                `DELETE FROM messages WHERE idMESSAGES=${req.params.id}`,
                req.params.id,
                function(error, _results, _fields) {
                    if (error) {
                        return res.status(400).json(error)
                    }
                    return res
                        .status(200)
                        .json({ message: 'Votre message a bien été supprimé !' })
                }
            )
        }
    )
}

exports.addLike = (req, res, next) => {
    const like = req.body
    con.query('INSERT INTO likes SET ?', like, function(
        error,
        _results,
        _fields
    ) {
        if (error) {
            return res.status(400).json(error)
        }
        return res.status(201).json({ message: 'Votre like a bien été ajouté !' })
    })
}

exports.removeLike = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, config.secret)
    const userId = decodedToken.userId
    con.query(
        `DELETE FROM likes WHERE idMESSAGES=${req.params.id} && idUSERS=${userId}`,
        function(error, _results, _fields) {
            if (error) {
                return res.status(400).json(error)
            }
            return res
                .status(200)
                .json({ message: 'Votre like a bien été supprimé !' })
        }
    )
}