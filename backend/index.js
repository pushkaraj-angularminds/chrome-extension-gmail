const express = require('express');
const axios = require('axios');

const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());
app.options('*', cors());
app.listen(8000, () => {
  console.log('connected');
});

app.post('/', async (req, res) => {
  const emailAddresses = req.body.selectedEmails;
  if (emailAddresses.length > 470) {
    res.status(401).json('selectedEmails length should be less than 470');
  }
  const ACCESS_TOKEN = req.body.ACCESS_TOKEN;
  const response = await deleteFilter(emailAddresses, ACCESS_TOKEN);
  if (response.success) {
    res.status(200).json(response.data);
  } else {
    res.status(401).json(response);
  }
});

async function deleteFilter(emailAddresses, ACCESS_TOKEN) {
  let query = '';
  for (let email of emailAddresses) {
    query += `from:${email} OR `;
  }
  query = query.slice(0, -4);

  const filter = {
    criteria: {
      from: query,
    },
    action: {
      removeLabelIds: ['INBOX'],
      addLabelIds: ['TRASH'],
    },
  };
  const userID = 'me';
  const url = `https://www.googleapis.com/gmail/v1/users/${userID}/settings/filters`;
  const options = {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };
  try {
    const googleRes = await axios.post(url, filter, options);

    const data = {
      message: 'successfully created delete filter',
      id: googleRes.data.id,
    };

    return {
      success: true,
      data,
    };
  } catch (error) {
    return error;
  }
}
