export const initialOrders = [
  {
    id: "ORD-2026-1048",
    customer: "Priya Sharma",
    phone: "+91 98765 43210",
    date: "2026-10-28",
    status: "Processing",
    payment: "Paid",
    items: [
      { name: "22K Gold Necklace", sku: "GLD-NK-014", quantity: 1, price: 68500 },
      { name: "Gold Earrings", sku: "GLD-ER-022", quantity: 1, price: 18400 },
    ],
    notes: "Gift packaging requested.",
  },
  {
    id: "ORD-2026-1047",
    customer: "Rahul Mehta",
    phone: "+91 98450 12345",
    date: "2026-10-28",
    status: "Draft",
    payment: "Unpaid",
    items: [
      { name: "Men's Gold Ring", sku: "GLD-RG-008", quantity: 1, price: 32750 },
    ],
    notes: "",
  },
  {
    id: "ORD-2026-1046",
    customer: "Ananya Rao",
    phone: "+91 99001 22334",
    date: "2026-10-27",
    status: "Ready",
    payment: "Paid",
    items: [
      { name: "Diamond Pendant", sku: "DIA-PD-006", quantity: 1, price: 54200 },
    ],
    notes: "Customer will collect in store.",
  },
  {
    id: "ORD-2026-1045",
    customer: "Vikram Reddy",
    phone: "+91 99887 66554",
    date: "2026-10-26",
    status: "Confirmed",
    payment: "Partially paid",
    items: [
      { name: "22K Gold Chain", sku: "GLD-CH-031", quantity: 2, price: 41200 },
    ],
    notes: "",
  },
  {
    id: "ORD-2026-1044",
    customer: "Meera Iyer",
    phone: "+91 98440 77889",
    date: "2026-10-25",
    status: "Completed",
    payment: "Paid",
    items: [
      { name: "Gold Bangles", sku: "GLD-BG-019", quantity: 2, price: 36750 },
    ],
    notes: "",
  },
  {
    id: "ORD-2026-1043",
    customer: "Arjun Nair",
    phone: "+91 97311 45678",
    date: "2026-10-24",
    status: "Cancelled",
    payment: "Refund pending",
    items: [
      { name: "Silver Bracelet", sku: "SLV-BR-011", quantity: 1, price: 5800 },
    ],
    notes: "Cancelled at customer's request.",
  },
];

export const catalog = [
  { name: "22K Gold Necklace", sku: "GLD-NK-014", price: 68500 },
  { name: "Gold Earrings", sku: "GLD-ER-022", price: 18400 },
  { name: "Men's Gold Ring", sku: "GLD-RG-008", price: 32750 },
  { name: "Diamond Pendant", sku: "DIA-PD-006", price: 54200 },
  { name: "22K Gold Chain", sku: "GLD-CH-031", price: 41200 },
  { name: "Gold Bangles", sku: "GLD-BG-019", price: 36750 },
  { name: "Silver Bracelet", sku: "SLV-BR-011", price: 5800 },
];

export const customers = [
  { name: "Priya Sharma", phone: "+91 98765 43210" },
  { name: "Rahul Mehta", phone: "+91 98450 12345" },
  { name: "Ananya Rao", phone: "+91 99001 22334" },
  { name: "Vikram Reddy", phone: "+91 99887 66554" },
  { name: "Meera Iyer", phone: "+91 98440 77889" },
  { name: "Arjun Nair", phone: "+91 97311 45678" },
];

export const statusStyles = {
  Draft: "border-slate-200 bg-slate-100 text-slate-600",
  Confirmed: "border-blue-200 bg-blue-50 text-blue-700",
  Processing: "border-amber-200 bg-amber-50 text-amber-700",
  Ready: "border-violet-200 bg-violet-50 text-violet-700",
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

export const nextStatus = {
  Confirmed: "Processing",
  Processing: "Ready",
  Ready: "Completed",
};