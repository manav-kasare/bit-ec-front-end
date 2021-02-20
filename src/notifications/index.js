export const sendNotification = async (message, apiKey) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key=${apiKey}`,
    },
    body: JSON.stringify(message),
  };

  return fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then((response) => response.text())
    .then((data) => {
      return data;
    });
};
