import type { ConcernId, MedId, Profile } from "@/lib/profile";
import type { SourceRef } from "./questions";

export type IngredientGroup = "vitamin" | "mineral" | "fatty-acid" | "functional";

export const ingredientGroups: Record<IngredientGroup, string> = {
  vitamin: "비타민",
  mineral: "미네랄",
  "fatty-acid": "지방산",
  functional: "기능성 원료",
};

/**
 * 영양소는 한국인 영양소 섭취기준(2020)을 성인 기준으로 단순화해 사용한다.
 * 기능성 원료는 식약처 고시·인정 기준의 1일 섭취량 범위를 사용한다.
 */
export type Intake =
  | {
      kind: "kdri";
      label: "권장섭취량" | "충분섭취량";
      reference: (p: Profile) => number;
      upper?: (p: Profile) => number;
      upperNote?: string;
      summary: string;
    }
  | { kind: "functional"; min: number; max: number; basis: string };

export type Ingredient = {
  id: string;
  name: string;
  aliases: string[];
  group: IngredientGroup;
  unit: string;
  summary: string;
  functions: string[];
  intake: Intake;
  forms: { name: string; note: string }[];
  foods: string[];
  cautions: string[];
  medCautions: Partial<Record<MedId, string>>;
  concerns: ConcernId[];
  sources: SourceRef[];
};

const isOld = (p: Profile) => p.ageGroup === "50-64" || p.ageGroup === "65+";
const isPregnant = (p: Profile) => p.sex === "female" && p.pregnant;

export const ingredients: Ingredient[] = [
  {
    id: "vitamin-d",
    name: "비타민 D",
    aliases: ["비타민D", "콜레칼시페롤", "D3"],
    group: "vitamin",
    unit: "μg",
    summary: "햇빛을 받으면 피부에서 만들어지는 비타민으로, 칼슘 흡수와 뼈 건강에 관여합니다.",
    functions: [
      "칼슘과 인이 흡수되고 이용되는 데 필요",
      "뼈의 형성과 유지에 필요",
      "골다공증 발생 위험 감소에 도움",
    ],
    intake: {
      kind: "kdri",
      label: "충분섭취량",
      reference: (p) => (p.ageGroup === "65+" ? 15 : 10),
      upper: () => 100,
      summary: "성인 10 μg (65세 이상 15 μg) · 상한 100 μg",
    },
    forms: [
      { name: "D3 (콜레칼시페롤)", note: "동물성 유래로 보충제에 가장 흔히 쓰입니다." },
      { name: "D2 (에르고칼시페롤)", note: "식물·버섯 유래입니다." },
    ],
    foods: ["등푸른 생선", "달걀노른자", "햇빛에 말린 버섯"],
    cautions: [
      "지용성이라 몸에 쌓입니다. 여러 제품의 함량을 합산해 상한섭취량을 넘지 않게 하세요.",
      "라벨에 IU로 적혀 있다면 40 IU = 1 μg 입니다.",
    ],
    medCautions: {},
    concerns: ["bone"],
    sources: [
      { sourceId: "kdris", how: "비타민 D 충분섭취량·상한섭취량" },
      { sourceId: "ods", how: "Vitamin D 팩트시트" },
    ],
  },
  {
    id: "vitamin-c",
    name: "비타민 C",
    aliases: ["비타민C", "아스코르브산"],
    group: "vitamin",
    unit: "mg",
    summary: "수용성 항산화 비타민으로, 철 흡수와 결합조직 형성에 관여합니다.",
    functions: [
      "결합조직 형성과 기능 유지에 필요",
      "철의 흡수에 필요",
      "유해산소로부터 세포를 보호하는 데 필요",
    ],
    intake: {
      kind: "kdri",
      label: "권장섭취량",
      reference: () => 100,
      upper: () => 2000,
      summary: "성인 100 mg · 상한 2,000 mg",
    },
    forms: [
      { name: "아스코르브산", note: "가장 일반적인 형태입니다." },
      { name: "아스코르브산 칼슘·나트륨", note: "산도를 낮춘 완충형으로 위 자극이 적은 편입니다." },
    ],
    foods: ["파프리카", "브로콜리", "키위", "감귤류", "딸기"],
    cautions: [
      "많이 먹으면 설사·복부 불편이 생길 수 있습니다.",
      "흡연자는 필요량이 더 높다고 알려져 있습니다.",
    ],
    medCautions: {},
    concerns: ["antioxidant"],
    sources: [
      { sourceId: "kdris", how: "비타민 C 권장섭취량" },
      { sourceId: "ods", how: "Vitamin C 팩트시트" },
    ],
  },
  {
    id: "vitamin-a",
    name: "비타민 A",
    aliases: ["비타민A", "레티놀", "베타카로틴"],
    group: "vitamin",
    unit: "μg RAE",
    summary: "시각과 피부·점막 건강에 필요한 지용성 비타민입니다. 과다 섭취에 특히 주의해야 합니다.",
    functions: [
      "어두운 곳에서 시각 적응을 위해 필요",
      "피부와 점막을 형성하고 기능을 유지하는 데 필요",
      "상피세포의 성장과 발달에 필요",
    ],
    intake: {
      kind: "kdri",
      label: "권장섭취량",
      reference: (p) => {
        const base =
          p.sex === "male"
            ? isOld(p) ? (p.ageGroup === "65+" ? 700 : 750) : 800
            : isOld(p) ? 600 : 650;
        return isPregnant(p) ? base + 70 : base;
      },
      upper: () => 3000,
      upperNote: "레티놀(동물성) 형태 기준",
      summary: "성인 남 700~800 / 여 600~650 μg RAE · 상한 3,000 μg RAE",
    },
    forms: [
      { name: "레티놀·레티닐 에스테르", note: "바로 쓰이는 형태로, 상한섭취량 계산에 포함됩니다." },
      { name: "베타카로틴", note: "필요한 만큼 비타민 A로 바뀌는 전구체입니다." },
    ],
    foods: ["간", "달걀", "당근", "시금치", "고구마"],
    cautions: [
      "임신 중 레티놀 형태 과다 섭취는 태아에 해로울 수 있습니다.",
      "흡연자는 고용량 베타카로틴 보충제를 피하는 것이 권고됩니다.",
    ],
    medCautions: {},
    concerns: [],
    sources: [
      { sourceId: "kdris", how: "비타민 A 권장섭취량·상한섭취량" },
      { sourceId: "ods", how: "Vitamin A 팩트시트" },
    ],
  },
  {
    id: "vitamin-b12",
    name: "비타민 B12",
    aliases: ["비타민B12", "코발라민", "메틸코발라민", "시아노코발라민"],
    group: "vitamin",
    unit: "μg",
    summary: "주로 동물성 식품에 들어 있어 채식하는 사람에게 부족해지기 쉬운 비타민입니다.",
    functions: ["정상적인 엽산 대사에 필요"],
    intake: {
      kind: "kdri",
      label: "권장섭취량",
      reference: (p) => (isPregnant(p) ? 2.6 : 2.4),
      summary: "성인 2.4 μg · 상한섭취량 미설정",
    },
    forms: [
      { name: "시아노코발라민", note: "안정적이고 보충제에 널리 쓰입니다." },
      { name: "메틸코발라민", note: "체내 활성형 중 하나입니다." },
    ],
    foods: ["육류", "생선", "조개류", "달걀", "유제품"],
    cautions: ["나이가 들면 위산 감소로 식품 속 B12 흡수가 줄 수 있습니다."],
    medCautions: {
      diabetes: "메트포르민을 오래 복용하면 B12 수치가 낮아질 수 있다는 보고가 있어, 검사 여부를 의사와 상의해 보세요.",
    },
    concerns: [],
    sources: [
      { sourceId: "kdris", how: "비타민 B12 권장섭취량" },
      { sourceId: "ods", how: "Vitamin B12 팩트시트" },
    ],
  },
  {
    id: "folate",
    name: "엽산",
    aliases: ["폴산", "folic acid", "비타민B9"],
    group: "vitamin",
    unit: "μg DFE",
    summary: "세포 분열과 혈액 생성에 필요하며, 임신 초기 태아 신경관 발달에 특히 중요합니다.",
    functions: [
      "세포와 혈액 생성에 필요",
      "태아 신경관의 정상 발달에 필요",
      "혈액의 호모시스테인 수준을 정상으로 유지하는 데 필요",
    ],
    intake: {
      kind: "kdri",
      label: "권장섭취량",
      reference: (p) => (isPregnant(p) ? 620 : 400),
      upper: () => 1000,
      upperNote: "보충제·강화식품의 엽산 기준",
      summary: "성인 400 μg DFE (임신 620) · 상한 1,000 μg",
    },
    forms: [
      { name: "엽산(폴산)", note: "합성형으로 흡수율이 높습니다." },
      { name: "5-MTHF", note: "활성형 엽산입니다." },
    ],
    foods: ["시금치 등 녹색잎채소", "콩류", "아스파라거스"],
    cautions: ["고용량 엽산은 비타민 B12 결핍 증상을 가릴 수 있습니다."],
    medCautions: {},
    concerns: [],
    sources: [
      { sourceId: "kdris", how: "엽산 권장섭취량·상한섭취량" },
      { sourceId: "ods", how: "Folate 팩트시트" },
    ],
  },
  {
    id: "calcium",
    name: "칼슘",
    aliases: ["칼슘", "탄산칼슘", "구연산칼슘"],
    group: "mineral",
    unit: "mg",
    summary: "뼈와 치아를 이루는 주요 미네랄입니다. 한국인이 부족하기 쉬운 영양소 중 하나입니다.",
    functions: [
      "뼈와 치아 형성에 필요",
      "신경과 근육 기능 유지에 필요",
      "정상적인 혈액응고에 필요",
      "골다공증 발생 위험 감소에 도움",
    ],
    intake: {
      kind: "kdri",
      label: "권장섭취량",
      reference: (p) =>
        p.sex === "male"
          ? p.ageGroup === "65+" ? 700 : p.ageGroup === "50-64" ? 750 : 800
          : isOld(p) ? 800 : 700,
      upper: (p) => (isOld(p) ? 2000 : 2500),
      summary: "성인 700~800 mg · 상한 2,000~2,500 mg",
    },
    forms: [
      { name: "탄산칼슘", note: "칼슘 함량이 높고 저렴하지만, 식사와 함께 먹어야 흡수가 잘 됩니다." },
      { name: "구연산칼슘", note: "공복에도 흡수가 비교적 잘 되지만 알약이 커지기 쉽습니다." },
    ],
    foods: ["우유·요구르트", "멸치", "두부", "녹색잎채소"],
    cautions: [
      "한 번에 많이 먹기보다 나눠 먹는 편이 흡수에 유리합니다.",
      "철분과 함께 먹으면 서로 흡수를 방해할 수 있습니다.",
    ],
    medCautions: {
      thyroid: "갑상선 호르몬제 흡수를 떨어뜨릴 수 있어 복용 간격(보통 4시간 이상)을 두는 것이 권고됩니다.",
    },
    concerns: ["bone"],
    sources: [
      { sourceId: "kdris", how: "칼슘 권장섭취량·상한섭취량" },
      { sourceId: "ods", how: "Calcium 팩트시트" },
    ],
  },
  {
    id: "iron",
    name: "철",
    aliases: ["철분", "헴철", "푸마르산철"],
    group: "mineral",
    unit: "mg",
    summary: "혈액이 산소를 운반하는 데 필요합니다. 가임기 여성과 임신부는 필요량이 높습니다.",
    functions: ["체내 산소 운반과 혈액 생성에 필요", "에너지 생성에 필요"],
    intake: {
      kind: "kdri",
      label: "권장섭취량",
      reference: (p) => {
        if (isPregnant(p)) return 24;
        if (p.sex === "male") return p.ageGroup === "65+" ? 9 : 10;
        return isOld(p) ? 8 : 14;
      },
      upper: () => 45,
      summary: "성인 남 9~10 mg / 여 8~14 mg (임신 24) · 상한 45 mg",
    },
    forms: [
      { name: "헴철", note: "동물성 유래로 흡수율이 높습니다." },
      { name: "비헴철 (푸마르산철, 황산철 등)", note: "비타민 C와 함께 먹으면 흡수가 늘어납니다." },
    ],
    foods: ["붉은 고기", "간", "조개류", "콩류", "시금치"],
    cautions: [
      "변비·속쓰림 등 위장 불편이 흔합니다.",
      "피로가 철 결핍 때문인지는 혈액검사로 확인하는 것이 정확합니다.",
    ],
    medCautions: {
      thyroid: "갑상선 호르몬제 흡수를 떨어뜨릴 수 있어 복용 간격(보통 4시간 이상)을 두는 것이 권고됩니다.",
    },
    concerns: [],
    sources: [
      { sourceId: "kdris", how: "철 권장섭취량·상한섭취량" },
      { sourceId: "ods", how: "Iron 팩트시트" },
    ],
  },
  {
    id: "zinc",
    name: "아연",
    aliases: ["아연", "글루콘산아연"],
    group: "mineral",
    unit: "mg",
    summary: "면역 기능과 세포 분열에 관여하는 미네랄입니다.",
    functions: ["정상적인 면역 기능에 필요", "정상적인 세포 분열에 필요"],
    intake: {
      kind: "kdri",
      label: "권장섭취량",
      reference: (p) => {
        const base = p.sex === "male" ? (p.ageGroup === "65+" ? 9 : 10) : p.ageGroup === "65+" ? 7 : 8;
        return isPregnant(p) ? base + 2.5 : base;
      },
      upper: () => 35,
      summary: "성인 남 9~10 / 여 7~8 mg · 상한 35 mg",
    },
    forms: [
      { name: "글루콘산아연", note: "보충제에 흔히 쓰입니다." },
      { name: "산화아연", note: "아연 함량이 높은 형태입니다." },
    ],
    foods: ["굴", "붉은 고기", "견과류", "콩류"],
    cautions: ["장기간 고용량 섭취는 구리 결핍을 일으킬 수 있습니다."],
    medCautions: {},
    concerns: ["immune"],
    sources: [
      { sourceId: "kdris", how: "아연 권장섭취량·상한섭취량" },
      { sourceId: "ods", how: "Zinc 팩트시트" },
    ],
  },
  {
    id: "magnesium",
    name: "마그네슘",
    aliases: ["마그네슘", "산화마그네슘", "구연산마그네슘"],
    group: "mineral",
    unit: "mg",
    summary: "에너지 대사와 신경·근육 기능에 관여합니다. 형태에 따라 흡수율과 위장 반응이 다릅니다.",
    functions: ["에너지 이용에 필요", "신경과 근육 기능 유지에 필요"],
    intake: {
      kind: "kdri",
      label: "권장섭취량",
      reference: (p) => {
        const base = p.sex === "male" ? (p.ageGroup === "19-29" ? 360 : 370) : 280;
        return isPregnant(p) ? base + 40 : base;
      },
      upper: () => 350,
      upperNote: "식품이 아닌 보충제로 먹는 양 기준",
      summary: "성인 남 360~370 / 여 280 mg · 보충제 상한 350 mg",
    },
    forms: [
      { name: "산화마그네슘", note: "함량은 높지만 흡수율이 낮고 설사를 일으키기 쉽습니다." },
      { name: "구연산·글리시네이트 등", note: "흡수율이 비교적 높은 형태로 알려져 있습니다." },
    ],
    foods: ["견과류", "통곡물", "녹색잎채소", "콩류"],
    cautions: ["보충제로 많이 먹으면 설사가 흔합니다.", "신장 질환이 있다면 의사와 상의하세요."],
    medCautions: {},
    concerns: [],
    sources: [
      { sourceId: "kdris", how: "마그네슘 권장섭취량·상한섭취량" },
      { sourceId: "ods", how: "Magnesium 팩트시트" },
    ],
  },
  {
    id: "omega-3",
    name: "오메가-3 (EPA·DHA)",
    aliases: ["오메가3", "피쉬오일", "EPA", "DHA", "rTG"],
    group: "fatty-acid",
    unit: "mg",
    summary: "생선 기름에 많은 지방산입니다. 라벨의 ‘오메가-3 함량’보다 EPA+DHA 합계를 보세요.",
    functions: [
      "혈중 중성지질 개선·혈행 개선에 도움",
      "건조한 눈을 개선하여 눈 건강에 도움",
    ],
    intake: { kind: "functional", min: 500, max: 2000, basis: "EPA+DHA 합계 (혈중 중성지질·혈행 기준)" },
    forms: [
      { name: "rTG", note: "재에스테르화 트리글리세리드로 고농축 제품에 많습니다." },
      { name: "EE", note: "에틸에스테르 형태로 저렴한 편이며, 식사와 함께 먹으면 흡수가 좋아집니다." },
      { name: "식물성(조류) 오일", note: "채식하는 사람을 위한 DHA 공급원입니다." },
    ],
    foods: ["고등어", "연어", "꽁치", "정어리"],
    cautions: ["산패된 제품은 비린내가 심합니다. 보관과 소비기한을 확인하세요."],
    medCautions: {
      anticoagulant: "출혈 경향이 커질 수 있어 섭취에 주의가 필요합니다 (식약처 섭취 시 주의사항).",
      bp: "혈압강하제 복용 시 섭취에 주의가 필요합니다 (식약처 섭취 시 주의사항).",
    },
    concerns: ["blood", "eye"],
    sources: [
      { sourceId: "foodsafety", how: "기능성 원료 ‘EPA 및 DHA 함유 유지’ 인정 내용" },
      { sourceId: "ods", how: "Omega-3 Fatty Acids 팩트시트" },
    ],
  },
  {
    id: "lutein",
    name: "루테인",
    aliases: ["마리골드꽃추출물", "루테인지아잔틴"],
    group: "functional",
    unit: "mg",
    summary: "눈의 황반에 모이는 색소 성분입니다. 나이가 들며 줄어드는 황반색소 밀도 유지에 관여합니다.",
    functions: ["노화로 인해 감소될 수 있는 황반색소밀도를 유지하여 눈 건강에 도움"],
    intake: { kind: "functional", min: 10, max: 20, basis: "루테인 기준" },
    forms: [
      { name: "루테인", note: "마리골드꽃 추출물에서 얻는 경우가 많습니다." },
      { name: "루테인지아잔틴 복합추출물", note: "지아잔틴을 함께 담은 별도 인정 원료입니다." },
    ],
    foods: ["케일", "시금치", "옥수수", "달걀노른자"],
    cautions: ["흡연자는 베타카로틴이 함께 든 복합 제품인지 확인하세요."],
    medCautions: {},
    concerns: ["eye"],
    sources: [
      { sourceId: "foodsafety", how: "기능성 원료 ‘마리골드꽃추출물’ 인정 내용" },
      { sourceId: "medlineplus", how: "Lutein 정보" },
    ],
  },
  {
    id: "probiotics",
    name: "프로바이오틱스",
    aliases: ["유산균", "비피더스", "락토바실러스"],
    group: "functional",
    unit: "억 CFU",
    summary: "장에 도움이 되는 살아 있는 균입니다. 균수는 ‘제조 시’가 아니라 ‘소비기한까지 보장’ 기준을 보세요.",
    functions: ["유산균 증식 및 유해균 억제에 도움", "배변 활동 원활에 도움"],
    intake: { kind: "functional", min: 1, max: 100, basis: "1억~100억 CFU" },
    forms: [
      { name: "균주명 표기", note: "같은 유산균이라도 균주마다 연구 결과가 다릅니다." },
      { name: "프리바이오틱스 동시 함유", note: "유산균의 먹이가 되는 성분을 함께 넣은 제품입니다." },
    ],
    foods: ["요구르트", "김치", "된장 등 발효식품"],
    cautions: ["면역 기능이 크게 떨어진 경우 의사와 상의하세요.", "보관 조건(냉장 여부)을 확인하세요."],
    medCautions: {},
    concerns: ["gut"],
    sources: [
      { sourceId: "foodsafety", how: "기능성 원료 ‘프로바이오틱스’ 고시 내용" },
      { sourceId: "medlineplus", how: "Probiotics 정보" },
    ],
  },
  {
    id: "red-ginseng",
    name: "홍삼",
    aliases: ["진세노사이드", "인삼"],
    group: "functional",
    unit: "mg",
    summary: "진세노사이드(Rg1, Rb1, Rg3) 함량으로 표시되는 대표적 건강기능식품 원료입니다.",
    functions: [
      "면역력 증진에 도움",
      "피로 개선에 도움",
      "혈소판 응집 억제를 통한 혈액 흐름에 도움",
      "기억력 개선에 도움",
      "항산화에 도움",
    ],
    intake: { kind: "functional", min: 3, max: 80, basis: "진세노사이드 Rg1+Rb1+Rg3 합계" },
    forms: [
      { name: "농축액·스틱", note: "진세노사이드 함량을 1일 섭취량 기준으로 비교하세요." },
      { name: "정제·캡슐", note: "휴대가 편하지만 함량 차이가 큽니다." },
    ],
    foods: [],
    cautions: ["불면, 두근거림 등이 생기면 섭취를 줄이거나 중단하세요."],
    medCautions: {
      anticoagulant: "혈액 항응고제 복용 시 섭취에 주의가 필요합니다 (식약처 섭취 시 주의사항).",
      diabetes: "당뇨 치료제 복용 시 섭취에 주의가 필요합니다 (식약처 섭취 시 주의사항).",
    },
    concerns: ["immune", "fatigue", "blood"],
    sources: [
      { sourceId: "foodsafety", how: "기능성 원료 ‘홍삼’ 고시 내용" },
      { sourceId: "medlineplus", how: "Asian Ginseng 정보" },
    ],
  },
  {
    id: "milk-thistle",
    name: "밀크씨슬 (실리마린)",
    aliases: ["밀크시슬", "실리마린", "엉겅퀴"],
    group: "functional",
    unit: "mg",
    summary: "밀크씨슬 추출물의 실리마린 함량으로 표시되는 간 건강 원료입니다.",
    functions: ["간 건강에 도움"],
    intake: { kind: "functional", min: 130, max: 130, basis: "실리마린 기준" },
    forms: [{ name: "밀크씨슬 추출물", note: "추출물 무게가 아니라 실리마린 함량을 확인하세요." }],
    foods: [],
    cautions: [
      "국화과 식물 알레르기가 있다면 주의하세요.",
      "간 수치 이상 등 간 질환이 있다면 먼저 진료를 받으세요.",
    ],
    medCautions: {},
    concerns: ["liver"],
    sources: [
      { sourceId: "foodsafety", how: "기능성 원료 ‘밀크씨슬 추출물’ 인정 내용" },
      { sourceId: "medlineplus", how: "Milk Thistle 정보" },
    ],
  },
  {
    id: "coq10",
    name: "코엔자임 Q10",
    aliases: ["코큐텐", "CoQ10", "유비퀴논"],
    group: "functional",
    unit: "mg",
    summary: "세포의 에너지 생산에 관여하는 성분으로, 항산화와 혈압 관련 기능성이 인정되었습니다.",
    functions: ["항산화에 도움", "높은 혈압 감소에 도움"],
    intake: { kind: "functional", min: 90, max: 100, basis: "코엔자임Q10 기준" },
    forms: [
      { name: "유비퀴논", note: "일반적인 형태입니다." },
      { name: "유비퀴놀", note: "환원형으로 가격이 높은 편입니다." },
    ],
    foods: ["육류", "생선", "견과류"],
    cautions: ["지용성이라 식사와 함께 먹으면 흡수에 유리합니다."],
    medCautions: {
      anticoagulant: "와파린의 효과를 떨어뜨릴 수 있다는 보고가 있어 의사·약사와 상의하세요.",
      bp: "혈압약과 함께 먹으면 혈압이 더 내려갈 수 있어 상의가 필요합니다.",
    },
    concerns: ["antioxidant", "bp"],
    sources: [
      { sourceId: "foodsafety", how: "기능성 원료 ‘코엔자임Q10’ 고시 내용" },
      { sourceId: "medlineplus", how: "Coenzyme Q10 정보" },
    ],
  },
];

export function getIngredient(id: string) {
  return ingredients.find((i) => i.id === id);
}

export function formatAmount(value: number, unit: string) {
  return `${value.toLocaleString("ko-KR", { maximumFractionDigits: 1 })} ${unit}`;
}

/** 섭취 기준을 사람이 읽는 문장으로. 프로필이 있으면 그 사람 기준 값. */
export function describeIntake(ing: Ingredient, p?: Profile) {
  const { intake, unit } = ing;
  if (intake.kind === "functional") {
    const range =
      intake.min === intake.max
        ? formatAmount(intake.min, unit)
        : `${intake.min.toLocaleString("ko-KR")}~${formatAmount(intake.max, unit)}`;
    return { target: `1일 ${range}`, upper: undefined, basis: intake.basis };
  }
  if (!p) return { target: intake.summary, upper: undefined, basis: "한국인 영양소 섭취기준(2020) 성인" };
  const upper = intake.upper?.(p);
  return {
    target: `${intake.label} ${formatAmount(intake.reference(p), unit)}`,
    upper: upper ? `상한섭취량 ${formatAmount(upper, unit)}${intake.upperNote ? ` (${intake.upperNote})` : ""}` : undefined,
    basis: "한국인 영양소 섭취기준(2020)",
  };
}
