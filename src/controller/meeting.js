const Meeting = require("../model/meeting");

/***********Create Meeting */
exports.createMeeting = async (req, res) => {
  try {
    const meeting = new Meeting(req.body);
    await meeting.save();

    res.status(201).json({ msg: "Meeting Created Successfully", meeting });
  } catch (error) {
    console.log(error);
    res.status(401).json({ err: "Something went Wrong!", error });
  }
};

/**********Get All Meeting */
exports.getAllMeeting = async (req, res) => {
  let search = req.query.search;
  let filter = req.query.filter;
  try {
    if (req.query.search) {
      const filterMeeting = await Meeting.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
          { phone_no: { $regex: search } },
        ],
      })
        .populate("department")
        .populate("attendees")
        .exec();
      // console.log(filterMeeting)
      return res.status(201).json({ msg: "Successfully", filterMeeting });
    }
    if (req.query.filter) {
      const meeting = await Meeting.find({complition_status:filter})
        .populate("department")
        .populate("attendees")
        .exec();
      res.status(201).json(meeting);
    }
    const meeting = await Meeting.find()
      .populate("department")
      .populate("attendees")
      .exec();
    res.status(201).json(meeting);
  } catch (error) {
    console.log(error);
    res.status(401).json({ err: "Something Went Wrong!", error });
  }
};

/*************get one Meeting */

exports.getOneMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("department")
      .populate("attendees")
      .exec();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(401).json({ err: "Something Went Wrong!!", error });
  }
};

/***********Update Meeting */
exports.updateMeeting = async (req, res) => {
  console.log(req.params);
  try {
    await Meeting.updateOne({ _id: req.params.id }, req.body);
    res.status(201).json({ msg: "Meeting Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ err: "Something Went Wrong!!", error });
  }
};

/***********Delete Meeting */
exports.deleteMeeting = async (req, res) => {
  console.log(req.params.id);
  try {
    const meeting = await Meeting.findByIdAndDelete({ _id: req.params.id });
    res.status(201).json({ msg: "Meeting deleted Successfully", meeting });
  } catch (error) {
    res.status(401).json({ err: "Something went Wrong!!", error });
  }
};

exports.getCreatedMeetings = async (req, res) => {
  try {
    const meeting = await Meeting.find({ meeting_organizer: req.params.id })
      .populate("department")
      .populate("attendees")
      .sort({ createdAt: -1 })
      .exec();
    res.status(201).json({ msg: "Meeting deleted Successfully", meeting });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong!!", error });
  }
};

exports.getMyMeetings = async (req, res) => {
  try {
    const meeting = await Meeting.find({ attendees: { $in: [req.params.id] } })
      .populate("department")
      .populate("attendees")
      .sort({ createdAt: -1 })
      .exec();
    res.status(201).json({ msg: "Meeting deleted Successfully", meeting });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong!!", error });
  }
};

exports.availableAttendees = async (req, res) => {
  try {
    await Meeting.findByIdAndUpdate(req.params.id, {
      $addToSet: { available_attendee: req.params.userId },
    });
    return res.status(200).json({ message: "attending meeting confirmed" });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong!!", error });
  }
};

exports.notAvailableAttendees = async (req, res) => {
  try {
    await Meeting.findByIdAndUpdate(req.params.id, {
      $addToSet: { notavailable_attendee: req.params.userId },
    });
    return res.status(200).json({ message: "attending meeting confirmed" });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong!!", error });
  }
};
