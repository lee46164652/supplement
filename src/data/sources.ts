export type SourceGroup = "domestic" | "global" | "expert";

export type Source = {
  id: string;
  name: string;
  org: string;
  url?: string;
  group: SourceGroup;
  description: string;
  findHere: string[];
};

export const sourceGroups: Record<SourceGroup, { label: string; description: string }> = {
  domestic: {
    label: "국내 공공기관",
    description: "국내에서 판매되는 제품의 신고·회수·표시 기준을 확인하는 1차 자료",
  },
  global: {
    label: "해외 근거 자료",
    description: "성분별 효과·안전성 연구를 정리한 신뢰도 높은 자료",
  },
  expert: {
    label: "전문가 상담",
    description: "내 몸 상태와 복용 중인 약을 함께 고려해야 할 때",
  },
};

export const sources: Source[] = [
  {
    id: "foodsafety",
    name: "식품안전나라",
    org: "식품의약품안전처",
    url: "https://www.foodsafetykorea.go.kr",
    group: "domestic",
    description: "건강기능식품 제품 정보와 회수·위해 정보를 찾는 가장 기본적인 사이트입니다.",
    findHere: [
      "건강기능식품 제품 검색 (품목제조·수입 신고 정보)",
      "기능성 원료별 인정 기능성과 일일섭취량",
      "회수·판매중지 제품 정보",
      "해외직구 위해식품 차단 목록",
      "이상사례(부작용) 온라인 신고",
    ],
  },
  {
    id: "mfds",
    name: "식품의약품안전처",
    org: "식품의약품안전처",
    url: "https://www.mfds.go.kr",
    group: "domestic",
    description: "건강기능식품 정책, 허위·과대광고 적발 사례, 보도자료를 확인할 수 있습니다.",
    findHere: [
      "허위·과대광고 적발 보도자료",
      "건강기능식품 표시·광고 기준",
      "부정·불량식품 신고 (국번 없이 1399)",
    ],
  },
  {
    id: "nedrug",
    name: "의약품안전나라",
    org: "식품의약품안전처",
    url: "https://nedrug.mfds.go.kr",
    group: "domestic",
    description: "지금 복용 중인 의약품의 성분과 사용상 주의사항을 확인할 수 있습니다.",
    findHere: [
      "복용 중인 약의 성분·효능·주의사항",
      "의약품 낱알 식별 (약 모양으로 검색)",
    ],
  },
  {
    id: "kca",
    name: "한국소비자원",
    org: "한국소비자원",
    url: "https://www.kca.go.kr",
    group: "domestic",
    description: "제품 비교시험 결과와 소비자 피해 사례, 피해구제 절차를 안내합니다.",
    findHere: [
      "영양제 품목 비교시험·안전성 조사 결과",
      "해외직구 등 소비자 피해 사례",
      "피해구제 신청 (소비자상담센터 1372)",
    ],
  },
  {
    id: "consumer24",
    name: "소비자24",
    org: "공정거래위원회",
    url: "https://www.consumer.go.kr",
    group: "domestic",
    description: "여러 기관의 리콜 정보를 한곳에서 검색할 수 있는 통합 포털입니다.",
    findHere: ["국내·해외 리콜 정보 통합 검색"],
  },
  {
    id: "khsa",
    name: "한국건강기능식품협회",
    org: "한국건강기능식품협회",
    url: "https://www.khsa.or.kr",
    group: "domestic",
    description: "건강기능식품 표시·광고 사전심의와 이상사례 신고를 담당합니다.",
    findHere: [
      "표시·광고 심의 여부 확인",
      "건강기능식품 이상사례 신고센터 (1577-2488)",
    ],
  },
  {
    id: "kdris",
    name: "한국인 영양소 섭취기준",
    org: "보건복지부 · 한국영양학회",
    url: "https://www.kns.or.kr",
    group: "domestic",
    description: "연령·성별에 따른 영양소 권장섭취량과 상한섭취량을 정한 국가 기준입니다.",
    findHere: [
      "영양소별 권장섭취량·충분섭취량",
      "영양소별 상한섭취량 (이 이상은 위험할 수 있는 양)",
    ],
  },
  {
    id: "customs",
    name: "관세청",
    org: "관세청",
    url: "https://www.customs.go.kr",
    group: "domestic",
    description: "해외직구 통관 기준과 반입 제한 품목을 확인할 수 있습니다.",
    findHere: ["해외직구 건강기능식품 통관 기준", "반입 제한 성분·품목 안내"],
  },
  {
    id: "ods",
    name: "NIH Office of Dietary Supplements",
    org: "미국 국립보건원(NIH)",
    url: "https://ods.od.nih.gov",
    group: "global",
    description: "비타민·미네랄·주요 성분별 팩트시트를 제공합니다. 영어지만 가장 정리가 잘 된 자료 중 하나입니다.",
    findHere: [
      "성분별 효과에 대한 연구 요약",
      "상한섭취량과 과다 섭취 증상",
      "의약품과의 상호작용",
    ],
  },
  {
    id: "medlineplus",
    name: "MedlinePlus (Herbs and Supplements)",
    org: "미국 국립의학도서관(NLM)",
    url: "https://medlineplus.gov/druginfo/herb_All.html",
    group: "global",
    description: "허브·보충제 성분별로 효과 근거와 주의사항, 약물 상호작용을 정리해 둔 자료입니다.",
    findHere: ["성분별 효과 근거 수준", "부작용·약물 상호작용"],
  },
  {
    id: "examine",
    name: "Examine",
    org: "Examine.com",
    url: "https://examine.com",
    group: "global",
    description: "보충제 연구를 성분·건강 목표별로 요약한 독립 사이트입니다. 일부 내용은 유료입니다.",
    findHere: ["성분별 연구 요약과 근거 수준", "성분 형태(염 형태)별 차이"],
  },
  {
    id: "cochrane",
    name: "Cochrane Library",
    org: "Cochrane",
    url: "https://www.cochranelibrary.com",
    group: "global",
    description: "여러 연구를 종합한 체계적 문헌고찰을 찾을 수 있습니다. 근거 수준이 가장 높은 편입니다.",
    findHere: ["특정 성분의 효과에 대한 체계적 문헌고찰"],
  },
  {
    id: "pubmed",
    name: "PubMed",
    org: "미국 국립의학도서관(NLM)",
    url: "https://pubmed.ncbi.nlm.nih.gov",
    group: "global",
    description: "의학 논문 검색 엔진입니다. ‘meta-analysis’ 필터를 걸면 종합 연구를 먼저 볼 수 있습니다.",
    findHere: ["성분명 + 효과로 논문 검색", "메타분석·무작위 대조시험 필터"],
  },
  {
    id: "pharmacist",
    name: "약사 · 의사 상담",
    org: "가까운 약국 · 병원",
    group: "expert",
    description: "복용 중인 약, 지병, 임신·수유 여부처럼 개인 상황이 얽힌 질문은 전문가에게 묻는 것이 가장 정확합니다.",
    findHere: [
      "복용 중인 약과의 상호작용",
      "지병이 있을 때 피해야 할 성분",
      "임신·수유·소아·고령자 섭취 여부",
    ],
  },
];

export function getSource(id: string) {
  return sources.find((s) => s.id === id);
}
