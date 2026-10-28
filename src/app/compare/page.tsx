import type { Metadata } from "next";
import ProductCompare from "@/components/ProductCompare";

export const metadata: Metadata = {
  title: "내 기준 제품 비교 | 영양제 궁금증 가이드",
};

export default function ComparePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">내 기준 제품 비교</h1>
      <p className="mt-2 max-w-3xl leading-relaxed text-muted">
        고민 중인 제품의 라벨 정보를 입력하면 하루 비용, 내 기준 섭취량 대비 함량, 함께 먹을 때 상한섭취량을
        넘는지 계산해 드려요. 입력한 내용은 이 브라우저에만 저장됩니다.
      </p>
      <div className="mt-6">
        <ProductCompare />
      </div>
    </div>
  );
}
