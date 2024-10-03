const express = require('express')
const { getAllDepartment, getOneDepartment, createDepartment, updateDepartment, deleteDepartment } = require('../controller/deparment')
const router = express.Router()


router.get('/department',getAllDepartment)
router.get('/department/:id',getOneDepartment)
router.post('/department',createDepartment)
router.put('/department/:id',updateDepartment)
router.delete('/department/:id',deleteDepartment)

module.exports = router