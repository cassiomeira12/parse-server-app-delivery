const OrderScheme = {
  className: "Order",
  fields: {
    customer: {
      type: "String",
      require: true,
    },
    phoneNumber: {
      type: "String",
    },
    address: {
      type: "String",
    },
    addressGpsLocation: {
      type: "String",
    },
    items: {
      type: "Relation",
      targetClass: "ProductOrder",
      required: true,
    },
    note: {
      type: "String",
    },
    paymentType: {
      type: "Pointer",
      targetClass: "PaymentType",
      require: true,
    },
    paymentChange: {
      type: "String",
    },
    status: {
      type: "Pointer",
      targetClass: "OrderStatus",
      require: true,
    },
    deliveryMan: {
      type: "Pointer",
      targetClass: "_User",
    }
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

const OrderDefaultData = {
  "class": "Order",
  "items": [],
}

module.exports = { OrderScheme, OrderDefaultData };