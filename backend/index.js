const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const { User } = require('./models/index');

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

const getHeaders = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const userId = 'me';

async function getUserFilters(token) {
  const url = `https://gmail.googleapis.com/gmail/v1/users/${userId}/settings/filters`;

  try {
    const response = await axios.get(url, getHeaders(token));
    return response.data.filter;
  } catch (error) {
    console.log('filter error ===> ', error);
    return false;
  }
}
async function getUserEmail(token) {
  const url = `https://gmail.googleapis.com/gmail/v1/users/${userId}/profile`;
  try {
    const response = await axios.get(url, getHeaders(token));
    return response.data.emailAddress;
  } catch (error) {
    console.log('email error ===> ', error);
    return false;
  }
}

async function getUserName(token) {
  const url = `https://people.googleapis.com/v1/people/${userId}?personFields=names`;

  try {
    const response = await axios.get(url, getHeaders(token));
    return response.data.names[0].displayName;
  } catch (error) {
    console.log('name error ===> ', error);
    return false;
  }
}

app.post('/', async (req, res) => {
  const { selectedEmails: emailAddresses, ACCESS_TOKEN } = req.body;
  console.log(ACCESS_TOKEN);
  if (emailAddresses.length > 470) {
    return res
      .status(401)
      .json('selectedEmails length should be less than 470');
  }

  const url = `https://www.googleapis.com/gmail/v1/users/${userId}/settings/filters`;

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
    const response = await axios.post(url, filter, getHeaders(ACCESS_TOKEN));

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
