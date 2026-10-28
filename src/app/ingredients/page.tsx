import type { Metadata } from "next";
import IngredientBrowser from "@/components/IngredientBrowser";

export const metadata: Metadata = {
  title: "성분·원료 정보 | 영양제 궁금증 가이드",
};

export default function IngredientsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">성분·원료 정보</h1>
      <p className="mt-2 leading-relaxed text-muted">
        자주 찾는 영양제 성분의 기능, 하루 섭취 기준, 원료 형태별 차이, 주의사항을 정리했습니다.
        영양 평가를 마치면 내 나이·성별 기준 섭취량도 함께 보여드려요.
      </p>
      <div className="mt-6">
        <IngredientBrowser />
      </div>
    </div>
  );
}
