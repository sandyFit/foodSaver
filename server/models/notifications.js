import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['caducado', 'pocas existencias', 'sistema'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    items: [String],
    date: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    },
    
});

export default mongoose.model('Notifications', notificationSchema);
