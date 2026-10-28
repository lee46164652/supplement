import type { Metadata } from "next";
import Checklist from "@/components/Checklist";

export const metadata: Metadata = {
  title: "구매 전 체크리스트 | 영양제 궁금증 가이드",
};

export default function ChecklistPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">구매 전 체크리스트</h1>
      <p className="mt-2 leading-relaxed text-muted">
        결제하기 전에 하나씩 확인해 보세요. 체크 상태는 이 브라우저에만 저장됩니다.
      </p>
      <Checklist />
    </div>
  );
}
