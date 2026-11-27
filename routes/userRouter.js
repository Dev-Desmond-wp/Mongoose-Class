const router = require('express').Router();

const { signUp, getAllUsers, getOneUser, updateUser, Login, deleteUser, verifyEmail, forgotPassword, resetPassword } = require('../controllers/user')

router.post('/signup', signUp)

router.post('/login', Login)

router.get('/getall', getAllUsers)

router.get('/getone/:id', getOneUser)

router.post('/forgotpassword', forgotPassword)

router.post('/resetpassword', resetPassword)

router.post('/verifyaccount', verifyEmail)

router.put('/updateUser/:id', updateUser )



router.delete('/deleteAsap/:id', deleteUser)

module.exports = router;