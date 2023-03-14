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

app.post('/', (req, res, next) => {
  const emailAddresses = req.body.selectedEmails;
  const ACCESS_TOKEN = req.body.ACCESS_TOKEN;
  deleteFilter(emailAddresses, ACCESS_TOKEN);
  res.send(req.body);
});

/* const createDelFilter = async (email, ACCESS_TOKEN) => {
  const userID = 'me';
  const headers = {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  };

  const filter = {
    criteria: {
      from: email,
    },
    action: {
      removeLabelIds: ['INBOX'],
      addLabelIds: ['TRASH'],
    },
  };

  try {
    const response = await axios.post(
      `https://gmail.googleapis.com/gmail/v1/users/${userID}/settings/filters`,
      filter,
      headers
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
 */
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
    const response = await axios.post(url, filter, options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
