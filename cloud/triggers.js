const { whatsRequest, getWhatsAppContactProfile } = require('./whatsapp/whatsapp');
var dateFormat = require('dateformat');

Parse.Cloud.beforeSave("_User", async (request) => {
  const { original, object } = request;
  
  if (original === undefined) {
    var acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setRoleReadAccess("Admin", true);
    acl.setRoleWriteAccess("Admin", true);
    
    object.setACL(acl);
  }
});

Parse.Cloud.beforeDelete("_User", async (request) => {
  const { object } = request;

  const querySessions = new Parse.Query("_Session");
  querySessions.equalTo("user", object.toPointer());
  const sessions = await querySessions.find({ useMasterKey: true });
  sessions.forEach(object => {
    object.destroy({ useMasterKey: true });
  });

  const queryUserSoSConfig = new Parse.Query("UserSoSConfig");
  queryUserSoSConfig.equalTo("user", object.toPointer());
  const userSoSConfigs = await queryUserSoSConfig.find({ useMasterKey: true });
  userSoSConfigs.forEach(object => {
    object.destroy({ useMasterKey: true });
  });
});

Parse.Cloud.afterDelete("_User", async (request) => {
  const { object } = request;

  const userDeleted = new Parse.Object("UserDeleted");
  userDeleted.set("userId", object.id);
  userDeleted.set("name", object.get("name"));
  userDeleted.set("username", object.get("username"));
  userDeleted.set("email", object.get("email"));
  userDeleted.set("emailVerified", object.get("emailVerified"));
  userDeleted.set("phoneNumber", object.get("phoneNumber"));
  userDeleted.set("phoneVerified", object.get("phoneVerified"));
  userDeleted.set("locale", object.get("locale"));

  await userDeleted.save(null, { useMasterKey: true });
});

Parse.Cloud.beforeSave("UserDeleted", async (request) => {
  const { original, object, user } = request;
  
  if (original === undefined) {
    var acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setRoleReadAccess("Admin", true);
    acl.setRoleWriteAccess("Admin", true);
    
    object.setACL(acl);
  }
});

Parse.Cloud.beforeSave("VersionApp", async (request) => {
  const { original, object, user } = request;
  
  if (original === undefined) {
    var acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    acl.setReadAccess(user.id, false);
    acl.setWriteAccess(user.id, false);
    acl.setRoleReadAccess("Admin", true);
    acl.setRoleWriteAccess("Admin", true);
    
    object.setACL(acl);
  }
});

Parse.Cloud.beforeSave("Occurrence", async (request) => {
  const { original, object } = request;

  if (original === undefined) {
    const user = object.get("user");
    const queryUser = new Parse.Query("_User");
    queryUser.equalTo("objectId", user.id);
    queryUser.includeAll();

    const userData = await queryUser.first({ useMasterKey: true });

    var acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    acl.setReadAccess(user.id, true);
    acl.setWriteAccess(user.id, false);
    acl.setRoleReadAccess("Admin", true);
    acl.setRoleWriteAccess("Admin", true);
    
    object.setACL(acl);

    const querySafetyContacts = new Parse.Query("SafetyContact");
    querySafetyContacts.equalTo("user", userData.toPointer());
    querySafetyContacts.includeAll();

    const safetyContacts = await querySafetyContacts.findAll({ useMasterKey: true });

    const choice = object.get("choice");

    var phoneNumbers = "";

    if (choice == 2) {
      if (safetyContacts.length == 0) {
        throw "Você precisa adicionar contatos de segurança primeiro";
      } else {
        phoneNumbers = safetyContacts.map((contact) => {
          var phoneNumber = contact.get('phoneNumber');
          return phoneNumber.match(/\d+/g).join('');
        }).join(",");
      }
    }

    if (choice == 1 || choice == 3) {
      const config = await Parse.Config.get({ useMasterKey: true });
      var policyPhoneNumber = config.get("policy_phone_number");
      policyPhoneNumber = policyPhoneNumber.match(/\d+/g).join('');

      phoneNumbers = safetyContacts.map((contact) => {
        var phoneNumber = contact.get('phoneNumber');
        return phoneNumber.match(/\d+/g).join('');
      }).join(",");

      if (phoneNumbers.length == 0) {
        phoneNumbers = policyPhoneNumber;
      } else {
        phoneNumbers = `${phoneNumbers},${policyPhoneNumber}`;
      }
    }

    const userName = userData.get('name');
    const userPhoneNumber = userData.get('phoneNumber');
    const latitude = object.get("latitude");
    const longitude = object.get("longitude");
    const accuracy = object.get("accuracy");

    const date = new Date(new Date().toLocaleString('en', { timeZone: 'America/Sao_Paulo' }))
    const timeNow = dateFormat(date, 'HH:MM"h do dia" dd/mm/yyyy');

    const message = `*MENSAGEM DE EMERGÊNCIA!*
    \nEssa é uma mensagem automática
    \nUm pedido de socorro foi enviado para você
    \n🆘 Nome: *${userName}* \n📞 Telefone: ${userPhoneNumber} \n🕐 Hora: ${timeNow}
    \nVocê recebeu essa mensagem por estar na lista de contatos de segurança
    \nEntre em contato ou procure ajuda!
    \n📍 Abaixo está a localização do GPS com precisão de ${accuracy} metros.
    \nhttps://www.google.com/maps/search/?api=1&query=${latitude},${longitude}
    `;

    const body = {
      "phone": phoneNumbers,
      "message": message,
    };

    // const safetyContactsSent = object.relation('safetyContactsSent');

    try {
      var response = await whatsRequest('post', 'send-message', body);
      if (response.data["status"] == "success") {
        var contacts = Array.from(response.data["response"]);
        var contactSent = contacts.map((contact) => {
          var phoneSent = contact["to"];
          phoneSent = phoneSent.match(/\d+/g).join('');

          // var safetyContact = safetyContacts.find((contact) => {
          //   var phoneNumber = contact.get('phoneNumber');
          //   return phoneNumber.match(/\d+/g).join('') === phoneSent;
          // });

          // if (safetyContact !== undefined) {
          //   safetyContactsSent.add(safetyContact);
          // }

          return phoneSent;
        }).join(",");
        object.set("contactSent", contactSent);
        return;
      }
      throw response.data["message"];
    } catch (error) {
      if (error.data === undefined || error.data["message"] === undefined) {
        throw 'Não foi possível encaminhar mensagem para destinatários';
      }
      throw error.data["message"];
    }
  }
});

Parse.Cloud.beforeSave("SafetyContact", async (request) => {
  const { original, object, user } = request;

  if (original === undefined) {
    var acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setReadAccess(user.id, true);
    acl.setWriteAccess(user.id, false);
    acl.setRoleReadAccess("Admin", true);
    acl.setRoleWriteAccess("Admin", true);
    
    object.setACL(acl);

    if (object.get("sendMessage") === false) {
      object.unset("sendMessage");
      return;
    }

    const queryUser = new Parse.Query("_User");
    const userData = await queryUser.get(user.id, { useMasterKey: true });  

    var phoneNumber = object.get('phoneNumber');
    phoneNumber = phoneNumber.match(/\d+/g).join('');

    const message = `*Aplicativo SOS Vida*
    \nOlá, ${object.get('name')}
    \n*${userData.get('name')}*, ${userData.get('phoneNumber')}, adicionou você na lista de contatos de segurança.
    \nIsso permitirá você receber mensagens de emergência com a localização de *${userData.get('name')}*.
    `;

    const body = {
      "phone": phoneNumber,
      "message": message,
    };

    try {
      var response = await whatsRequest('post', 'send-message', body);

      const status = response.data['status'];
      const msgResponse = response.data['response'];

      //const firstMsg = msgResponse[0];

      //const chatId = firstMsg['chatId'].match(/\d+/g).join('');

      // const imageUrl = await getWhatsAppContactProfile(chatId);
      // object.set("avatarUrl", imageUrl);
      object.unset("sendMessage");

      return status;
    } catch (error) {
      if (error.data["message"] === undefined) {
        throw 'Não foi possível encaminhar mensagem para o destinatário';
      }
      throw error.data["message"];
    }
  }
});

Parse.Cloud.beforeSave("Notification", async (request) => {
  const { original, object } = request;

  if (original === undefined) {
    const recipient = object.get("recipient");

    const querySessions = new Parse.Query("_Session");
    const queryInstallations = new Parse.Query("_Installation");
    queryInstallations.notEqualTo('deviceToken', null);
    queryInstallations.notEqualTo('pushStatus', 'UNINSTALLED');
    
    querySessions.equalTo("user", recipient.toPointer());
    queryInstallations.matchesKeyInQuery("installationId", "installationId", querySessions);

    // const pushNotifications = object.relation('pushNotifications');
    
    const installations = await queryInstallations.find({ useMasterKey: true });

    if (installations.length == 0) {
      throw 'User has no installed App';
    }

    /* await Promise.all(installations.map(async (installation) => {
      const token = installation.get("deviceToken");
      
      const pushNotification = new Parse.Object("PushNotification");
      pushNotification.set("GCMSenderId", installation.get("GCMSenderId"));
      pushNotification.set("messageId", null);
      pushNotification.set("token", token);
      pushNotification.set("topic", null);
      pushNotification.set("delivered", null);

      var acl = new Parse.ACL();
      acl.setPublicReadAccess(false);
      acl.setPublicWriteAccess(false);
      acl.setReadAccess(recipient.id, false);
      acl.setWriteAccess(recipient.id, false);
      acl.setRoleReadAccess("Admin", true);
      acl.setRoleWriteAccess("Admin", true);
      
      pushNotification.setACL(acl);

      const title = object.get('title');
      const body = object.get('body');
      const imageUrl = object.get('imageUrl') ?? undefined;
      const data = object.get('data') !== undefined ? JSON.parse(object.get('data')) : undefined;

      const notificationData = {
        'notification': {
          'title': title,
          'body': body
        },
        'image': imageUrl,
        'data': data
      };

      pushNotification.set("data", JSON.stringify(notificationData));

      const result = await pushNotification.save(null, { useMasterKey: true });

      pushNotifications.add(result);
    })); */
  }
});

Parse.Cloud.afterSave("Notification", async (request) => {
  const { object } = request;

  const pushNotificationsRelation = object.relation('pushNotifications');

  const pushNotificationsQuery = pushNotificationsRelation.query();

  const pushNotifications = await pushNotificationsQuery.find({ useMasterKey: true });

  if (pushNotifications.length > 0) {
    return;
  }
  
  const notificationId = object.id;
  const recipient = object.get("recipient");

  const querySessions = new Parse.Query("_Session");
  const queryInstallations = new Parse.Query("_Installation");
  queryInstallations.notEqualTo('deviceToken', null);
  queryInstallations.notEqualTo('pushStatus', 'UNINSTALLED');
  
  querySessions.equalTo("user", recipient.toPointer());
  queryInstallations.matchesKeyInQuery("installationId", "installationId", querySessions);

  const installations = await queryInstallations.find({ useMasterKey: true });

  await Promise.all(installations.map(async (installation) => {
    const token = installation.get("deviceToken");
    
    const pushNotification = new Parse.Object("PushNotification");
    pushNotification.set("GCMSenderId", installation.get("GCMSenderId"));
    pushNotification.set("messageId", null);
    pushNotification.set("token", token);
    pushNotification.set("topic", null);
    pushNotification.set("delivered", null);

    var acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setReadAccess(recipient.id, false);
    acl.setWriteAccess(recipient.id, false);
    acl.setRoleReadAccess("Admin", true);
    acl.setRoleWriteAccess("Admin", true);
    
    pushNotification.setACL(acl);

    const title = object.get('title');
    const body = object.get('body');
    const imageUrl = object.get('imageUrl') ?? undefined;
    const data = object.get('data') !== undefined ? JSON.parse(object.get('data')) : undefined;

    if (data !== undefined) {
      data['notificationId'] = notificationId;
    }

    const notificationData = {
      'notification': {
        'title': title,
        'body': body
      },
      'image': imageUrl,
      'data': data
    };

    pushNotification.set("data", JSON.stringify(notificationData));

    const result = await pushNotification.save(null, { useMasterKey: true });

    pushNotificationsRelation.add(result);
  }));

  object.save(null, { useMasterKey: true });
});

Parse.Cloud.afterSave("PushNotification", async (request) => {
  const { object } = request;

  const GCMSenderId = object.get("GCMSenderId");
  const data = JSON.parse(object.get("data"));
  const token = object.get("token");
  const topic = object.get("topic");
  const delivered = object.get('delivered');

  if (delivered === null) {

    var androidNotification = {
      'sound': 'default',
      'click_action': 'FLUTTER_NOTIFICATION_CLICK'
    };

    var appleNotification = {};

    if (data.image) {
      androidNotification['image'] = data.image;
      appleNotification['image'] = data.image;
    }

    const message = {
      'GCMSenderId': GCMSenderId,
      'message': {
        'token': token,
        'topic': topic,
        'notification': data.notification,
        'data': data.data,
        'android': {
          // 'restricted_package_name': 'com.navan.sosvida',
          'notification': androidNotification
        },
        'apns': {
          'payload': {
            'aps': data.data
          },
          'fcm_options': appleNotification
        }
      }
    };

    try {
      const response = await Parse.Cloud.run('pushNotification', message, { useMasterKey: true });
      const messageId = response['messageId'];

      object.set('messageId', messageId);
      object.set('delivered', true);
    } catch (error) {
      object.set('delivered', false);

      const queryInstallation = new Parse.Query("_Installation");
      queryInstallation.equalTo('deviceToken', token);
      const installations = await queryInstallation.find({ useMasterKey: true });
      const installation = installations[0];

      if (error.message == 'NOT_FOUND') {
        installation.set('pushStatus', 'UNINSTALLED');
      }

      installation.save(null, { useMasterKey: true });
    }

    object.save(null, { useMasterKey: true });
  }
});

Parse.Cloud.beforeSave("UserSoSConfig", async (request) => {
  const { original, object, user } = request;
  
  if (original === undefined) {
    var acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setReadAccess(user.id, true);
    acl.setWriteAccess(user.id, true);
    acl.setRoleReadAccess("Admin", true);
    acl.setRoleWriteAccess("Admin", true);
    
    object.setACL(acl);
  }
});