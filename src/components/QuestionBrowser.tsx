"use client";

import Link from "next/link";
import { useState } from "react";
import { categories, questions, getCategory, type CategoryId } from "@/data/questions";

export default function QuestionBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");

  const q = query.trim().toLowerCase();
  const filtered = questions.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (!q) return true;
    return [item.title, item.summary, ...item.keywords].some((text) =>
      text.toLowerCase().includes(q),
    );
  });

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-accent bg-accent text-white dark:text-background"
        : "border-border bg-surface text-muted hover:border-accent hover:text-accent"
    }`;

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="궁금한 것을 입력하세요 (예: 부작용, 해외직구, 철분)"
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base outline-none focus:border-accent"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <button className={chip(category === "all")} onClick={() => setCategory("all")}>
          전체
        </button>
        {categories.map((c) => (
          <button key={c.id} className={chip(category === c.id)} onClick={() => setCategory(c.id)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted">{filtered.length}개의 질문</p>

      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {filtered.map((item) => {
          const cat = getCategory(item.category);
          return (
            <li key={item.id}>
              <Link
                href={`/questions/${item.id}`}
                className="flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent"
              >
                <span className="text-xs font-medium text-accent">
                  {cat.emoji} {cat.label}
                </span>
                <span className="mt-2 font-bold leading-snug">{item.title}</span>
                <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                  {item.summary}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
          맞는 질문이 없어요. 다른 단어로 검색하거나{" "}
          <Link href="/sources" className="text-accent underline">
            정보처 모음
          </Link>
          에서 직접 찾아보세요.
        </div>
      )}
    </div>
  );
}
