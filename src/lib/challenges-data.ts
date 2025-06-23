import React from "react";
import { Trophy, Target, Wind } from "lucide-react";
import type { ReactElement } from "react";

export type Challenge = {
  id: string;
  icon: ReactElement;
  title: string;
  reward: string;
  progress: number;
  description: string;
  sponsor: string;
  participants: number;
};

export const challenges: Challenge[] = [
  {
    id: "plastic-free-week",
    icon: React.createElement(Trophy, { className: "text-yellow-500" }),
    title: "Unilever's Plastic-Free Week",
    reward: "+1,500 EcoPoints",
    progress: 75,
    description: "Commit to a week of no single-use plastics. Track your progress and see how much waste you can avoid. Complete daily tasks to earn bonus points.",
    sponsor: "Unilever",
    participants: 1245,
  },
  {
    id: "meatless-mondays",
    icon: React.createElement(Target, { className: "text-red-500" }),
    title: "Meatless Mondays",
    reward: "+200 EcoPoints",
    progress: 50,
    description: "Join the global movement and go meat-free every Monday for a month. Log your meals to track your participation and impact.",
    sponsor: "Community Challenge",
    participants: 876,
  },
  {
    id: "bike-to-work",
    icon: React.createElement(Wind, { className: "text-blue-400" }),
    title: "Bike to Work Challenge",
    reward: "+500 EcoPoints",
    progress: 25,
    description: "Ditch the car and cycle to work twice a week for a month. Connect your fitness tracker to automatically log your trips and earn rewards.",
    sponsor: "Local Bike Shop",
    participants: 321,
  },
];
