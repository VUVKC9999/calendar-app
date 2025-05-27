export const scheduleNotification = (task) => {
  const { title, description, date, reminderTime } = task;
  const taskTime = new Date(date).getTime();
  const now = new Date().getTime();
  const reminderOffset = reminderTime * 60 * 1000 || 0; // fallback
  const notifyAt = taskTime - reminderOffset;
  const delay = notifyAt - now;

  if (delay > 0) {
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification(`⏰ Reminder: ${title}`, {
          body: description || 'Task is coming up!',
          icon: '/calendar-icon.png', // optional
        });
      }
    }, delay);
  }
};
