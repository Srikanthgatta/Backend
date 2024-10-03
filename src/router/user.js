const express = require('express');
const router = express.Router()

const {register, getOneUser, login, userProfile,
     getAllUser, isAuthenticate,deleteUser, updateUser,updateNotify} = 
     require('../controller/user');


router.get('/user',  getAllUser)
router.get('/user/:id',  getOneUser)
router.post('/user', register)
router.post('/userAuth', login)
router.put('/user/:id', updateUser)
router.delete('/user/:id', deleteUser)
router.get('/userProfile',isAuthenticate, userProfile)


module.exports = router; 