import mockMetalRates from "../data/mockMetalRates";

let metalRates = mockMetalRates.map((rate) => ({ ...rate }));

const delay = (ms = 150) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const generateRateId = () => {
  const numbers = metalRates
    .map((rate) => Number(rate.id.replace("RATE-", "")))
    .filter(Number.isFinite);

  const nextNumber = Math.max(1000, ...numbers) + 1;

  return `RATE-${nextNumber}`;
};

const metalRateService = {
  async getAll() {
    await delay();

    return metalRates.map((rate) => ({ ...rate }));
  },

  async create(rateData) {
    await delay();

    const now = new Date().toISOString();

    const newRate = {
      ...rateData,
      id: generateRateId(),
      updatedAt: now,
    };

    metalRates = [newRate, ...metalRates];

    return { ...newRate };
  },

  async update(id, rateData) {
    await delay();

    const index = metalRates.findIndex((rate) => rate.id === id);

    if (index === -1) {
      throw new Error("Metal rate not found.");
    }

    metalRates[index] = {
      ...metalRates[index],
      ...rateData,
      id,
      updatedAt: new Date().toISOString(),
    };

    return { ...metalRates[index] };
  },

  async remove(id) {
    await delay();

    const exists = metalRates.some((rate) => rate.id === id);

    if (!exists) {
      throw new Error("Metal rate not found.");
    }

    metalRates = metalRates.filter((rate) => rate.id !== id);

    return true;
  },

  async toggleStatus(id) {
    await delay();

    const rate = metalRates.find((item) => item.id === id);

    if (!rate) {
      throw new Error("Metal rate not found.");
    }

    rate.status = rate.status === "Active" ? "Inactive" : "Active";
    rate.updatedAt = new Date().toISOString();

    return { ...rate };
  },
};

export default metalRateService;