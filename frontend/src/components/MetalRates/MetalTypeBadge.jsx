import { Gem, CircleDollarSign } from "lucide-react";

function MetalTypeBadge({ metalType }) {
  const isGold = metalType === "Gold";

  const Icon = isGold ? Gem : CircleDollarSign;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        isGold
          ? "bg-[#f8f1df] text-[#8b6b25]"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      <Icon size={13} />
      {metalType}
    </span>
  );
}

export default MetalTypeBadge;