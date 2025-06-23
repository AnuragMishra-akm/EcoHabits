export type Reward = {
  id: string;
  name: string;
  points: number;
  brand: string;
  brandLogoUrl: string;
  couponCode: string;
  expires: string;
  claimed: boolean;
};

export const rewards: Reward[] = [
  {
    id: "greenleaf-cafe-10-off",
    name: "10% off at GreenLeaf Cafe",
    points: 1000,
    brand: "GreenLeaf Cafe",
    brandLogoUrl: "https://placehold.co/100x100.png",
    couponCode: "ECOTEN",
    expires: "2024-12-31",
    claimed: true,
  },
  {
    id: "ecowear-400-voucher",
    name: "₹400 Voucher for EcoWear",
    points: 2500,
    brand: "EcoWear",
    brandLogoUrl: "https://placehold.co/100x100.png",
    couponCode: "GREEN400",
    expires: "2025-01-31",
    claimed: false,
  },
  {
    id: "organic-bean-free-coffee",
    name: "Free Coffee at The Organic Bean",
    points: 500,
    brand: "The Organic Bean",
    brandLogoUrl: "https://placehold.co/100x100.png",
    couponCode: "FREEBEAN",
    expires: "2024-11-30",
    claimed: false,
  },
   {
    id: "eco-friendly-tote-bag",
    name: "Eco-Friendly Tote Bag",
    points: 1500,
    brand: "Sustainable Living Co.",
    brandLogoUrl: "https://placehold.co/100x100.png",
    couponCode: "ECOTOTE",
    expires: "2025-03-31",
    claimed: true,
  },
];
