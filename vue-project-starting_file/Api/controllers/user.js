const con = require('../mysqlConfig')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



exports.signup = (req, res, _next) => {
    const user = req.body
    bcrypt.hash(user.password, 10).then((hash) => {
        user.password = hash
        con.query('INSERT INTO users SET ?', user, function(error, _results, _fields) {
            if (error) {
                // Si erreur de la requête
                console.log(error) // La console du serveur affiche l'erreur
                return res.status(400).json(error.sqlMessage)
            } // Et retourne uniquement le message de l'erreur au front
            return res.status(201).json({
                message: 'Votre compte a bien été créé ! Vous pouvez maintenant vous connecter.'
            })
        })
    })
}

exports.login = (req, res, _next) => {
    const userReq = req.body.username
    const passReq = req.body.password
    if (userReq && passReq) {
        con.query(
            'SELECT * FROM groupomania.users WHERE username= ?',
            userReq,
            function(_error, results, _fields) {
                if (results.length > 0) {
                    bcrypt.compare(passReq, results[0].password).then((valid) => {
                        if (!valid) {
                            res
                                .status(401)
                                .json({ message: 'Utilisateur ou mot de passe inconnu' })
                        } else {
                            console.log(userReq, "s'est connecté")
                            let privilege = ''
                            if (results[0].isAdmin === 1) {
                                privilege = 'admin'
                            } else {
                                privilege = 'member'
                            }
                            res.status(200).json({
                                userId: results[0].idUSERS,
                                username: results[0].username,
                                email: results[0].email,
                                privilege: privilege,
                                token: jwt.sign({ userId: user._id },
                                    'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }
                                )
                            })
                        }
                    })
                } else {
                    res
                        .status(401)
                        .json({ message: 'Utilisateur ou mot de passe inconnu' })
                }
            }
        )
    } else {
        res
            .status(500)
            .json({ message: "Entrez un nom d'utilisateur et un mot de passe" })
    }
}

exports.getAllUsers = (_req, res, _next) => {
    con.query(
        'SELECT idUSERS, username, isAdmin, bio, email FROM groupomania.users',
        function(error, results, _fields) {
            if (error) {
                return res.status(400).json(error)
            }
            return res.status(200).json({ results })
        }
    )
}

exports.deleteUser = (req, res, _next) => {
    con.query(
        `DELETE FROM users WHERE idUSERS=${req.params.id}`,
        req.params.id,
        function(error, _results, _fields) {
            if (error) {
                return res.status(400).json(error)
            }
            return res
                .status(200)
                .json({ message: 'Votre compte a bien été supprimé !' })
        }
    )
}