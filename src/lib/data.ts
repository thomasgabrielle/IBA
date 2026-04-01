// IPC Phase types and mock data

export type Phase = 1 | 2 | 3 | 4 | 5 | null;

export interface ContributingFactor {
  id: string;
  name: string;
  section: string;
  alignment: Phase;
  isKeyIndicator: boolean;
}

export interface AnalysisPeriod {
  label: string;
  dateRange: string;
}

export interface ClassificationRow {
  id: string;
  indicator: string;
  number: number;
  trend: "up" | "down" | "stable" | null;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  p5: string;
  p3plus: string;
}

export interface HumanitarianAssistanceRow {
  period: string;
  popPercent: string;
  kcalPercent: string;
  issues: string;
  significance: string;
}

export interface RiskFactor {
  id: string;
  name: string;
  projected1: boolean;
  projected2: boolean;
}

export interface UnitData {
  id: string;
  name: string;
  factors: Record<string, Phase>;
  sectionPhases: Record<string, Phase>;
}

export const sections = [
  "Availability",
  "Access",
  "Utilization",
  "Hazards / Conflict Dimension",
  "Assistance",
  "Mortality",
  "Nutrition",
] as const;

export const categories = [
  { id: "vulnerability", label: "Vulnerability / Hazards", row: 0 },
  { id: "mortality", label: "Mortality", row: 0 },
  { id: "nutrition", label: "Nutrition Status", row: 0 },
  { id: "food-availability", label: "Food Availability & Stability", row: 1 },
  { id: "food-access", label: "Food Access & Stability", row: 1 },
  { id: "food-utilization", label: "Food Utilization & Stability", row: 1 },
  { id: "food-consumption", label: "Food Consumption", row: 1 },
  { id: "livelihood", label: "Livelihood Change", row: 1 },
] as const;

export const contributingFactors: ContributingFactor[] = [
  // Availability
  { id: "cf-1", name: "Available stock vs. caloric need for the population living in the area", section: "Availability", alignment: 4, isKeyIndicator: true },
  { id: "cf-2", name: "Food stock for staple commodities", section: "Availability", alignment: 4, isKeyIndicator: true },
  { id: "cf-3", name: "Reduction in livestock production", section: "Availability", alignment: 2, isKeyIndicator: true },
  { id: "cf-4", name: "Reduction in agricultural production", section: "Availability", alignment: 3, isKeyIndicator: true },
  { id: "cf-5", name: "Availability of staple food items in the markets", section: "Availability", alignment: 3, isKeyIndicator: false },
  { id: "cf-6", name: "Availability of essential non-food items in the markets (e.g. fuel and cooking fuel)", section: "Availability", alignment: 2, isKeyIndicator: false },
  { id: "cf-7", name: "Availability of wild foods (plants, insects, mushrooms, fish, game meat)", section: "Availability", alignment: 2, isKeyIndicator: false },
  // Access
  { id: "cf-8", name: "Market functionality (destroyed or doesn't have basic commodities)", section: "Access", alignment: 2, isKeyIndicator: true },
  { id: "cf-9", name: "Physical access to agricultural land", section: "Access", alignment: 3, isKeyIndicator: true },
  { id: "cf-10", name: "Financial access", section: "Access", alignment: 4, isKeyIndicator: false },
  { id: "cf-11", name: "Food prices", section: "Access", alignment: 2, isKeyIndicator: true },
  { id: "cf-12", name: "Fuel prices", section: "Access", alignment: 2, isKeyIndicator: false },
  { id: "cf-13", name: "Access to livestock (for livestock products or as a financial asset)t", section: "Access", alignment: 2, isKeyIndicator: false },
  { id: "cf-14", name: "Income sourcest", section: "Access", alignment: 4, isKeyIndicator: false },
  { id: "cf-15", name: "Asset depletion through looting, displacement, fighting etc.", section: "Access", alignment: 4, isKeyIndicator: false },
  // Utilization
  { id: "cf-16", name: "Water quantity (SPHERE)", section: "Utilization", alignment: 3, isKeyIndicator: false },
  { id: "cf-17", name: "Water sources", section: "Utilization", alignment: 3, isKeyIndicator: false },
  { id: "cf-18", name: "Fuel stocks", section: "Utilization", alignment: 4, isKeyIndicator: false },
  { id: "cf-19", name: "Epidemic borne disease (water and food borne epidemics)", section: "Utilization", alignment: 2, isKeyIndicator: false },
  // Hazards / Conflict Dimension
  { id: "cf-20", name: "Percentage of destroyed markets including (shops/etc.)", section: "Hazards / Conflict Dimension", alignment: 3, isKeyIndicator: false },
  { id: "cf-21", name: "Percentage of functional health facilities", section: "Hazards / Conflict Dimension", alignment: 4, isKeyIndicator: false },
  { id: "cf-22", name: "Percentage of functional people displaced", section: "Hazards / Conflict Dimension", alignment: 3, isKeyIndicator: true },
  { id: "cf-23", name: "Humanitarian corridors", section: "Hazards / Conflict Dimension", alignment: 2, isKeyIndicator: false },
  { id: "cf-24", name: "Inflows of IDPs to the area", section: "Hazards / Conflict Dimension", alignment: 3, isKeyIndicator: false },
  { id: "cf-25", name: "Humanitarian access", section: "Hazards / Conflict Dimension", alignment: 5, isKeyIndicator: false },
  { id: "cf-26", name: "Number of violent episodes", section: "Hazards / Conflict Dimension", alignment: 3, isKeyIndicator: true },
  { id: "cf-27", name: "Access to roads for movement of goods and people", section: "Hazards / Conflict Dimension", alignment: 4, isKeyIndicator: false },
  // Assistance
  { id: "cf-28", name: "Humanitarian assistance", section: "Assistance", alignment: 5, isKeyIndicator: true },
  { id: "cf-29", name: "In-kind food donations", section: "Assistance", alignment: null, isKeyIndicator: false },
  // Mortality
  { id: "cf-30", name: "Crude death rate due to any cause", section: "Mortality", alignment: null, isKeyIndicator: false },
  // Nutrition
  { id: "cf-31", name: "Nutrition vulnerability situation analysis", section: "Nutrition", alignment: null, isKeyIndicator: false },
  { id: "cf-32", name: "AMN classification", section: "Nutrition", alignment: null, isKeyIndicator: false },
];

export const periods: AnalysisPeriod[] = [
  { label: "Current", dateRange: "Mar 2020 – Mar 2021" },
  { label: "Projected 1", dateRange: "Mar 2021 - Mar 2022" },
  { label: "Projected 2", dateRange: "Mar 2022 - Mar 2023" },
];

export const humanitarianAssistance: HumanitarianAssistanceRow[] = [
  { period: "At time of data...", popPercent: "88%", kcalPercent: "88%", issues: "Yes", significance: "Moderately Significant" },
  { period: "Current", popPercent: "88%", kcalPercent: "88%", issues: "Yes", significance: "Moderately Significant" },
  { period: "Projected 1", popPercent: "2%", kcalPercent: "50%", issues: "Yes", significance: "Moderately Significant" },
  { period: "Projected 2", popPercent: "88%", kcalPercent: "88%", issues: "Yes", significance: "Moderately Significant" },
];

export const classificationResults: ClassificationRow[] = [
  { id: "cr-1", indicator: "Current", number: 3, trend: null, p1: "88%", p2: "88%", p3: "88%", p4: "88%", p5: "88%", p3plus: "88%" },
  { id: "cr-2", indicator: "Projected 1", number: 4, trend: "down", p1: "88%", p2: "88%", p3: "88%", p4: "88%", p5: "88%", p3plus: "88%" },
];

export const analysisSummaryText = `HUMANITARIAN FOOD SECURITY ASSISTANCE
During the projected 1 period, 2% of the population will meet 50% of their daily dietary caloric requirement through humanitarian food assistance. Humanitarian food assistance is therefore considered to be moderately significant. Humanitarian assistance in form of cash transfers by Action Against Hunger at Ksh.7500 meets 50% of Kcal but very small proportion (3450 households) are benefiting thus moderately significant.`;

export const riskFactors: RiskFactor[] = [
  { id: "rf-1", name: "Gender and other socio-economic inequalities and di...", projected1: true, projected2: true },
  { id: "rf-2", name: "Livelihood assets (human, financial, social, physical a...", projected1: true, projected2: true },
  { id: "rf-3", name: "Currency exchange rate", projected1: true, projected2: true },
  { id: "rf-4", name: "Employment, income or labor opportunities", projected1: false, projected2: false },
];

export const populationEstimates = {
  current: 518560,
  projected1: 888888,
  projected2: 888888,
};

export const units: UnitData[] = [
  {
    id: "kachin-1",
    name: "Kachin_1",
    sectionPhases: { Availability: 3, Access: 3 },
    factors: {
      "cf-1": 4, "cf-2": 4, "cf-3": 2, "cf-4": 3,
      "cf-8": 2, "cf-9": 3, "cf-11": 2, "cf-28": 5,
      "cf-10": null, "cf-12": null,
    },
  },
  {
    id: "chin-2",
    name: "Chin_2",
    sectionPhases: { Availability: 2, Access: 3 },
    factors: {
      "cf-1": null, "cf-2": null, "cf-3": 2, "cf-4": null,
      "cf-8": 2, "cf-9": null, "cf-11": 3, "cf-28": 4,
      "cf-10": 3, "cf-12": 3,
    },
  },
];

export function getPhaseColor(phase: Phase): string {
  switch (phase) {
    case 1: return "bg-ipc-1 text-ipc-1-text";
    case 2: return "bg-ipc-2 text-ipc-2-text";
    case 3: return "bg-ipc-3 text-ipc-3-text";
    case 4: return "bg-ipc-4 text-ipc-4-text";
    case 5: return "bg-ipc-5 text-ipc-5-text";
    default: return "bg-gray-100 text-gray-500";
  }
}

export function getPhaseLabel(phase: Phase): string {
  if (phase === null) return "Select...";
  return `Phase ${phase}`;
}

export function getPhaseBorderColor(phase: Phase): string {
  switch (phase) {
    case 1: return "#cde6cd";
    case 2: return "#f9e064";
    case 3: return "#e8a643";
    case 4: return "#c7422e";
    case 5: return "#6b1d1d";
    default: return "#e5e7eb";
  }
}
