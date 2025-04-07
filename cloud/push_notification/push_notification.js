const { validationAdminRules } = require('../roles/validation_roles');
const authFirebasePushNotification = require('./auth_firebase_push_notification');

Parse.Cloud.define('googleAuthToken', async (request) => {
  const { params } = request;

  const GCMSenderId = params.GCMSenderId;

  const authToken = await authFirebasePushNotification(GCMSenderId);
  return authToken;
}, validationAdminRules, {
  fields: ['GCMSenderId'],
  requireUser: true
});

Parse.Cloud.define('pushNotification', async (request) => {
  const { params } = request;

  const GCMSenderId = params.GCMSenderId;

  const authToken = await authFirebasePushNotification(GCMSenderId);

  const config = await Parse.Config.get({ useMasterKey: true });
  const firebaseProjectId = config.get(`projectId_${GCMSenderId}`);

  try {
    const response = await Parse.Cloud.httpRequest({
      method: 'POST',
      url: `https://fcm.googleapis.com/v1/projects/${firebaseProjectId}/messages:send`,
      headers: {
        "Authorization": `Bearer ${authToken.access_token}`,
        "Content-Type": "application/json",
      },
      body: {
        'message': params.message,
      },
    });

    const messageId = response.data.name.replace(`projects/${firebaseProjectId}/messages/`, '');

    return {
      'messageId': messageId,
    };
  } catch (error) {
    if (error.data.error.status == 'NOT_FOUND') {
      // APP FOI DESINSTALADO
      console.log('app UNINSTALLED');
    }

    throw error.data.error.status;
  }

}, validationAdminRules, {
  fields: ['GCMSenderId', 'message'],
  requireUser: true
});