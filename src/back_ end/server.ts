const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const dataPath = './data/users.json';
function loadUsers() {
  if (!fs.existsSync(dataPath)) return [];
  return JSON.parse(fs.readFileSync(dataPath));
}

function saveUsers(users) {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}
// 📌 Register User
app.post('/register', (req, res) => {
  const { name, avatar } = req.body;
  const users = loadUsers();
    
// Check if already exists
  if (users.find(u => u.name === name)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = { name, avatar, xp: 0 };
  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ message: 'User registered', user: newUser });
});

// 📌 Add XP
app.post('/add-xp', (req, res) => {
  const { name, amount } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.name === name);

  if (!user) return res.status(404).json({ message: 'User not found' });

  user.xp += amount;
  saveUsers(users);
  res.json({ message: 'XP added', user });
});

// 📌 Get All Users
app.get('/users', (req, res) => {
  const users = loadUsers();
  res.json(users);
});

app.listen(port, () => {
    console.log(`server is running on http://localhost${port}`)
});
