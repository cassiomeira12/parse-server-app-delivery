const { InstallationScheme, InstallationDefaultData } = require('./installation');
const { UserScheme, UserDefaultData } = require('./user');
const { UserDeletedScheme, UserDeletedDefaultData } = require('./user_deleted');
const { VersionAppScheme, VersionAppDefaultData } = require('./version_app');
const { TermsScheme, TermDefaultData } = require('./term');
const { UserTermsScheme, UserTermDefaultData } = require('./user_term');
const { PushNotificationScheme, PushNotificationDefaultData } = require('./push_notification');
const { NotificationScheme, NotificationDefaultData } = require('./notification');

const { PaymentTypeScheme, PaymentTypeDefaultData } = require('./payment_type');

const schemes = [
  //Installation,
  //User,
  //UserDeleted,
  //VersionApp,
  // Terms,
  // UserTerms,
  //PushNotification,
  //Notification,
  PaymentTypeScheme,
];

const defaultData = [
  InstallationDefaultData,
  UserDefaultData,
  UserDeletedDefaultData,
  VersionAppDefaultData,
  TermDefaultData,
  UserTermDefaultData,
  PushNotificationDefaultData,
  NotificationDefaultData,
  PaymentTypeDefaultData,
];

module.exports = { schemes, defaultData };