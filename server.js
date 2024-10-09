const express = require('express');
require('dotenv').config();
const app = express();
const connectDB = require('./connectDB');
const Expense = require('./models/expenses');
const userControllers = require('./Controllers/userControllers');

const cookieParser = require("cookie-parser");
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const requireAuth = require('./Middleware/requireAuth');
const port = process.env.PORT || 5000;

// Connect to the database
connectDB();


app.post('/signup', userControllers.signup);
app.post('/login', userControllers.login);

app.post('/create', async (req, res) => {
  try {
      const expense = new Expense(req.body);
      await expense.save();
      res.status(201).json(expense);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Get All Expenses
app.get('/get', async (req, res) => {
  try {
      const expenses = await Expense.find();
      res.status(200).json(expenses);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Update Expense
app.put('/update/:id', async (req, res) => {
  try {
      const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!expense) {
          return res.status(404).json({ error: 'Expense not found' });
      }
      res.status(200).json(expense);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Delete Expense
app.delete('/delete/:id', async (req, res) => {
  try {
      const expense = await Expense.findByIdAndDelete(req.params.id);
      if (!expense) {
          return res.status(404).json({ error: 'Expense not found' });
      }
      res.status(204).send();
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});