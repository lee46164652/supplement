"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "supplement-checklist";

const items: { id: string; text: string; questionId: string }[] = [
  { id: "need", text: "이 영양소가 나에게 정말 부족한지 생각해 봤다", questionId: "is-it-effective" },
  { id: "certified", text: "‘건강기능식품’ 문구와 인증마크를 확인했다", questionId: "health-functional-vs-general" },
  { id: "registered", text: "식품안전나라에서 제품이 조회된다", questionId: "genuine-product" },
  { id: "recall", text: "회수·판매중지 이력이 없다", questionId: "recall" },
  { id: "label", text: "원료명·함량과 1일 섭취량을 읽어봤다", questionId: "read-label" },
  { id: "limit", text: "다른 영양제와 합쳐도 상한섭취량을 넘지 않는다", questionId: "upper-limit" },
  { id: "drug", text: "복용 중인 약과의 상호작용을 확인했다 (또는 약이 없다)", questionId: "drug-interaction" },
  { id: "special", text: "임신·수유·소아·지병 등 해당 사항을 확인했다", questionId: "special-groups" },
  { id: "ad", text: "질병 치료를 내세우는 광고에 끌린 게 아니다", questionId: "ad-claims" },
  { id: "price", text: "하루 비용 기준으로 가격을 비교했다", questionId: "price-compare" },
];

export default function Checklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 저장된 상태는 마운트 후에만 읽을 수 있음
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, []);

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const reset = () => {
    setChecked({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const done = items.filter((item) => checked[item.id]).length;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${(done / items.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted">
          {done} / {items.length}
        </span>
      </div>

      <ul className="mt-6 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
          >
            <input
              id={item.id}
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={() => toggle(item.id)}
              className="size-5 shrink-0 accent-[var(--accent)]"
            />
            <label htmlFor={item.id} className="flex-1 cursor-pointer leading-relaxed">
              {item.text}
            </label>
            <Link
              href={`/questions/${item.questionId}`}
              className="shrink-0 text-sm text-accent hover:underline"
            >
              방법 보기
            </Link>
          </li>
        ))}
      </ul>

      <button onClick={reset} className="mt-6 text-sm text-muted underline hover:text-accent">
        처음부터 다시
      </button>
    </div>
  );
}
