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
  const { selectedEmails, ACCESS_TOKEN } = req.body;

  if (selectedEmails.length > 470) {
    return res
      .status(401)
      .json('selectedEmails length should be less than 470');
  }

  try {
    const response = await deleteFilter(selectedEmails, ACCESS_TOKEN);

    if (response.success) {
      return res.status(200).json(response.data);
    }

    return res.status(401).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
});

async function deleteFilter(emailAddresses, ACCESS_TOKEN) {
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

  const url = `https://www.googleapis.com/gmail/v1/users/me/settings/filters`;

  const options = {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const { data } = await axios.post(url, filter, options);

    return {
      success: true,
      data: {
        message: 'successfully created delete filter',
        id: data.id,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
