import {
  Banknote,
  CreditCard,
  Smartphone,
  Building2,
} from "lucide-react";

const methodConfig = {
  Cash: {
    icon: Banknote,
    style: "bg-green-50 text-green-700",
  },
  UPI: {
    icon: Smartphone,
    style: "bg-purple-50 text-purple-700",
  },
  Card: {
    icon: CreditCard,
    style: "bg-blue-50 text-blue-700",
  },
  "Bank Transfer": {
    icon: Building2,
    style: "bg-orange-50 text-orange-700",
  },
};

const PaymentMethodBadge = ({ method }) => {
  const config = methodConfig[method] || methodConfig.Cash;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${config.style}`}
    >
      <Icon size={13} />
      {method}
    </span>
  );
};

export default PaymentMethodBadge;