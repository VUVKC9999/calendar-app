const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./middleware/auth');
require('dotenv').config();
const taskSchema = require('./models/task'); // Import your Task model


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const taskRoutes = require('./routes/TaskRoutes');
app.use('/api/tasks', taskRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ Mongo Error:", err));

// Routes
app.get('/', (req, res) => {
  res.send('Calendar API is working 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


const cron = require('node-cron');
const Task = require('./models/task');
const nodemailer = require('nodemailer');

// Cron Job: runs every minute
cron.schedule('* * * * *', async () => {
  console.log('⏰ Running reminder check...');
  const now = new Date();

  // Find tasks that need reminder
  const tasks = await Task.find({
    isCompleted: false,
    reminderSent: false,
    reminderTime: { $ne: null },
  }).populate('userId');

  tasks.forEach(async (task) => {
    const reminderTime = new Date(task.date.getTime() - task.reminderTime * 60000);

    if (now >= reminderTime && now < task.date) {
      // 📨 Send email
      await sendReminderEmail(task);

      // ✅ Mark as sent
      task.reminderSent = true;
      await task.save();
    }
  });
});

async function sendReminderEmail(task) {
  if (!task.userId || !task.userId.email) {
    console.warn(`❌ Cannot send email: task ${task._id} has no valid user`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Calendar Reminder" <${process.env.EMAIL_USER}>`,
    to: task.userId.email,
    subject: `Reminder: ${task.title}`,
    text: `Hi ${task.userId.name},\n\nYou have an upcoming task:\n\nTitle: ${task.title}\nDue: ${task.date}\n\n– Calendar App`
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Reminder sent to ${task.userId.email} for task: ${task.title}`);
}
