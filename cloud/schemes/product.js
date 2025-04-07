const ProductScheme = {
  className: "Product",
  fields: {
    name: {
      type: "String",
      require: true,
    },
    description: {
      type: "String",
    },
    price: {
      type: "Number",
      require: true,
    },
  },
  protectedFields: {
    "*": [],
  },
  classLevelPermissions: {
    get: {
      requiresAuthentication: true
    },
    find: {
      requiresAuthentication: true
    },
    count: {
      requiresAuthentication: true
    },
    create: {
      "role:Admin": true
    },
    update: {
      "role:Admin": true
    },
    delete: {
      "role:Admin": true
    },
  },
};

const ProductDefaultData = {
  "class": "Product",
  "items": [],
}

module.exports = { ProductScheme, ProductDefaultData };