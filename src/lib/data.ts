// IPC Phase types and mock data

export type Phase = 1 | 2 | 3 | 4 | 5 | null;

export interface DataSourceRow {
  category: string;
  value: number;
}

export interface DataSourceMetadata {
  evidenceDashboard: string;
  locale: string;
  source: string;
  description: string;
  reliabilityScore: string;
  collectionDateTo: string;
  collectionDateFrom: string;
}

export interface DataSource {
  id: string;
  name: string;
  unit: string;
  chartType: "pie" | "bar";
  chartData: { label: string; value: number; color: string }[];
  tableData: DataSourceRow[];
  metadata: DataSourceMetadata;
}

export interface AlignmentOption {
  phase: Phase;
  color: string;
  label: string;
}

export interface PhaseOption {
  phase: Phase;
  label: string;
}

export interface ContributingFactor {
  id: string;
  name: string;
  section: string;
  alignment: Phase;
  isKeyIndicator: boolean;
  guidanceQuestion?: string;
  phaseOptions?: PhaseOption[];
  analysisText?: string;
  dataSourceNames?: string[];
  dataSources?: DataSource[];
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

export const phaseDescriptions: Record<number, { name: string; description: string[] }> = {
  1: {
    name: "Phase 1 - Minimal",
    description: [
      "Households are able to meet essential food and non-food needs without engaging in atypical and unsustainable strategies to access food and income.",
    ],
  },
  2: {
    name: "Phase 2 - Stressed",
    description: [
      "Households have minimally adequate food consumption but are unable to afford some essential non-food expenditures without engaging in stress-coping strategies.",
    ],
  },
  3: {
    name: "Phase 3 - Crisis",
    description: [
      "Have food consumption gaps that are reflected by high or above-usual acute malnutrition; or",
      "Are marginally able to meet minimum food needs but only by depleting essential livelihood assets or through crisis-coping",
    ],
  },
  4: {
    name: "Phase 4 - Emergency",
    description: [
      "Have large food consumption gaps which are reflected in very high acute malnutrition and excess mortality; or",
      "Are able to mitigate large food consumption gaps but only by employing emergency livelihood strategies and asset liquidation.",
    ],
  },
  5: {
    name: "Phase 5 - Famine",
    description: [
      "Have an extreme lack of food and/or other basic needs even after full employment of coping strategies. Starvation, death, destitution and extremely critical acute malnutrition levels are evident.",
    ],
  },
};

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

export const alignmentOptions: AlignmentOption[] = [
  { phase: 2, color: "#f9e064", label: "No food gap" },
  { phase: 3, color: "#e8a643", label: "Food gap on average (below avg. 2,100 kcal pp/day)" },
  { phase: 4, color: "#c7422e", label: "Large food gap on average" },
  { phase: 5, color: "#6b1d1d", label: "Extreme food gap on average" },
  { phase: null, color: "#d1d5db", label: "Inadequate evidence" },
  { phase: null, color: "#f3f4f6", label: "Alignment not determined" },
];

export const contributingFactors: ContributingFactor[] = [
  // ===== Availability =====
  {
    id: "cf-1", name: "Available stock vs. caloric need for the population living in the area", section: "Availability", alignment: 4, isKeyIndicator: true,
    guidanceQuestion: "Compare available stocks with the caloric needs of the population. If possible, take into account the age and sex distribution of the population.",
    phaseOptions: [
      { phase: 2, label: "No food gap" },
      { phase: 3, label: "Food gap on average (below avg. 2,100 kcal pp/day)" },
      { phase: 4, label: "Large food gap on average" },
      { phase: 5, label: "Extreme food gap on average" },
    ],
    analysisText: "Bhamo and Loije township area cannot have access to farm land compared to other township. The other township area still have limited access to production land. The HH in EAO controlled area and currently not facing armed conflict may be able to grow crops. There are no statistics on production or available stocks. There is a likely caloric deficit in the area corresponding to P3-4.",
    dataSourceNames: [],
  },
  {
    id: "cf-2", name: "Food stock for staple commodities", section: "Availability", alignment: 4, isKeyIndicator: true,
    guidanceQuestion: "How have food stocks changed for staple commodities and what period are available stocks able to cover?",
    phaseOptions: [
      { phase: 2, label: "Stocks cover the needs for several months" },
      { phase: 3, label: "Stocks cover the needs for more than a month" },
      { phase: 4, label: "Stocks cover needs for more than two weeks and less than a month" },
      { phase: 5, label: "Stocks cover needs for less than two weeks and some main staples are already depleted" },
    ],
    analysisText: "Stock availability at household level is low as this is the lean season. Only 37% of households have access to agricultural land, rest are dependent on purchases and their stocks are low (if there are any). Category E (stocks available for more than two weeks but less than a month) - no/very few big markets with large stocks, households have few stocks.",
    dataSourceNames: [],
  },
  {
    id: "cf-3", name: "Reduction in livestock production", section: "Availability", alignment: 2, isKeyIndicator: true,
    guidanceQuestion: "Examine the extent to which livestock production has declined since the beginning of the hazard.",
    phaseOptions: [
      { phase: 2, label: "No or small reduction compared to pre-hazard" },
      { phase: 3, label: "Moderate reduction compared to pre-hazard" },
      { phase: 4, label: "Large reduction compared to pre-hazard" },
      { phase: 5, label: "Extreme reduction compared to pre-hazard" },
    ],
    analysisText: "Livestock ownership is 35%. Production has likely remained similar or slightly increased as household report owning the same, or increased amount of animals. Flooding did not negatively impact livestock ownership. Category C/2: no information on any reduction in livestock production.",
    dataSourceNames: ["Overall, did your number of livestock increase or decrease compared to one year ago - Kachin_1", "Household had sufficient livestock feed - Kachin_1", "Household had sufficient water for livestock - Kachin_1", "Livestock ownership - Source 30 - Kachin_1", "Household had sufficient veterinary services for livestock - Kachin_1"],
  },
  {
    id: "cf-4", name: "Reduction in agricultural production", section: "Availability", alignment: 3, isKeyIndicator: true,
    guidanceQuestion: "Examine the extent to which agricultural production has declined since the beginning of the hazard.",
    phaseOptions: [
      { phase: 2, label: "No or small reduction compared to pre-hazard" },
      { phase: 3, label: "Moderate reduction compared to pre-hazard" },
      { phase: 4, label: "Large reduction compared to pre-hazard" },
      { phase: 5, label: "Extreme reduction compared to pre-hazard" },
    ],
    analysisText: "Displacement has doubled since 2024, and has likely had a negative impact on agricultural production. No statistics on production exist. Only 37% of households have access to land. Food prices in Kachin in general have increased, indicating lower availability of food. Category D: moderate reduction due to increased displacement.",
    dataSourceNames: ["Agricultural land ownership - Source 30 - Kachin_1"],
  },
  {
    id: "cf-5", name: "Availability of staple food items in the markets", section: "Availability", alignment: 3, isKeyIndicator: false,
    guidanceQuestion: "How has the availability of staple food items changed in the commercial markets within the area since the beginning of the hazard?",
    phaseOptions: [
      { phase: 2, label: "No or small reduction compared to pre-hazard" },
      { phase: 3, label: "Moderate reduction compared to pre-hazard" },
      { phase: 4, label: "Large reduction compared to pre-hazard" },
      { phase: 5, label: "Extreme reduction compared to pre-hazard" },
    ],
    analysisText: "Staple food items are available in (small) markets, albeit at elevated prices. Category D: moderate reduction (higher prices, lower production).",
    dataSourceNames: [],
  },
  {
    id: "cf-6", name: "Availability of essential non-food items in the markets (e.g. fuel and cooking fuel)", section: "Availability", alignment: 2, isKeyIndicator: false,
    guidanceQuestion: "How has the availability of essential non-food items changed in the commercial markets within the area since the beginning of the hazard?",
    phaseOptions: [
      { phase: 2, label: "No or small reduction compared to pre-hazard" },
      { phase: 3, label: "Moderate reduction compared to pre-hazard" },
      { phase: 4, label: "Large reduction compared to pre-hazard" },
      { phase: 5, label: "Extreme reduction compared to pre-hazard" },
    ],
    analysisText: "Price of cooking fuel has increased by 16% compared to last year. Lower supplies and also inflation are increasing the price of cooking fuel. Category C: small reduction compared to 2024.",
    dataSourceNames: [],
  },
  {
    id: "cf-7", name: "Availability of wild foods (plants, insects, mushrooms, fish, game meat)", section: "Availability", alignment: 2, isKeyIndicator: false,
    guidanceQuestion: "How has the availability of wild food changed in the area since the beginning of the hazard?",
    phaseOptions: [
      { phase: 2, label: "No or small reduction compared to pre-hazard" },
      { phase: 3, label: "Moderate reduction compared to pre-hazard" },
      { phase: 4, label: "Large reduction compared to pre-hazard" },
      { phase: 5, label: "Extreme reduction compared to pre-hazard" },
    ],
    analysisText: "Wild foods are consumed, e.g. mushrooms and game meat. Availability of wild foods is normal, but access to wild foods is constrained by access problems. No reduction compared to last year = category C.",
    dataSourceNames: [],
  },

  // ===== Access =====
  {
    id: "cf-8", name: "Market functionality (destroyed or doesn't have basic commodities)", section: "Access", alignment: 2, isKeyIndicator: true,
    guidanceQuestion: "What proportion of the markets is still functional and are able to provide essential food items?",
    phaseOptions: [
      { phase: 2, label: "All or most markets are functional" },
      { phase: 3, label: "Moderate share of the markets is not functional" },
      { phase: 4, label: "Large share of markets is not functional" },
      { phase: 5, label: "No functional markets" },
    ],
    analysisText: "Many markets have been destroyed, market price information is not collected (since February 2025) due to the conflict. Some markets exist and they supply staple food items. Small markets are available in rural areas. Households' main food source is markets, so they are able to access markets in most parts of Kachin 1. 85% of households report access to markets without barriers. However, supply is inconsistent: most staple food items remain available, but prices are rising due to poor logistics and conflict disruptions. Given that small markets are functional, the situation is categorised as Phase 2 - with the caveat that most of the big markets have been destroyed. 59% household able to meet its basic needs (R1+ source 30 data).",
    dataSourceNames: ["Households facing physical or social barriers to accessing marketplaces, by barrier - Kachin_1"],
  },
  {
    id: "cf-9", name: "Physical access to agricultural land", section: "Access", alignment: 3, isKeyIndicator: true,
    guidanceQuestion: "To what extent is physical access to agricultural land restricted so that it negatively impacts agricultural production?",
    phaseOptions: [
      { phase: 2, label: "No or few restrictions compared to pre-hazard" },
      { phase: 3, label: "Limited restriction to agricultural land (farmers have at least intermittent access to their land)" },
      { phase: 4, label: "Severe restriction to agricultural land (access is severely restricted)" },
      { phase: 5, label: "Extreme restriction to access agricultural land (no access, complete loss of agricultural livelihood)" },
    ],
    analysisText: "63% of households do not own agricultural land. Conflict and displacement reduce secure land access further. No sowing reported during the lean period, showing physical and security constraints or lack of data evidence. Category D: access limitations, presence of mines etc.",
    dataSourceNames: ["Household land ownership status - Kachin_1", "Agricultural land ownership - Source 30 - Kachin_1"],
  },
  {
    id: "cf-10", name: "Financial access", section: "Access", alignment: 4, isKeyIndicator: false,
    guidanceQuestion: "What proportion of the population has lost their livelihoods and thereby income sources since the beginning of the hazard?",
    phaseOptions: [
      { phase: 2, label: "No or a small share of population lost their income sources" },
      { phase: 3, label: "Less than half of the population lost their income sources" },
      { phase: 4, label: "More than half of population lost their income sources" },
      { phase: 5, label: "Near complete loss of access to income sources" },
    ],
    analysisText: "Financial access has deteriorated. (47% reported financial shocks) Main income relies on casual labor (64%), which is seasonal and unstable. 44% of households are in debt. Many households have lost income sources: reliance on only a few income sources and many households are in debt. Category E: more than half of households have likely lost at least some income sources over the past year.",
    dataSourceNames: ["Kachin 1 Data.xlsx"],
  },
  {
    id: "cf-11", name: "Food prices", section: "Access", alignment: 2, isKeyIndicator: true,
    guidanceQuestion: "To what extent have food prices (with particular reference to staple commodities) increased over the period?",
    phaseOptions: [
      { phase: 2, label: "No or small increase compared to pre-hazard" },
      { phase: 3, label: "Moderately higher compared to pre-hazard" },
      { phase: 4, label: "Much higher compared to pre-hazard" },
      { phase: 5, label: "Very much higher compared to pre-hazard" },
    ],
    analysisText: "Food basket cost rose by ~5.5% between May 2024 and July 2025. Most commodities (e.g., pulses, oil) increased, except rice and onion (which remained stable or decreased slightly in some markets). (Overall Kachin data - no data from Kachin 1). Small increase in prices also likely in Kachin 1 = category C.",
    dataSourceNames: ["Myanmar Price update Key highlights July 2025", "Myanmar Rice Price Trends 2024 - 2025", "Myanmar Eggs Price Trend 2024 -2025", "Myanmar Onion Price Trends 2024-2025", "Myanmar Chickpeas Price Trend 2024 -2025", "Myanmar Salt Price Trends 2024 - 2025", "Myanmar Basic Food Basket price Trends", "Myanmar Tomato Price Trend 2024 - 2025", "Oil (Mixed) price - Kachin_1", "Rice (low quality) price - Kachin_1", "Salt price - Kachin_1", "Pulses price - Kachin_1", "Eggs (local) price - Kachin_1", "Tomatoes (local) price - Kachin_1", "Onions (local) price - Kachin_1", "Oil (palm) price - Kachin_1"],
  },
  {
    id: "cf-12", name: "Fuel prices", section: "Access", alignment: 2, isKeyIndicator: false,
    guidanceQuestion: "To what extent have fuel prices increased over the period?",
    phaseOptions: [
      { phase: 2, label: "No or small increase compared to pre-hazard" },
      { phase: 3, label: "Moderately higher compared to pre-conflict national average" },
      { phase: 4, label: "Much higher compared to pre-conflict national average" },
      { phase: 5, label: "Very much higher compared to pre-conflict national average" },
    ],
    analysisText: "Fuel prices have increased sharply (7% Month on Month changes) and (16% year on year change) with reported shortages in conflict-affected areas. (Myanmar Average fuel price excluding Rakhine state). No data from Kachin 1. Small increase compared to last year = category C. Fuel access does not seem to be a big constraint to households.",
    dataSourceNames: ["Myanmar Average fuel prices change 2024-2025"],
  },
  {
    id: "cf-13", name: "Access to livestock (for livestock products or as a financial asset)", section: "Access", alignment: 2, isKeyIndicator: false,
    guidanceQuestion: "Has the population lost access to livestock and to what extent?",
    phaseOptions: [
      { phase: 2, label: "No or limited loss of access to livestock compared to pre-hazard" },
      { phase: 3, label: "Moderate loss of access to livestock compared to pre-hazard" },
      { phase: 4, label: "Large loss of access to livestock compared to pre-hazard" },
      { phase: 5, label: "Extreme loss of access to livestock compared to pre-hazard" },
    ],
    analysisText: "Livestock numbers remain the same/slightly increased. Households generally retain livestock as an asset, though access to feed is limited (only about one-third report sufficient feed). Its productivity is constrained by input shortages. Category C = access has not changed.",
    dataSourceNames: ["Livestock ownership - Source 30 - Kachin_1", "Household had sufficient veterinary services for livestock - Kachin_1", "Overall, did your number of livestock increase or decrease compared to one year ago - Kachin_1", "Household had sufficient livestock feed - Kachin_1", "Household had sufficient water for livestock - Kachin_1"],
  },
  {
    id: "cf-14", name: "Income sources", section: "Access", alignment: 4, isKeyIndicator: false,
    guidanceQuestion: "What proportion of the population lost their normal income sources since the beginning of the hazard?",
    phaseOptions: [
      { phase: 2, label: "No or small share of population lost their normal income sources" },
      { phase: 3, label: "Less than half of the population lost their normal income sources" },
      { phase: 4, label: "More than half of population lost their normal income sources" },
      { phase: 5, label: "Near complete loss of access to normal income sources" },
    ],
    analysisText: "Main income relies on casual labor (64%), which is seasonal and unstable. 44% of households are in debt. Many households have lost income sources: reliance on only a few income sources and many households are in debt. Category E: more than half of households have likely lost at least some income sources over the past year.",
    dataSourceNames: ["Proportion of household income saved after covering all monthly expenses and purchases - Kachin_1", "Household's average monthly income and total current debt - Kachin_1", "Household sources of income over the last one year - Source 30 - Kachin_1", "Household income over the 30 days prior to data collection - Kachin_1", "Households common sources of household income over the 30 days prior to data collection - Kachin_1", "Household by severity of source of income in the 30 days prior to data collection - Kachin_1"],
  },
  {
    id: "cf-15", name: "Asset depletion through looting, displacement, fighting etc.", section: "Access", alignment: 4, isKeyIndicator: false,
    guidanceQuestion: "What proportion of the assets have been lost due to the conflict?",
    phaseOptions: [
      { phase: 2, label: "No or small loss of assets compared to pre-hazard" },
      { phase: 3, label: "Moderate loss of assets compared to pre-hazard" },
      { phase: 4, label: "Large loss of assets compared to pre-hazard" },
      { phase: 5, label: "Lost almost all assets compared to pre-hazard" },
    ],
    analysisText: "Conflict has led to loss and depletion of key household assets. 63% of households lack agricultural land, partly due to displacement. Displacement and conflict events have also destroyed infrastructure (>150 drone airstrikes in Bhamo district). Most big markets have been destroyed. Three townships have experienced large-scale asset depletion, two townships less so. Large loss of assets (at household and infrastructure level), category E.",
    dataSourceNames: [],
  },

  // ===== Utilization =====
  {
    id: "cf-16", name: "Water quantity (SPHERE)", section: "Utilization", alignment: 2, isKeyIndicator: false,
    guidanceQuestion: "How much drinking water is available per person per day?",
    phaseOptions: [
      { phase: 2, label: "More than 15L per person per day" },
      { phase: 3, label: "Less than 15L per person per day" },
      { phase: 4, label: "Less than 7.5L per person per day" },
      { phase: 5, label: "Less than 3L per person per day" },
    ],
    analysisText: "Specific liters per person/day are not provided, but evidence shows 98% of households report having enough drinking water sources. Category C, i.e. sufficient access to water.",
    dataSourceNames: ["Household had sufficient water for livestock - Kachin_1", "Households who did NOT have enough water to drink in the 4 weeks prior to data collection - Kachin_1", "Households reporting difficulties when storing food and water (source 1) - Kachin_1"],
  },
  {
    id: "cf-17", name: "Water sources", section: "Utilization", alignment: 2, isKeyIndicator: false,
    guidanceQuestion: "Do households have access to potable water sources and if yes, to what extent?",
    phaseOptions: [
      { phase: 2, label: "Large majority of households have access to safe water sources" },
      { phase: 3, label: "More than half of households have access to safe water sources" },
      { phase: 4, label: "Less than half of households have access to safe water sources" },
      { phase: 5, label: "Almost no-one has access to safe water sources" },
    ],
    analysisText: "85% report no difficulty in storing food and water (Yes, without any issue). Common water sources are boreholes, rainwater collection, springs. Category C = general access to safe water sources.",
    dataSourceNames: ["Household had sufficient water for livestock - Kachin_1", "Households who did NOT have enough water to drink in the 4 weeks prior to data collection - Kachin_1", "Households reporting difficulties when storing food and water (source 1) - Kachin_1"],
  },
  {
    id: "cf-18", name: "Fuel stocks", section: "Utilization", alignment: 4, isKeyIndicator: false,
    guidanceQuestion: "For how long are fuel stocks estimated to be available to cover basic needs?",
    phaseOptions: [
      { phase: 2, label: "Fuel stocks are enough for several months to cover basic needs" },
      { phase: 3, label: "Fuel stocks are enough for more than a month to cover basic needs" },
      { phase: 4, label: "Fuel stocks are enough for two weeks to one month to cover basic needs" },
      { phase: 5, label: "Fuel stocks are enough for less than two weeks to cover basic needs" },
    ],
    analysisText: "Two fuel stations are located in Kachin 1. However, no large stocks available, households purchase a few litres at a time. Category E = only small stocks are available.",
    dataSourceNames: ["Myanmar Average fuel prices change 2024-2025"],
  },
  {
    id: "cf-19", name: "Epidemic borne disease (water and food borne epidemics)", section: "Utilization", alignment: 2, isKeyIndicator: false,
    guidanceQuestion: "To what extent are epidemic borne diseases prevalent in the area and is the level of contagion above the historical average?",
    phaseOptions: [
      { phase: 2, label: "Confirmed outbreak or high level of contagion at or below the historical mean" },
      { phase: 3, label: "Confirmed outbreak or high level of contagion above the historical mean straining response capacity and service provisions" },
      { phase: 4, label: "Confirmed outbreak or extreme levels of contagion above the historical mean highly exceeding response capacity and service provision" },
      { phase: 5, label: "Confirmed outbreak or massive contagion levels that obstruct service provision" },
    ],
    analysisText: "No evidence of a disease outbreak or an epidemic. Category C.",
    dataSourceNames: [],
  },

  // ===== Hazards / Conflict Dimension =====
  {
    id: "cf-20", name: "Percentage of destroyed markets including (shops/etc.)", section: "Hazards / Conflict Dimension", alignment: 3, isKeyIndicator: false,
    guidanceQuestion: "What share of markets have been destroyed and made dysfunctional?",
    phaseOptions: [
      { phase: 2, label: "No or very limited damage" },
      { phase: 3, label: "Some have been damaged" },
      { phase: 4, label: "Most have been damaged" },
      { phase: 5, label: "Almost all/all have been damaged" },
    ],
    analysisText: "Some main markets have been destroyed = category D.",
    dataSourceNames: ["Households facing physical or social barriers to accessing marketplaces, by barrier - Kachin_1"],
  },
  {
    id: "cf-21", name: "Percentage of functional health facilities", section: "Hazards / Conflict Dimension", alignment: 4, isKeyIndicator: false,
    guidanceQuestion: "What percentage of health facilities have been destroyed and made dysfunctional?",
    phaseOptions: [
      { phase: 2, label: "No health facilities have been rendered dysfunctional" },
      { phase: 3, label: "A small share is not fully functional" },
      { phase: 4, label: "Majority is not fully functional" },
      { phase: 5, label: "No/almost no health facilities are fully functional" },
    ],
    analysisText: "31% of households reported not accessing medicine or treatment. 22% reported having no functional health facility. 14% can't afford health services. Most households only have access to primary care. Category E = majority is not fully functional (many health facilities exist but do not have full services). Many health facilities are not working due to the conflict.",
    dataSourceNames: ["Percentage of households by self-reported barriers to accessing health care - Kachin_1", "Health care facility access - Kachin_1"],
  },
  {
    id: "cf-22", name: "Percentage of people displaced", section: "Hazards / Conflict Dimension", alignment: 3, isKeyIndicator: true,
    guidanceQuestion: "What proportion of people have been displaced and forced to leave their habitual residence as a consequence of the conflict?",
    phaseOptions: [
      { phase: 2, label: "No or a small proportion of the population moved" },
      { phase: 3, label: "Less than half of the population moved" },
      { phase: 4, label: "Majority of the population moved" },
      { phase: 5, label: "Almost all/all population moved" },
    ],
    analysisText: "D = less than half of the population moved (no specific statistics are available for Kachin 1 - displacement has increased since 2024.",
    dataSourceNames: ["Number of People Internally Displaced Within Myanmar", "Myanmar Number of People Displaced since Feb 2021"],
  },
  {
    id: "cf-23", name: "Humanitarian corridors", section: "Hazards / Conflict Dimension", alignment: 2, isKeyIndicator: false,
    guidanceQuestion: "How long have humanitarian corridors been blocked for?",
    phaseOptions: [
      { phase: 2, label: "No blockade" },
      { phase: 3, label: "Blockade for less than two weeks" },
      { phase: 4, label: "Blockade for more than two weeks and less than a month" },
      { phase: 5, label: "Blockade for more than a month" },
    ],
    analysisText: "Category C = many humanitarian agencies do not work in Kachin 1 because of the security situation, but there are some agencies still present who are able to work and move within Kachin 1.",
    dataSourceNames: [],
  },
  {
    id: "cf-24", name: "Inflows of IDPs to the area", section: "Hazards / Conflict Dimension", alignment: 3, isKeyIndicator: false,
    guidanceQuestion: "To what extent has the inflow of IDPs increased over the period and compared to historical trends?",
    phaseOptions: [
      { phase: 2, label: "Reduction in number of IDPs" },
      { phase: 3, label: "Small or no increase compared to historical trends" },
      { phase: 4, label: "Moderate increase compared to historical trends" },
      { phase: 5, label: "Very large increase compared to historical trends" },
    ],
    analysisText: "No movement of IDPs into Kachin 1. Category D = no increase.",
    dataSourceNames: ["Myanmar IDP sites in Kachin State", "Number of People Internally Displaced Within Myanmar"],
  },
  {
    id: "cf-25", name: "Humanitarian access", section: "Hazards / Conflict Dimension", alignment: 5, isKeyIndicator: false,
    guidanceQuestion: "How long has humanitarian access been constrained for?",
    phaseOptions: [
      { phase: 2, label: "No or only short access constraints" },
      { phase: 3, label: "Access constraints for less than 2 months" },
      { phase: 4, label: "Access constraints for 2-4 months" },
      { phase: 5, label: "Access constraints for more than 4 months" },
    ],
    analysisText: "Access constraints depend on the military operations. In general access problems have persisted esp. since 2024, i.e. category F.",
    dataSourceNames: ["Myanmar Conflict after Earthquake 2025", "Fatalities from Conflict and Political Violence by Event Type - Kachin_1", "Event Counts from Conflict and Political Violence - Kachin_1", "Total Fatalities from Conflict and Political Violence - Kachin_1", "Myanmar Mining sites in Kachin State"],
  },
  {
    id: "cf-26", name: "Number of violent episodes", section: "Hazards / Conflict Dimension", alignment: 3, isKeyIndicator: true,
    guidanceQuestion: "To what extent has the occurrence of violent incidents increased compared to historical trends?",
    phaseOptions: [
      { phase: 2, label: "No increase or reduction in violent incidents compared to historical trends" },
      { phase: 3, label: "Small increase in violent incidents compared to historical trends" },
      { phase: 4, label: "Large increase in violent incidents compared to historical trends" },
      { phase: 5, label: "Very large increase in violent incidents compared to historical trends" },
    ],
    analysisText: "Levels of violent episodes and fatalities have slightly decreased since 2024. Levels are likely to be lower as conflict is focusing on certain areas (at the moment). Even if conflict events and fatalities have so far decreased compared to 2024, they are higher than in 2023. Category D.",
    dataSourceNames: ["Myanmar Conflict after Earthquake 2025", "Fatalities from Conflict and Political Violence by Event Type - Kachin_1", "Event Counts from Conflict and Political Violence - Kachin_1", "Total Fatalities from Conflict and Political Violence - Kachin_1", "Myanmar Mining sites in Kachin State"],
  },
  {
    id: "cf-27", name: "Access to roads for movement of goods and people", section: "Hazards / Conflict Dimension", alignment: 4, isKeyIndicator: false,
    guidanceQuestion: "What proportion of the roads are accessible in the area?",
    phaseOptions: [
      { phase: 2, label: "All or almost all roads are accessible" },
      { phase: 3, label: "Majority of the roads are accessible" },
      { phase: 4, label: "Less than half of the roads are accessible" },
      { phase: 5, label: "Only a small proportion of the roads are accessible" },
    ],
    analysisText: "Major transportation roads are blocked due to conflict. While markets remain functional, supply is constrained because of poor logistics and insecurity. Road access is therefore partially functional: some routes allow goods and people to move. No precise percentage of accessible roads is provided, but evidence indicates severe disruption. Category E, as roads that allow normal transport by 4-wheel vehicles are not widely available.",
    dataSourceNames: [],
  },

  // ===== Assistance =====
  {
    id: "cf-28", name: "Humanitarian assistance", section: "Assistance", alignment: 5, isKeyIndicator: true,
    guidanceQuestion: "To what extent has humanitarian assistance in the area been restricted?",
    phaseOptions: [
      { phase: 2, label: "Continued provision of humanitarian assistance; no restrictions" },
      { phase: 3, label: "Assistance provided in the last month" },
      { phase: 4, label: "Severe restrictions: some assistance provided over the past 6 months" },
      { phase: 5, label: "Zero or very limited assistance since the start of the shock" },
    ],
    analysisText: "0% in HFSA Table. No information available on potential assistance provided by the small agencies present in Kachin 1. Category E.",
    dataSourceNames: [],
  },
  {
    id: "cf-29", name: "In-kind food donations", section: "Assistance", alignment: null, isKeyIndicator: false,
    guidanceQuestion: "What proportion of the population's caloric needs are covered by humanitarian in-kind food donations?",
    phaseOptions: [
      { phase: 2, label: "More than 75% of caloric needs of the population" },
      { phase: 3, label: "Meet 50-75% of the caloric needs of the population" },
      { phase: 4, label: "Meet 25-50% of the caloric needs of the population" },
      { phase: 5, label: "Meet less than 25% of the caloric needs of the population" },
    ],
    analysisText: "No in-kind food assistance. Small food assistance programmes may exist but there is no further information. Only 4% of households reported receiving food assistance.",
    dataSourceNames: ["Kachin 1 Data.xlsx"],
  },

  // ===== Mortality =====
  {
    id: "cf-30", name: "Crude death rate due to any cause", section: "Mortality", alignment: null, isKeyIndicator: false,
    guidanceQuestion: "What is the current CDR in the area?",
    phaseOptions: [
      { phase: 2, label: ">0.5/10,000/day" },
      { phase: 3, label: "0.5-0.99/10,000/day" },
      { phase: 4, label: "1-1.99/10,000/day OR >2x reference" },
      { phase: 5, label: "≥2/10,000/day" },
    ],
    analysisText: "No information.",
    dataSourceNames: [],
  },

  // ===== Nutrition =====
  {
    id: "cf-31", name: "Nutrition vulnerability situation analysis", section: "Nutrition", alignment: null, isKeyIndicator: false,
    guidanceQuestion: "",
    phaseOptions: [
      { phase: 2, label: "No driver of high concern" },
      { phase: 3, label: "No driver of critical concern" },
      { phase: 4, label: "1-3 drivers are of critical concern" },
      { phase: 5, label: "At least 4 drivers are of critical concern" },
    ],
    analysisText: "NVA was not conducted.",
    dataSourceNames: [],
  },
  {
    id: "cf-32", name: "AMN classification", section: "Nutrition", alignment: null, isKeyIndicator: false,
    guidanceQuestion: "",
    phaseOptions: [],
    analysisText: "Indicative phase classification - Phase 2.",
    dataSourceNames: ["Kachin 1 Data.xlsx"],
  },
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
