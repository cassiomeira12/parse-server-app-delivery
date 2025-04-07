const PaymentTypeScheme = {
  className: "PaymentType",
  fields: {
    name: {
      type: "String",
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

const PaymentTypeDefaultData = {
  "class": "PaymentType",
  "items": [
    {
      "name": "Dinheiro",
    },
    {
      "name": "Pix",
    },
    {
      "name": "Cartão (Crédito, Débito)",
    }
  ],
}

module.exports = { PaymentTypeScheme, PaymentTypeDefaultData };