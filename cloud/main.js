require('./installation/installation');
require('./functions');
require('./triggers');
require('./whatsapp/whatsapp_two_factor_authentication');
require('./user/user');
require('./login/login');
require('./login/signup');
require('./roles');
require('./jobs');
require('./push_notification/push_notification');
require('./notification/notification');

require('./company/company');
require('./order/order');

module.exports.app = require('./app');
