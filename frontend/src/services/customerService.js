import mockCustomers from "../data/mockCustomers";

let customers = mockCustomers.map((customer) => ({
  ...customer,
  orders: customer.orders.map((order) => ({ ...order })),
}));

const delay = (ms = 200) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const normalizePhone = (phone = "") => phone.replace(/\D/g, "");

const generateCustomerId = () => {
  const highestId = customers.reduce((highest, customer) => {
    const number = Number(customer.customerId.split("-")[1]) || 0;
    return Math.max(highest, number);
  }, 1000);

  return `CUS-${highestId + 1}`;
};

const customerService = {
  async getAll() {
    await delay();

    return customers.map((customer) => ({
      ...customer,
      orders: customer.orders.map((order) => ({ ...order })),
    }));
  },

  async getById(customerId) {
    await delay();

    const customer = customers.find(
      (item) => item.customerId === customerId,
    );

    if (!customer) {
      throw new Error("Customer not found.");
    }

    return {
      ...customer,
      orders: customer.orders.map((order) => ({ ...order })),
    };
  },

  async create(customerData) {
    await delay();

    const phone = normalizePhone(customerData.phone);

    const duplicatePhone = customers.some(
      (customer) => normalizePhone(customer.phone) === phone,
    );

    if (duplicatePhone) {
      throw new Error("A customer with this phone number already exists.");
    }

    const email = customerData.email?.trim().toLowerCase();

    if (
      email &&
      customers.some(
        (customer) => customer.email?.trim().toLowerCase() === email,
      )
    ) {
      throw new Error("A customer with this email address already exists.");
    }

    const newCustomer = {
      ...customerData,
      customerId: generateCustomerId(),
      name: customerData.name.trim(),
      phone,
      email: email || "",
      status: customerData.status || "Active",
      createdAt: new Date().toISOString().slice(0, 10),
      orders: [],
    };

    customers = [newCustomer, ...customers];

    return { ...newCustomer, orders: [] };
  },

  async update(customerId, customerData) {
    await delay();

    const index = customers.findIndex(
      (customer) => customer.customerId === customerId,
    );

    if (index === -1) {
      throw new Error("Customer not found.");
    }

    const phone = normalizePhone(customerData.phone);
    const email = customerData.email?.trim().toLowerCase();

    const duplicatePhone = customers.some(
      (customer, i) =>
        i !== index && normalizePhone(customer.phone) === phone,
    );

    if (duplicatePhone) {
      throw new Error("Another customer already uses this phone number.");
    }

    if (
      email &&
      customers.some(
        (customer, i) =>
          i !== index &&
          customer.email?.trim().toLowerCase() === email,
      )
    ) {
      throw new Error("Another customer already uses this email address.");
    }

    const existingCustomer = customers[index];

    const updatedCustomer = {
      ...existingCustomer,
      ...customerData,
      customerId: existingCustomer.customerId,
      name: customerData.name.trim(),
      phone,
      email: email || "",
      createdAt: existingCustomer.createdAt,
      orders: existingCustomer.orders,
    };

    customers[index] = updatedCustomer;

    return {
      ...updatedCustomer,
      orders: updatedCustomer.orders.map((order) => ({ ...order })),
    };
  },

  async delete(customerId) {
    await delay();

    const customer = customers.find(
      (item) => item.customerId === customerId,
    );

    if (!customer) {
      throw new Error("Customer not found.");
    }

    if (customer.orders.length > 0) {
      throw new Error(
        "This customer has purchase history and cannot be deleted. Mark the customer as inactive instead.",
      );
    }

    customers = customers.filter(
      (item) => item.customerId !== customerId,
    );

    return true;
  },

  async toggleStatus(customerId) {
    await delay();

    const customer = customers.find(
      (item) => item.customerId === customerId,
    );

    if (!customer) {
      throw new Error("Customer not found.");
    }

    customer.status = customer.status === "Active" ? "Inactive" : "Active";

    return { ...customer, orders: [...customer.orders] };
  },
};

export default customerService;