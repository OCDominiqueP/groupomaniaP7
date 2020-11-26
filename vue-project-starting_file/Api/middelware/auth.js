// Middleware qui vient vérifier le TOKEN à chaque emprunt d'une route

const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1] // Récupération du token dans l'entête
        const decodedToken = jwt.verify(token, config.secret) // On vérifie le token avec la clé pour lire ce TOKEN
        const userId = decodedToken.userId // Le token devient un objet JS classique qu'on place dans une constante, et on y récupère l'user ID pour comparaison le cas échéant
        if (req.body.idUSERS && req.body.idUSERS !== userId) {
            const e = new Error('User ID non valable !')
            throw e
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).json({ error: error | 'Requête non authentifiée !' })
    }
}