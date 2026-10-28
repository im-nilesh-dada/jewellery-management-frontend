import mockProducts from "../data/mockProducts";

let products = [...mockProducts];

const delay = (ms = 150) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const generateProductId = () => {
  const numbers = products
    .map((product) => Number(product.id.replace("PRD-", "")))
    .filter(Number.isFinite);

  const nextNumber = Math.max(1000, ...numbers) + 1;

  return `PRD-${nextNumber}`;
};

const productService = {
  async getAll() {
    await delay();
    return products.map((product) => ({ ...product }));
  },

  async create(productData) {
    await delay();

    const product = {
      ...productData,
      id: generateProductId(),
    };

    products = [product, ...products];

    return { ...product };
  },

  async update(id, productData) {
    await delay();

    const index = products.findIndex((product) => product.id === id);

    if (index === -1) {
      throw new Error("Product not found.");
    }

    products[index] = {
      ...products[index],
      ...productData,
      id,
    };

    return { ...products[index] };
  },

  async remove(id) {
    await delay();

    const exists = products.some((product) => product.id === id);

    if (!exists) {
      throw new Error("Product not found.");
    }

    products = products.filter((product) => product.id !== id);

    return true;
  },

  async toggleStatus(id) {
    await delay();

    const product = products.find((item) => item.id === id);

    if (!product) {
      throw new Error("Product not found.");
    }

    product.status = product.status === "Active" ? "Inactive" : "Active";

    return { ...product };
  },
};

export default productService;