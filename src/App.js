import React, { useState, useEffect } from 'react';
import alarmAudio from './reminder-sound.mp3';

const App = () => {
  const [paymentTo, setPaymentTo] = useState('');
  const [amount, setAmount] = useState('');
  const [time, setTime] = useState('');
  const [reminders, setReminders] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [alarm] = useState(new Audio(alarmAudio));

  const addReminder = () => {
    if (paymentTo === '' || amount === '' || time === '') {
      alert('Please fill in all fields.');
      return;
    }

    setReminders([...reminders, { paymentTo, amount, time }]);
    setPaymentTo('');
    setAmount('');
    setTime('');
  };

  const stopAlarm = (index) => {
    alarm.pause(); // Pause the alarm
    alarm.currentTime = 0; // Reset the audio to start position
    setReminders(prev => prev.filter((_, i) => i !== index));
    setShowToast(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      reminders.forEach((reminder, index) => {
        const reminderTime = new Date(reminder.time).getTime();
        if (reminderTime <= now) {
          setShowToast(true);
          alarm.play(); // Play the alarm when reminder time is reached
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [reminders, alarm]);

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Payment Reminders</h1>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Payment To"
          className="p-2 border rounded"
          value={paymentTo}
          onChange={e => setPaymentTo(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          className="p-2 border rounded"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <input
          type="datetime-local"
          className="p-2 border rounded"
          value={time}
          onChange={e => setTime(e.target.value)}
        />
        <button className="p-2 bg-blue-500 text-white rounded" onClick={addReminder}>Add Reminder</button>
      </div>

      <div className="w-full max-w-screen-md">
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Payment To</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((reminder, index) => (
              <tr key={index}>
                <td className="border p-2">{reminder.paymentTo}</td>
                <td className="border p-2">{reminder.amount}</td>
                <td className="border p-2">{reminder.time}</td>
                <td className="border p-2">
                  <button className="p-2 bg-red-500 text-white rounded" onClick={() => stopAlarm(index)}>Stop</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showToast && (
        <div className="fixed bottom-10 right-10 bg-green-500 text-white p-4 rounded flex items-center">
          <p className="mr-2">
            Payment of {reminders[0]?.amount} remaining to {reminders[0]?.paymentTo}
          </p>
          <button className="bg-red-500 text-white p-2 rounded" onClick={() => setShowToast(false)}>Clear Toast</button>
        </div>
      )}
    </div>
  );
};

export default App;
