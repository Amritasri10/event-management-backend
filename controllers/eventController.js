const mongoose = require("mongoose");
const Event = require("../models/event");
const { query } = require("express");

// Create Event (POST /api/events)
exports.createEvent = async (req, res) => {
    try {
        const { name, description, date, location } = req.body;

        if (!name || !description || !date || !location) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const newEvent = new Event({
            name,
            description,
            date,
            location,
            owner: req.user.userId,
        });

        const event = await newEvent.save();
        console.log(" Event Created:", event);

        res.status(201).json({ message: "Event created successfully!", event });
    } catch (error) {
        console.error(" Error Creating Event:", error.message);
        res.status(500).json({ message: "Event creation failed!", error: error.message });
    }
};

// Get All Events (GET /api/events?search`&date&location)
exports.getAllEvents = async (req, res) => {
    try {
        const { search, date, location } = req.query;
        let filter = {};

        if (search) {
            filter.name = { $regex: search, $options: "i" }; 
        }

        if (date) {
            filter.date = date; 
        }

        if (location) {
            filter.location = { $regex: location, $options: "i" }; 
        }

        const events = await Event.find(filter);
        res.json({
            message: "Events fetched successfully!",
            totalEvents: events.length,
            events
        });
        console.log("Events Fetched:", events);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch events!", error: error.message });
    }
};




//  Get Single Event by ID (GET /api/events/:id)
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Event ID" });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        console.log("✅ Event Fetched:", event);
        res.json(event);
    } catch (error) {
        console.error("❌ Error Fetching Event:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

//  Update Event (PUT /api/events/:id) - Only Owner Can Update
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Event ID" });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Not authorized to update this event" });
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
        console.log("Event Updated:", updatedEvent);

        res.status(200).json({ message: "Event updated successfully", updatedEvent });
    } catch (error) {
        console.error("Error Updating Event:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

//  Delete Event (DELETE /api/events/:id) - Only Owner Can Delete
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Event ID" });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Not authorized to delete this event" });
        }

        await Event.deleteOne({ _id: id });
        console.log(" Event Deleted Successfully");

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error(" Error Deleting Event:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};
