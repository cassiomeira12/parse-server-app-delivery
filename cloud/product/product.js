Parse.Cloud.define('create-order', async (request) => {
  const { params, user } = request;

  const name = params.name;
  const description = params.description;
  const price = params.price;
  const discount = params.discount;
  // const category = params.category;

  const queryStatus = new Parse.Query("ProductStatus");
  queryStatus.equalTo("enabled", true);
  queryStatus.equalTo("showProduct", true);
  const status = await queryStatus.first({ useMasterKey: true });

  const queryUser = new Parse.Query("_User");
  const userData = await queryUser.get(user.id, { useMasterKey: true });
  const company = userData.get("company");

  const product = new Parse.Object("Product");
  product.set("name", name);
  product.set("description", description);
  product.set("price", price);
  product.set("discount", discount);
  // product.set("category", category);
  product.set("status", status);
  product.set("company", company);

  var acl = new Parse.ACL();
  acl.setPublicReadAccess(false);
  acl.setPublicWriteAccess(false);

  // Company Admin ACL
  acl.setRoleReadAccess("Admin-" + company.id, true);
  acl.setRoleWriteAccess("Admin-" + company.id, true);

  // Company Attendant ACL
  acl.setRoleReadAccess("Attendant-" + company.id, true);
  acl.setRoleWriteAccess("Attendant-" + company.id, true);

  // Company DeliveryMan ACL
  acl.setRoleReadAccess("DeliveryMan-" + company.id, false);
  acl.setRoleWriteAccess("DeliveryMan-" + company.id, false);
    
  product.setACL(acl);

  var result = await product.save(null, { useMasterKey: true });

  return result;
}, {
  fields: ['name'],
  requireUser: true
});