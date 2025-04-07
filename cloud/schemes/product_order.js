const ProductOrderScheme = {
  className: "ProductOrder",
  fields: {
    quantity: {
      type: "Number",
      require: true,
    },
    product: {
      type: "Pointer",
      targetClass: "Product",
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

const ProductOrderDefaultData = {
  "class": "ProductOrder",
  "items": [],
}

module.exports = { ProductOrderScheme, ProductOrderDefaultData };