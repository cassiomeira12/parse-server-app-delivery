const { getUserData } = require('../user/user');

Parse.Cloud.define('login', async (request) => {
  const { params } = request;

  const username = params.username;
  const password = params.password;

  const ip = request.ip.replace('::ffff:','');
  const installationId = `${ip} ${request.installationId}`.toLowerCase();

  return await login(username, password, installationId);
}, {
  fields: ['username', 'password'],
  requireUser: false
});

Parse.Cloud.define("change-password", async (request) => {
  const { params, user } = request;

  const username = params.username;
  const password = params.password;
  const newPassword = params.newPassword;

  const ip = request.ip.replace('::ffff:','');
  const installationId = `${ip} ${request.installationId}`.toLowerCase();

  const userLogged = await Parse.User.logIn(username, password, { installationId: installationId });

  if (user.id != userLogged.id) {
    throw 'Usuário inválido';
  }

  userLogged.set("password", newPassword);

  await userLogged.save(null, { sessionToken: userLogged.getSessionToken() });

  const querySessions = new Parse.Query("_Session");
  querySessions.equalTo("user", user.toPointer());

  const sessions = await querySessions.find({ useMasterKey: true });

  sessions.forEach(object => {
    object.destroy({ useMasterKey: true });
  });

  return await login(username, newPassword, installationId);
}, {
  fields: ['username', 'password', 'newPassword'],
  requireUser: true,
});

const login = async (username, password, installationId) => {
  const user = await Parse.User.logIn(username, password, { installationId: installationId });

  return await getUserData(user);
}