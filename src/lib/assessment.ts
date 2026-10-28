import { ingredients, type Ingredient } from "@/data/ingredients";
import { concernLabels, medLabels, type MedId, type Profile } from "./profile";

export type Signal = { reason: string; weight: number };

export type NutrientResult = {
  ingredient: Ingredient;
  score: number;
  level: "high" | "medium" | "low";
  signals: Signal[];
};

export type Recommendation = {
  ingredient: Ingredient;
  score: number;
  reasons: string[];
  cautions: string[];
};

export type Assessment = {
  nutrients: NutrientResult[];
  recommendations: Recommendation[];
  medNotes: { med: MedId; label: string; notes: { ingredient: Ingredient; text: string }[] }[];
  lifestyle: string[];
  scores: { label: string; value: number; note: string }[];
};

/** 설문 응답에서 영양소별 ‘부족 가능성’ 신호를 모은다. 가중치는 신호의 강도(1~3). */
function collectSignals(p: Profile): Record<string, Signal[]> {
  const s: Record<string, Signal[]> = {};
  const add = (id: string, reason: string, weight: number) => (s[id] ??= []).push({ reason, weight });
  const pregnant = p.sex === "female" && p.pregnant;

  if (p.sunLow) add("vitamin-d", "실내 생활이 많아 햇빛 노출이 적음", 2);
  if (p.ageGroup === "65+") add("vitamin-d", "65세 이상은 피부의 비타민 D 합성이 줄어듦", 1);
  if (p.fish === "rare") add("vitamin-d", "생선 섭취가 적음", 1);

  if (p.dairy === "rare") add("calcium", "유제품 섭취가 적음", 2);
  if (p.diet === "vegan") add("calcium", "비건 식단", 1);
  if (p.sex === "female" && (p.ageGroup === "50-64" || p.ageGroup === "65+"))
    add("calcium", "50세 이상 여성은 칼슘 필요량이 높음", 1);

  if (pregnant) add("iron", "임신 중 철 필요량이 크게 늘어남", 3);
  else if (p.sex === "female" && (p.ageGroup === "19-29" || p.ageGroup === "30-49"))
    add("iron", "가임기 여성은 철 필요량이 높음", 1);
  if (p.diet !== "omnivore") add("iron", "채식 위주 식단 (흡수율 높은 헴철 섭취가 적음)", 1);

  if (p.diet === "vegan") add("vitamin-b12", "비건 식단 (B12는 주로 동물성 식품에 있음)", 3);
  if (p.diet === "vegetarian") add("vitamin-b12", "채식 위주 식단", 1);
  if (p.ageGroup === "65+") add("vitamin-b12", "나이가 들면 식품 속 B12 흡수가 줄어듦", 1);
  if (p.meds.includes("diabetes")) add("vitamin-b12", "일부 당뇨약(메트포르민) 장기 복용 시 B12 저하 보고", 1);

  if (pregnant) add("folate", "임신 중 엽산 필요량이 늘어남", 3);
  if (p.alcohol === "often") add("folate", "잦은 음주는 엽산 흡수·이용을 방해함", 1);

  if (p.fish === "rare") add("omega-3", "생선 섭취가 적음", 2);

  if (p.diet !== "omnivore") add("zinc", "채식 위주 식단", 1);
  if (p.alcohol === "often") add("zinc", "잦은 음주", 1);

  if (p.alcohol === "often") add("magnesium", "잦은 음주는 마그네슘 배출을 늘림", 1);

  if (p.smoking) add("vitamin-c", "흡연자는 비타민 C 필요량이 더 높음", 2);

  return s;
}

export function assess(p: Profile): Assessment {
  const signals = collectSignals(p);

  const nutrients: NutrientResult[] = ingredients
    .filter((i) => i.intake.kind === "kdri" || signals[i.id])
    .map((ingredient) => {
      const list = signals[ingredient.id] ?? [];
      const score = list.reduce((sum, x) => sum + x.weight, 0);
      const level: NutrientResult["level"] = score >= 3 ? "high" : score >= 1 ? "medium" : "low";
      return { ingredient, score, level, signals: list };
    })
    .sort((a, b) => b.score - a.score);

  const recommendations: Recommendation[] = ingredients
    .map((ingredient) => {
      const reasons: string[] = [];
      let score = 0;
      for (const sig of signals[ingredient.id] ?? []) {
        reasons.push(sig.reason);
        score += sig.weight;
      }
      for (const c of p.concerns) {
        if (ingredient.concerns.includes(c)) {
          reasons.push(`관심 분야 ‘${concernLabels[c]}’ 관련 식약처 인정 기능성`);
          score += 2;
        }
      }
      const cautions = p.meds
        .map((m) => ingredient.medCautions[m])
        .filter((t): t is string => !!t);
      if (p.sex === "female" && p.pregnant && ingredient.id === "vitamin-a")
        cautions.push("임신 중 레티놀 형태 과다 섭취 주의");
      return { ingredient, score, reasons, cautions };
    })
    .filter((r) => r.score > 0)
    // 상호작용 주의가 있는 성분은 같은 점수라도 뒤로
    .sort((a, b) => b.score - a.score || a.cautions.length - b.cautions.length)
    .slice(0, 6);

  const medNotes = p.meds.map((med) => ({
    med,
    label: medLabels[med],
    notes: ingredients
      .filter((i) => i.medCautions[med])
      .map((ingredient) => ({ ingredient, text: ingredient.medCautions[med]! })),
  }));

  const lifestyle: string[] = [];
  if (p.sunLow) lifestyle.push("하루 중 잠깐이라도 햇빛을 쬐는 시간을 만들어 보세요.");
  if (p.fish === "rare") lifestyle.push("등푸른 생선을 주 2회 정도 식단에 넣어보세요.");
  if (p.dairy === "rare") lifestyle.push("우유·요구르트·두부·멸치처럼 칼슘이 많은 식품을 늘려보세요.");
  if (p.alcohol === "often") lifestyle.push("잦은 음주는 여러 영양소의 흡수와 이용을 방해합니다.");
  if (p.smoking) lifestyle.push("흡연은 항산화 영양소 소모를 늘립니다. 금연 상담(보건소)도 고려해 보세요.");
  if (p.sex === "female" && p.pregnant)
    lifestyle.push("임신·수유 중에는 어떤 영양제든 담당 의사와 먼저 상의하세요.");

  // 종합 점수: 100에서 신호·위험 요인만큼 감점 (단순 참고 지표)
  const totalSignal = nutrients.reduce((sum, n) => sum + n.score, 0);
  const dietScore = Math.max(
    0,
    100 - (p.fish === "rare" ? 20 : 0) - (p.dairy === "rare" ? 20 : 0) - (p.diet === "vegan" ? 20 : p.diet === "vegetarian" ? 10 : 0),
  );
  const lifeScore = Math.max(
    0,
    100 - (p.sunLow ? 25 : 0) - (p.alcohol === "often" ? 25 : p.alcohol === "sometimes" ? 5 : 0) - (p.smoking ? 30 : 0),
  );
  const nutrientScore = Math.max(0, 100 - totalSignal * 6);
  const medCount = medNotes.reduce((sum, m) => sum + m.notes.length, 0);

  const scores = [
    { label: "식습관", value: dietScore, note: "생선·유제품·식단 유형 기준" },
    { label: "생활습관", value: lifeScore, note: "햇빛·음주·흡연 기준" },
    { label: "영양 충족도", value: nutrientScore, note: "부족 가능성 신호가 적을수록 높음" },
  ];

  if (p.meds.length > 0)
    lifestyle.unshift(
      `복용 중인 약과 관련해 확인할 성분이 ${medCount}개 있습니다. 영양제를 고르기 전에 약사와 상담하세요.`,
    );

  return { nutrients, recommendations, medNotes, lifestyle, scores };
}
