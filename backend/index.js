const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const { User } = require('./models/index');
require('dotenv').config();

const {
  createFilter,
  getUserFilters,
  getUserEmail,
  getUserName,
} = require('./gmailApi');

const { getFilterBody } = require('./createFilterBody');

app.use(express.json());
app.use(cors());
app.options('*', cors());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(8000, () => {
      console.log('connected');
    });
  });

app.post('/api/filter', async (req, res) => {
  const { selectedEmails: emailAddresses, ACCESS_TOKEN } = req.body;
  const { action } = req.query;

  if (!emailAddresses || !ACCESS_TOKEN || !action) {
    res.status(400).send('invalid data sent please check  your payload');
  } else if (emailAddresses.length > 470) {
    res.status(401).json('selectedEmails length should be less than 470');
  }

  const filter = getFilterBody(action, emailAddresses);
  try {
    const response = await createFilter(filter, ACCESS_TOKEN);
    const email = await getUserEmail(ACCESS_TOKEN);

    const filters = await getUserFilters(ACCESS_TOKEN);

    const user = await User.findOne({ email });
    if (user) {
      Object.assign(user, { filters: filters });
      await user.save();

      res.status(201).json(user);
    } else {
      const name = await getUserName(ACCESS_TOKEN);
      const user = await User.create({
        email,
        filters,
        name,
      });
      res.status(201).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(402).json({ message: 'something went wrong', error });
  }
});

app.post('/getMail', async (req, res) => {
  const email = await getUserEmail(req.body.ACCESS_TOKEN);
  if (email) res.status(200).send({ email: email });
  else res.status(400).send({ message: 'Invalid token' });
});
