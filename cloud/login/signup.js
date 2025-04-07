Parse.Cloud.define('signup', async (request) => {
  const { params } = request;

  const name = params.name;
  const email = params.email;
  const username = params.username;
  const password = params.password;

  const user = new Parse.Object("_User");
  user.set("name", name);
  user.set("email", email);
  user.set("username", username);
  user.set("password", password);

  const avatarUrl = `https://ui-avatars.com/api/?format=png&name=${name.replace(" ", "+")}`;

  const userCreated = await user.save(null, { useMasterKey: true });

  const ip = request.ip.replace('::ffff:','');
  const installationId = `${ip} ${request.installationId}`.toLowerCase();

  const userLogged = await Parse.User.logIn(username, password, { installationId: installationId });

  const userSOSConfig = new Parse.Object("UserSoSConfig");
  userSOSConfig.set("user", userCreated.toPointer());
  await userSOSConfig.save(null, { sessionToken: userLogged.getSessionToken() });

  const permissionsRoles =  await getUserPermissions(userCreated);

  const userJson = userCreated.toJSON();

  delete userJson['ACL'];
  userJson['avatarUrl'] = userJson['avatarUrl'] ?? avatarUrl;
  userJson['permissions'] = permissionsRoles;
  userJson['createdAt'] = userCreated.createdAt.toISOString();
  userJson['updatedAt'] = userCreated.updatedAt.toISOString();
  userJson['sessionToken'] = userLogged.get("sessionToken");

  return userJson;
}, {
  fields: ['name', 'email', 'username', 'password'],
  requireUser: false,
});

const getUserPermissions = async (user) => {
  const queryRole = new Parse.Query("_Role");

  const userQuery = new Parse.Query("_User");
  userQuery.equalTo("objectId", user.id);

  queryRole.matchesQuery("users", userQuery);

  const roles = await queryRole.find({ useMasterKey: true });

  return roles.map((role) => {
    return role.get('name');
  });
}

module.exports = { getUserPermissions };
