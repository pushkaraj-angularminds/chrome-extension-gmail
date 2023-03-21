function getFilterBody(filterType, emailAddresses) {
  // const query = emailAddresses.map((email) => `from:${email}`).join(' OR ');
  const query = emailAddresses.join(' OR ');

  const filterActions = {
    delete_filter: {
      removeLabelIds: ['INBOX'],
      addLabelIds: ['TRASH'],
    },
    mark_read: {
      removeLabelIds: ['UNREAD'],
    },
    archive: {
      removeLabelIds: ['INBOX'],
      addLabelIds: ['Archive'],
    },
  };

  const action = filterActions[filterType] || {};
  const filterBody = { criteria: { from: query }, action };

  return filterBody;
}

module.exports = {
  getFilterBody,
};
