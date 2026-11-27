const router = require('express').Router();

const { signUp, getAllUsers, getOneUser, updateUser, Login, deleteUser, verifyEmail, forgotPassword, resetPassword, resendOTP, changePassword } = require('../controllers/user')

const { authenticate } = require('../middleware/authentication')

router.post('/signup', signUp)

router.post('/login', Login)

router.get('/getall', authenticate, getAllUsers)

router.get('/getone/:id', getOneUser)

router.post('/forgotpassword', forgotPassword)

router.post('/resetpassword', resetPassword)

router.post('/verifyaccount', verifyEmail)

router.post('/resendotp', resendOTP)

router.post('/changepassword', authenticate, changePassword)

router.put('/updateUser/:id', updateUser )

router.delete('/deleteAsap/:id', deleteUser)

module.exports = router;