export type CategoryId =
  | "effect"
  | "safety"
  | "interaction"
  | "dose"
  | "quality"
  | "label"
  | "buying";

export const categories: { id: CategoryId; label: string; emoji: string }[] = [
  { id: "effect", label: "효과·근거", emoji: "🔬" },
  { id: "safety", label: "안전성·부작용", emoji: "⚠️" },
  { id: "interaction", label: "약·영양제 같이 먹기", emoji: "💊" },
  { id: "dose", label: "섭취량·섭취법", emoji: "⏰" },
  { id: "quality", label: "제품 진위·품질", emoji: "✅" },
  { id: "label", label: "라벨·광고 읽기", emoji: "🏷️" },
  { id: "buying", label: "구매·해외직구", emoji: "🛒" },
];

export type SourceRef = {
  sourceId: string;
  /** 이 질문에서 해당 사이트의 어디를 보면 되는지 */
  how: string;
};

export type Question = {
  id: string;
  category: CategoryId;
  title: string;
  summary: string;
  checks: string[];
  where: SourceRef[];
  caution?: string;
  keywords: string[];
};

export const questions: Question[] = [
  {
    id: "is-it-effective",
    category: "effect",
    title: "이 영양제, 정말 효과가 있나요?",
    summary:
      "먼저 식약처가 인정한 기능성인지 확인하고, 그 다음 사람 대상 연구가 얼마나 쌓였는지 봅니다. 광고 문구보다 근거의 수준이 중요합니다.",
    checks: [
      "제품에 적힌 기능성 문구가 식약처 인정 내용과 같은지 (예: ‘~에 도움을 줄 수 있음’)",
      "근거가 사람 대상 연구인지, 동물·세포 실험뿐인지",
      "여러 연구를 종합한 메타분석·체계적 문헌고찰이 있는지",
      "연구 대상(나이, 결핍 여부 등)이 나와 비슷한지",
    ],
    where: [
      { sourceId: "foodsafety", how: "건강기능식품 > 기능성 원료 정보에서 원료명으로 인정 기능성 확인" },
      { sourceId: "ods", how: "성분명 팩트시트에서 효과 관련 연구 요약 읽기" },
      { sourceId: "examine", how: "성분 페이지에서 건강 목표별 근거 수준 확인" },
      { sourceId: "cochrane", how: "성분명으로 검색해 체계적 문헌고찰이 있는지 보기" },
    ],
    caution: "‘결핍이 없는 사람’에게는 효과가 미미한 경우가 많습니다. 내게 정말 부족한지가 먼저입니다.",
    keywords: ["효과", "근거", "논문", "기능성", "인정"],
  },
  {
    id: "ingredient-form",
    category: "effect",
    title: "같은 성분인데 형태(산화물, 구연산염 등)는 왜 다르죠?",
    summary:
      "미네랄은 다른 물질과 결합한 형태로 들어가며, 형태에 따라 흡수율과 실제 미네랄 함량, 위장 부담이 달라집니다.",
    checks: [
      "원료명에 적힌 형태 (예: 산화마그네슘, 구연산마그네슘)",
      "라벨의 함량이 ‘원료 무게’가 아니라 ‘미네랄 자체 함량’ 기준인지",
      "해당 형태의 흡수율·위장 부작용 관련 정보",
    ],
    where: [
      { sourceId: "ods", how: "미네랄 팩트시트의 ‘형태(forms)’ 항목 확인" },
      { sourceId: "examine", how: "성분 페이지에서 형태별 차이 설명 확인" },
    ],
    keywords: ["흡수율", "형태", "마그네슘", "킬레이트", "원료"],
  },
  {
    id: "health-functional-vs-general",
    category: "label",
    title: "‘건강기능식품’과 일반 ‘건강식품’은 뭐가 다른가요?",
    summary:
      "건강기능식품은 식약처가 기능성과 안전성을 인정한 원료로 만든 제품이고, 포장에 ‘건강기능식품’ 문구와 인증마크가 있습니다. 그 외 이른바 ‘건강식품’은 일반 식품입니다.",
    checks: [
      "포장에 ‘건강기능식품’ 문구와 인증마크가 있는지",
      "일반식품인데 기능성을 표시했다면 ‘본 제품은 건강기능식품이 아닙니다’ 문구가 있는지",
      "기능성 원료와 그 함량이 표시되어 있는지",
    ],
    where: [
      { sourceId: "foodsafety", how: "제품명으로 검색해 건강기능식품으로 신고된 제품인지 확인" },
      { sourceId: "mfds", how: "건강기능식품 표시 기준 안내 확인" },
    ],
    keywords: ["건강기능식품", "건강식품", "인증마크", "일반식품", "차이"],
  },
  {
    id: "genuine-product",
    category: "quality",
    title: "정식으로 신고된 제품인지 어떻게 확인하나요?",
    summary:
      "국내에서 정식으로 제조·수입된 건강기능식품은 식품안전나라에서 제품 정보를 조회할 수 있습니다. 조회되지 않는다면 한 번 더 의심해 보세요.",
    checks: [
      "제조사(또는 수입사)와 제품명이 조회되는지",
      "포장에 한글 표시사항이 있는지 (수입 제품 포함)",
      "GMP(우수건강기능식품 제조기준) 적용 여부",
    ],
    where: [
      { sourceId: "foodsafety", how: "건강기능식품 제품 검색에서 제품명·업체명으로 조회" },
      { sourceId: "pharmacist", how: "구매처가 불분명하면 약국에서 동일 성분 정식 제품을 문의" },
    ],
    keywords: ["정품", "신고", "GMP", "가짜", "제조사", "수입"],
  },
  {
    id: "recall",
    category: "safety",
    title: "회수·판매중지된 제품인지 알 수 있나요?",
    summary:
      "기준 위반으로 회수되거나 판매가 중지된 제품은 공개됩니다. 이미 가지고 있는 제품도 제조일자·유통기한까지 대조해 보세요.",
    checks: [
      "제품명과 함께 제조일자·유통기한(로트)까지 일치하는지",
      "회수 사유 (기준 초과, 표시 위반, 이물 등)",
      "해외 제품이라면 해외 리콜 이력",
    ],
    where: [
      { sourceId: "foodsafety", how: "회수·판매중지 정보 메뉴에서 제품명 검색" },
      { sourceId: "consumer24", how: "리콜 정보 통합 검색 (해외 리콜 포함)" },
    ],
    keywords: ["회수", "리콜", "판매중지", "위반"],
  },
  {
    id: "daily-dose",
    category: "dose",
    title: "하루에 얼마나 먹어야 하나요?",
    summary:
      "기본은 제품에 표시된 1일 섭취량입니다. 내 나이·성별의 권장섭취량과 비교하면 이 제품이 얼마나 채워 주는지 알 수 있습니다.",
    checks: [
      "제품의 1일 섭취량과 1회 섭취량",
      "영양성분기준치 대비 % 표시",
      "내 나이·성별의 권장섭취량 (식사로 이미 먹는 양 고려)",
    ],
    where: [
      { sourceId: "kdris", how: "한국인 영양소 섭취기준에서 영양소별 권장섭취량 확인" },
      { sourceId: "foodsafety", how: "기능성 원료 정보에서 인정된 일일섭취량 범위 확인" },
    ],
    keywords: ["섭취량", "용량", "하루", "권장량", "mg"],
  },
  {
    id: "upper-limit",
    category: "safety",
    title: "많이 먹으면 위험한가요? (상한섭취량)",
    summary:
      "비타민 A·D 같은 지용성 비타민과 철, 아연, 셀레늄 등 미네랄은 상한섭취량이 정해져 있습니다. 여러 제품을 먹는다면 같은 성분을 모두 더해서 보세요.",
    checks: [
      "먹고 있는 모든 제품에서 같은 성분의 양을 합산",
      "합산량이 상한섭취량을 넘지 않는지",
      "과다 섭취 시 나타나는 증상",
    ],
    where: [
      { sourceId: "kdris", how: "영양소별 상한섭취량 표 확인" },
      { sourceId: "ods", how: "팩트시트의 ‘Health Risks from Excessive’ 항목 확인" },
    ],
    caution: "종합비타민 + 단일 비타민을 함께 먹을 때 중복으로 상한을 넘는 경우가 흔합니다.",
    keywords: ["과다", "상한", "독성", "비타민D", "비타민A", "철분"],
  },
  {
    id: "drug-interaction",
    category: "interaction",
    title: "복용 중인 약과 같이 먹어도 되나요?",
    summary:
      "일부 영양제는 약의 효과를 높이거나 떨어뜨립니다. 예를 들어 항응고제는 비타민 K·오메가-3·은행잎 등과, 갑상선 호르몬제는 칼슘·철분과 함께 먹을 때 주의가 필요합니다.",
    checks: [
      "복용 중인 약의 성분명 (상품명이 아닌 성분)",
      "영양제 성분과 해당 약 성분의 상호작용 여부",
      "같이 먹어야 한다면 복용 간격",
    ],
    where: [
      { sourceId: "nedrug", how: "복용 중인 약을 검색해 성분과 사용상 주의사항 확인" },
      { sourceId: "medlineplus", how: "영양제 성분 페이지의 ‘Interactions with medications’ 확인" },
      { sourceId: "ods", how: "팩트시트의 ‘Interactions with Medications’ 확인" },
      { sourceId: "pharmacist", how: "약 봉투와 영양제를 함께 가져가 상담" },
    ],
    caution: "처방약을 먹고 있다면 온라인 정보보다 약사·의사 상담을 우선하세요.",
    keywords: ["약", "상호작용", "처방", "와파린", "항응고제", "갑상선"],
  },
  {
    id: "supplement-combo",
    category: "interaction",
    title: "여러 영양제를 같이 먹어도 되나요?",
    summary:
      "성분 중복과 흡수 경쟁을 확인해야 합니다. 같은 성분이 겹치면 합산량이 늘고, 칼슘과 철분처럼 서로 흡수를 방해하는 조합도 있습니다.",
    checks: [
      "제품들 사이에 겹치는 성분과 합산량",
      "흡수를 서로 방해하는 조합 (예: 칼슘 ↔ 철분)",
      "꼭 같이 먹어야 하는지, 시간을 나눌 수 있는지",
    ],
    where: [
      { sourceId: "ods", how: "각 성분 팩트시트의 상호작용 항목 확인" },
      { sourceId: "kdris", how: "합산량을 상한섭취량과 비교" },
      { sourceId: "pharmacist", how: "먹는 영양제 목록을 보여주고 조합 점검" },
    ],
    keywords: ["조합", "같이", "중복", "칼슘", "철분", "종합비타민"],
  },
  {
    id: "timing",
    category: "dose",
    title: "언제 먹는 게 좋나요? (식전·식후)",
    summary:
      "제품의 섭취 방법 표시를 먼저 따르세요. 일반적으로 지용성 비타민(A·D·E·K)과 오메가-3는 식사와 함께 먹을 때 흡수가 잘 됩니다.",
    checks: [
      "제품에 표시된 섭취 방법",
      "지용성 성분인지 수용성 성분인지",
      "공복 섭취 시 속쓰림 등 위장 불편이 있는지",
    ],
    where: [
      { sourceId: "ods", how: "팩트시트에서 흡수 관련 설명 확인" },
      { sourceId: "pharmacist", how: "약과 함께 먹는다면 시간 간격 상담" },
    ],
    keywords: ["시간", "식전", "식후", "공복", "아침", "저녁"],
  },
  {
    id: "special-groups",
    category: "safety",
    title: "임신·수유 중이거나 어린이·어르신도 먹어도 되나요?",
    summary:
      "대상에 따라 필요한 양과 피해야 할 성분이 다릅니다. 예를 들어 임신 중에는 비타민 A 과다 섭취에 주의해야 합니다. 제품의 ‘섭취 시 주의사항’을 꼭 확인하세요.",
    checks: [
      "제품의 섭취 시 주의사항에 해당 대상이 언급되는지",
      "대상별 권장섭취량·상한섭취량",
      "어린이용이라면 연령별 섭취량 표시가 있는지",
    ],
    where: [
      { sourceId: "kdris", how: "임신부·수유부·연령별 섭취기준 확인" },
      { sourceId: "ods", how: "팩트시트에서 임신·수유 관련 내용 확인" },
      { sourceId: "pharmacist", how: "산부인과·소아과 진료 시 함께 상담" },
    ],
    caution: "임신·수유 중이거나 지병이 있다면 섭취 전에 반드시 담당 의사와 상의하세요.",
    keywords: ["임신", "수유", "어린이", "아이", "노인", "어르신", "엽산"],
  },
  {
    id: "side-effects",
    category: "safety",
    title: "먹고 이상 증상이 생기면 어떻게 하나요?",
    summary:
      "우선 섭취를 멈추고, 증상이 심하면 의료기관을 방문하세요. 이상사례는 신고할 수 있고, 신고는 다른 소비자를 보호하는 데 쓰입니다.",
    checks: [
      "섭취를 중단하고 제품·포장을 보관",
      "증상, 섭취 시작일, 섭취량 기록",
      "이상사례 신고",
    ],
    where: [
      { sourceId: "khsa", how: "건강기능식품 이상사례 신고센터 (1577-2488)" },
      { sourceId: "foodsafety", how: "온라인 이상사례 신고" },
      { sourceId: "kca", how: "환불·피해구제가 필요하면 1372 소비자상담센터" },
    ],
    keywords: ["부작용", "이상", "증상", "신고", "환불"],
  },
  {
    id: "read-label",
    category: "label",
    title: "라벨에서 무엇을 봐야 하나요?",
    summary:
      "제품명보다 ‘원료명 및 함량’과 ‘영양·기능정보’가 핵심입니다. 1일 섭취량 기준으로 무엇이 얼마나 들어 있는지 확인하세요.",
    checks: [
      "원료명 및 함량 (주원료와 부원료 구분)",
      "영양·기능정보와 영양성분기준치 대비 %",
      "1일 섭취량·섭취 방법",
      "섭취 시 주의사항과 알레르기 유발 물질",
      "소비기한·보관 방법",
    ],
    where: [
      { sourceId: "mfds", how: "건강기능식품 표시 기준 안내" },
      { sourceId: "foodsafety", how: "같은 제품의 신고 정보와 라벨 내용이 일치하는지 대조" },
    ],
    keywords: ["라벨", "성분표", "원료", "함량", "표시"],
  },
  {
    id: "ad-claims",
    category: "label",
    title: "광고에 나온 ‘질병 치료’ 효과, 믿어도 되나요?",
    summary:
      "건강기능식품은 질병의 예방·치료 효과를 광고할 수 없습니다. ‘암 예방’, ‘당뇨 치료’ 같은 표현이 있다면 허위·과대광고일 가능성이 큽니다.",
    checks: [
      "질병 이름 + 예방·치료·완치 같은 표현이 있는지",
      "체험기·전문가 추천을 내세워 효과를 단정하는지",
      "표시·광고 사전심의를 받은 광고인지",
    ],
    where: [
      { sourceId: "khsa", how: "표시·광고 심의 정보 확인" },
      { sourceId: "mfds", how: "허위·과대광고 적발 사례 보도자료 / 1399 신고" },
    ],
    keywords: ["광고", "과대광고", "허위", "치료", "체험기", "인플루언서"],
  },
  {
    id: "overseas",
    category: "buying",
    title: "해외직구 영양제, 괜찮을까요?",
    summary:
      "해외직구 제품은 국내 기준으로 검사받지 않은 경우가 많고, 국내 반입이 금지된 성분이 들어 있을 수 있습니다. 구매 전 위해식품 목록부터 확인하세요.",
    checks: [
      "제품이 해외직구 위해식품 차단 목록에 있는지",
      "국내 반입 금지·제한 성분이 들어 있는지",
      "통관 기준 (수량·자가사용 인정 범위)",
      "문제가 생겼을 때 환불·교환 방법",
    ],
    where: [
      { sourceId: "foodsafety", how: "해외직구 위해식품 목록에서 제품명·성분 검색" },
      { sourceId: "customs", how: "해외직구 통관 기준과 반입 제한 품목 확인" },
      { sourceId: "kca", how: "해외직구 피해 사례와 상담" },
    ],
    caution: "다이어트·근육·성기능 관련 해외 제품에서 의약품 성분이 검출되는 사례가 반복적으로 보고됩니다.",
    keywords: ["해외직구", "아이허브", "직구", "통관", "수입"],
  },
  {
    id: "price-compare",
    category: "buying",
    title: "가격은 어떻게 비교해야 하나요?",
    summary:
      "‘한 통 가격’이 아니라 ‘1일 섭취량 기준 하루 비용’과 ‘유효 성분 함량’으로 비교해야 공정합니다.",
    checks: [
      "1통 가격 ÷ (총 정수 ÷ 1일 섭취 정수) = 하루 비용",
      "1일 섭취량에 들어 있는 유효 성분 함량",
      "원료 형태와 부원료 차이",
      "소비기한 안에 다 먹을 수 있는 양인지",
    ],
    where: [
      { sourceId: "kca", how: "품목별 비교시험 결과가 있는지 확인" },
      { sourceId: "foodsafety", how: "비교 대상 제품들의 신고 정보 확인" },
    ],
    keywords: ["가격", "비교", "가성비", "할인", "저렴"],
  },
];

export function getQuestion(id: string) {
  return questions.find((q) => q.id === id);
}

export function getCategory(id: CategoryId) {
  return categories.find((c) => c.id === id)!;
}
