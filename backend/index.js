require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const lfgRouter = require('./routes/lfg');
const trainingRouter = require('./routes/training');

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/lfg', lfgRouter);
app.use('/api/training', trainingRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
