const express = require('express')
const router = express.Router()

const messageCtrl = require('../controllers/message')
const auth = require('../middelware/auth')
const multer = require('../middelware/multer-config')

router.post('/', auth, multer, messageCtrl.createMessage)
router.get('/', auth, messageCtrl.getAllMessages)
router.post('/:id', auth, multer, messageCtrl.replyMessage)
router.put('/:id', auth, multer, messageCtrl.modifyMessage)
router.delete('/:id', auth, messageCtrl.deleteMessage)
router.post('/:id/like', auth, messageCtrl.addLike)
router.delete('/:id/like', auth, messageCtrl.removeLike)

module.exports = router
