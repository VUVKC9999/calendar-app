const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 🆕 Add userId
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  category: String,
  reminderTime: Number, // in minutes
  isCompleted: { type: Boolean, default: false },
  reminderSent: { type: Boolean, default: false }, // NEW
  createdAt: { type: Date, default: Date.now },
  completed: {
  type: Boolean,
  default: false,
}
});

module.exports = mongoose.model('Task', taskSchema);
