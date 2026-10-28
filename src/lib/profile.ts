export type AgeGroup = "19-29" | "30-49" | "50-64" | "65+";
export type Sex = "male" | "female";
export type Diet = "omnivore" | "vegetarian" | "vegan";
export type Frequency = "rare" | "sometimes" | "often";

export type ConcernId =
  | "eye"
  | "bone"
  | "gut"
  | "liver"
  | "blood"
  | "immune"
  | "fatigue"
  | "antioxidant"
  | "bp";

export type MedId = "anticoagulant" | "diabetes" | "thyroid" | "bp" | "other";

export type Profile = {
  ageGroup: AgeGroup;
  sex: Sex;
  pregnant: boolean;
  diet: Diet;
  fish: Frequency;
  dairy: Frequency;
  sunLow: boolean;
  alcohol: Frequency;
  smoking: boolean;
  concerns: ConcernId[];
  meds: MedId[];
};

export const defaultProfile: Profile = {
  ageGroup: "30-49",
  sex: "female",
  pregnant: false,
  diet: "omnivore",
  fish: "sometimes",
  dairy: "sometimes",
  sunLow: false,
  alcohol: "sometimes",
  smoking: false,
  concerns: [],
  meds: [],
};

export const ageLabels: Record<AgeGroup, string> = {
  "19-29": "19~29세",
  "30-49": "30~49세",
  "50-64": "50~64세",
  "65+": "65세 이상",
};

export const concernLabels: Record<ConcernId, string> = {
  eye: "눈 건강",
  bone: "뼈 건강",
  gut: "장 건강",
  liver: "간 건강",
  blood: "혈행·혈중 지질",
  immune: "면역",
  fatigue: "피로",
  antioxidant: "항산화",
  bp: "혈압",
};

export const medLabels: Record<MedId, string> = {
  anticoagulant: "항응고제·항혈소판제 (와파린, 아스피린 등)",
  diabetes: "당뇨약",
  thyroid: "갑상선 호르몬제",
  bp: "혈압약",
  other: "기타 처방약",
};

export function describeProfile(p: Profile) {
  const parts = [ageLabels[p.ageGroup], p.sex === "male" ? "남성" : "여성"];
  if (p.pregnant) parts.push("임신·수유 중");
  return parts.join(" · ");
}
