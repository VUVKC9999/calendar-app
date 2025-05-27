const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth'); // ✅ Import auth middleware
const User = require('../models/User'); // import your User model
const sendMail = require('../utils/mailer'); // your mail sending function

// Get all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
  console.log('🔐 Request received to /api/tasks');

  if (!req.userId) {
    console.log('❌ Missing userId in request');
    return res.status(400).json({ error: 'Invalid or missing token' });
  }

  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ date: 1 });
    console.log(`✅ Found ${tasks.length} tasks for user ${req.userId}`);
    res.json(tasks);
  } catch (err) {
    console.error('❌ Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});


// Add a task for the authenticated user
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, userId: req.userId });
    await task.save();

    const user = await User.findById(req.userId);

    // Send email to the user
    await sendMail({
      from: `"Calendar Reminder" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🗓️ New Task Added',
      text: `Hey ${user.name},\n\nYou added a task:\n\n${task.title}\non ${task.date}\n\n– Your Personal Calendar`
    });

    res.status(201).json(task);
  } catch (err) {
    console.error('❌ Error creating task or sending email:', err.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId }); // 🧠 Protect
  res.json({ message: 'Deleted successfully' });
});

// Update task
router.put('/:id', auth, async (req, res) => {
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(updated);
});

// Toggle completion
router.patch('/complete/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
