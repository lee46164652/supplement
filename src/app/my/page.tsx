import type { Metadata } from "next";
import MyReport from "@/components/MyReport";

export const metadata: Metadata = {
  title: "내 맞춤 영양 리포트 | 영양제 궁금증 가이드",
};

export default function MyPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">내 맞춤 영양 리포트</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        이 결과는 설문 응답에 따른 참고 정보이며 진단이 아닙니다. 복용 중인 약이 있거나 지병·임신 중이라면 약사·의사와 상담하세요.
      </p>
      <div className="mt-6">
        <MyReport />
      </div>
    </div>
  );
}
