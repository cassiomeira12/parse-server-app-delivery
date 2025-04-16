const { RoleScheme, RoleDefaultData } = require('./role');
const { InstallationScheme, InstallationDefaultData } = require('./installation');
const { UserScheme, UserDefaultData } = require('./user');
const { UserDeletedScheme, UserDeletedDefaultData } = require('./user_deleted');
const { VersionAppScheme, VersionAppDefaultData } = require('./version_app');
const { TermsScheme, TermDefaultData } = require('./term');
const { UserTermsScheme, UserTermDefaultData } = require('./user_term');
const { PushNotificationScheme, PushNotificationDefaultData } = require('./push_notification');
const { NotificationScheme, NotificationDefaultData } = require('./notification');

const { CompanyScheme, CompanyDefaultData } = require('./company');

const { ProductStatusScheme, ProductStatusDefaultData } = require('./product_status');
const { ProductCategoryScheme, ProductCategoryDefaultData } = require('./product_category');
const { ProductScheme, ProductDefaultData } = require('./product');

const { ProductOrderScheme, ProductOrderDefaultData } = require('./product_order');

const { PaymentTypeScheme, PaymentTypeDefaultData } = require('./payment_type');
const { OrderStatusScheme, OrderStatusDefaultData } = require('./order_status');
const { OrderScheme, OrderDefaultData } = require('./order');

const schemes = [
  RoleScheme, // Default
  InstallationScheme, // Default
  CompanyScheme,
  UserScheme, // Default
  UserDeletedScheme, // Default
  VersionAppScheme, // Default
  // TermsScheme,
  // UserTermsScheme,
  PushNotificationScheme, // Default
  NotificationScheme, // Default
  //
  ProductStatusScheme,
  ProductCategoryScheme,
  ProductScheme,
  ProductOrderScheme,
  PaymentTypeScheme,
  OrderStatusScheme,
  OrderScheme,
];

const defaultData = [
  RoleDefaultData, // Default
  InstallationDefaultData, // Default
  CompanyDefaultData,
  UserDefaultData, // Default
  UserDeletedDefaultData, // Default
  VersionAppDefaultData, // Default
  TermDefaultData, // Default
  UserTermDefaultData, // Default
  PushNotificationDefaultData, // Default
  NotificationDefaultData, // Default
  ProductStatusDefaultData,
  ProductCategoryDefaultData,
  ProductDefaultData,
  ProductOrderDefaultData,
  PaymentTypeDefaultData,
  OrderStatusDefaultData,
  OrderDefaultData,
];

module.exports = { schemes, defaultData };