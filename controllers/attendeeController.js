const Event = require("../models/event.js");
const {broadcastUpdate} = require("../utils/websocket");

exports.addAttendee = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

      
        event.attendees.push(req.user.userId);
        await event.save();
        
        // Broadcast update to attendees
     
        return res.status(200).json({ message: "Attendee added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

