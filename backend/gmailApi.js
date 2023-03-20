const axios = require('axios');
const getHeaders = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const userId = 'me';
const BASE_URl = `https://gmail.googleapis.com/gmail/v1/users/${userId}`;

async function getUserFilters(token) {
  const url = `${BASE_URl}/settings/filters`;

  try {
    const response = await axios.get(url, getHeaders(token));
    return response.data.filter;
  } catch (error) {
    console.log('filter error ===> ', error);
    return false;
  }
}
async function getUserEmail(token) {
  const url = `${BASE_URl}/profile`;
  try {
    const response = await axios.get(url, getHeaders(token));
    return response.data.emailAddress;
  } catch (error) {
    console.log('email error ===> ', error);
    return false;
  }
}

async function getUserName(token) {
  const url = `https://people.googleapis.com/v1/people/me?personFields=names`;

  try {
    const response = await axios.get(url, getHeaders(token));
    return response.data.names[0].displayName;
  } catch (error) {
    console.log('name error ===> ', error);
    return false;
  }
}

async function createFilter(filter, token) {
  const url = `${BASE_URl}/settings/filters`;

  try {
    const response = await axios.post(url, filter, getHeaders(token));
    return response.data;
  } catch (error) {
    console.log('filter error ===> ', error);
    return false;
  }
}

module.exports = {
  createFilter,
  getUserFilters,
  getUserEmail,
  getUserName,
};
