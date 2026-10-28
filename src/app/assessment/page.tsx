import type { Metadata } from "next";
import AssessmentForm from "@/components/AssessmentForm";

export const metadata: Metadata = {
  title: "영양 평가 | 영양제 궁금증 가이드",
};

export default function AssessmentPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">영양 종합 평가</h1>
      <p className="mt-2 leading-relaxed text-muted">
        1분 정도 걸리는 질문에 답하면 부족하기 쉬운 영양소, 내 기준 섭취량, 검토해 볼 만한 성분과
        주의할 점을 정리해 드려요. 성인(19세 이상) 기준입니다.
      </p>
      <div className="mt-6">
        <AssessmentForm />
      </div>
    </div>
  );
}
