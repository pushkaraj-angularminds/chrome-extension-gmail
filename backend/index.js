const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const { User } = require('./models/index');

const {
  createFilter,
  getUserFilters,
  getUserEmail,
  getUserName,
} = require('./gmailApi');

app.use(express.json());
app.use(cors());
app.options('*', cors());

mongoose
  .connect(
    'mongodb+srv://pushkar:pushkar123@cluster0.1oermdv.mongodb.net/chrome-ext?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(8000, () => {
      console.log('connected');
    });
  });

app.post('/', async (req, res) => {
  const { selectedEmails: emailAddresses, ACCESS_TOKEN } = req.body;
  console.log(ACCESS_TOKEN);
  if (emailAddresses.length > 470) {
    res.status(401).json('selectedEmails length should be less than 470');
  }

  const query = emailAddresses.map((email) => `from:${email}`).join(' OR ');

  const filter = {
    criteria: {
      from: query,
    },
    action: {
      removeLabelIds: ['INBOX'],
      addLabelIds: ['TRASH'],
    },
  };

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
