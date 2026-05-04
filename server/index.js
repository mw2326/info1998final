require('dotenv').config();
const express = require('express');
const cors = require('cors');

const opportunitiesRouter = require('./routes/opportunities');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/opportunities', opportunitiesRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
