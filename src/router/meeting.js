const express = require('express')
const { getAllMeeting, getOneMeeting, createMeeting, updateMeeting, deleteMeeting, getCreatedMeetings, getMyMeetings, availableAttendees, notAvailableAttendees } = require('../controller/meeting')
const router = express.Router()


router.get('/meeting',getAllMeeting)
router.get('/meeting/:id',getOneMeeting)
router.post('/meeting',createMeeting)
router.put('/meeting/:id',updateMeeting)
router.delete('/meeting/:id',deleteMeeting)
router.get('/cretedMeetings/:id',getCreatedMeetings)
router.get('/myMeetings/:id',getMyMeetings)
router.put('/confirmMeet/:id/:userId',availableAttendees)
router.put('/notconfirmMeet/:id/:userId',notAvailableAttendees)

module.exports = router