const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Placeholder to store user and rewards data
const users = {};
const rewards = {};
let requestedDate = 0;
let atTime = 0;
let startOfWeek = 0;
let endOfWeek = 0;
let year = 0;
let month = 0;

// Function to generate rewards for a specific week
function generateRewardsForWeek(startDate, endDate) {
  const rewardsForWeek = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const availableAt = new Date(currentDate);
    availableAt.toUTCString();
    const expiresAt = new Date(currentDate);
    expiresAt.toUTCString();
    expiresAt.setDate(expiresAt.getDate() + 1);

    rewardsForWeek.push({
      availableAt: availableAt.toISOString(),
      redeemedAt: null,
      expiresAt: expiresAt.toISOString(),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return rewardsForWeek;
}

function requestDate() {
for( let x = 1; x <= requestedDate && x <= 28; x= x+7){
   console.log("value x "  + x); 
  startOfWeek = new Date(atTime);
  startOfWeek.setDate(x); // Find possible first date
  startOfWeek.setMonth(month);
  startOfWeek.setHours(0, 0, 0);
  startOfWeek.toUTCString();
  startOfWeek.setUTCHours(0, 0, 0);
 
  
   endOfWeek = new Date(startOfWeek);
   endOfWeek.setDate(startOfWeek.getUTCDate() + 6); // End of the week
  endOfWeek.setMonth(month);
  endOfWeek.setHours(0, 0, 0);
  endOfWeek.toUTCString();
  endOfWeek.setUTCHours(0, 0, 0, 0);

   console.log("endofweek" + endOfWeek.toISOString());

}
}

// Endpoint to get user rewards for a specific date
app.get('/users/:user_id/rewards', (req, res) => {
  const userId = parseInt(req.params.user_id);
  atTime = new Date(req.query.at);
  atTime.toUTCString();
  year = atTime.getUTCFullYear();
  month = atTime.getUTCMonth();

  const daysInMonth = new Date(year, month + 1, 0).getUTCDate();
  requestedDate = atTime.getUTCDate();
  console.log("requestDate" + requestedDate);
  startOfMonth = new Date(year, month, 1);
  endOfMonth = new Date(year, month, daysInMonth);

 if(daysInMonth > 28){
  if(requestedDate <= 28) {
   requestDate();
}


else {
   
    startOfWeek = new Date(atTime);
  startOfWeek.setDate(29); // Find beginning of last week
  startOfWeek.setMonth(month);
  startOfWeek.setHours(0, 0, 0);
  startOfWeek.toUTCString();
 startOfWeek.setUTCHours(0, 0, 0, 0);

  
  console.log(startOfWeek);

   endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getUTCDate() + (daysInMonth % 4) - 1); // End of the last week 
  endOfWeek.setMonth(month);
  endOfWeek.setHours(0, 0, 0);
  endOfWeek.toUTCString();
  endOfWeek.setUTCHours(0, 0, 0, 0);
  console.log(endOfWeek.getDate());

}
}

else {
  requestDate();
}

  const startOfWeekStr = startOfWeek.toISOString();
  console.log(startOfWeekStr);

  // Check if user exists, if not, create a new user
  if (!users[userId]) {
    users[userId] = { id: userId };
  }

  // Check if rewards exist for this week, if not, generate rewards
  if (!rewards[startOfWeekStr]) {
    const rewardsForWeek = generateRewardsForWeek(startOfWeek, endOfWeek);
    rewards[startOfWeekStr] = rewardsForWeek;
  }

console.log(startOfWeekStr);

  // Return user rewards for the specific week
  res.json({
    data: rewards[startOfWeekStr].map(reward => ({
      availableAt: reward.availableAt.split('T')[0] + 'T00:00:00Z',
      redeemedAt: reward.redeemedAt,
      expiresAt: reward.expiresAt.split('T')[0] + 'T00:00:00Z',
    })),
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
