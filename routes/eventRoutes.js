const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { 
    createEvent, 
    getAllEvents, 
    getEventById, 
    updateEvent, 
    deleteEvent 
} = require("../controllers/eventController");

const router = express.Router();

// Event Routes
router.post("/", protect, createEvent);   
router.get("/", getAllEvents);            
router.get("/:id", getEventById);         
router.put("/:id", protect, updateEvent); 
router.delete("/:id", protect, deleteEvent);

module.exports = router;
