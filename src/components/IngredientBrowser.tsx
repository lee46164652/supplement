"use client";

import Link from "next/link";
import { useState } from "react";
import { ingredientGroups, ingredients, type IngredientGroup } from "@/data/ingredients";

export default function IngredientBrowser() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = ingredients.filter(
    (i) =>
      !q ||
      [i.name, ...i.aliases, ...i.functions].some((text) => text.toLowerCase().includes(q)),
  );
  const groups = Object.keys(ingredientGroups) as IngredientGroup[];

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="성분명이나 기능으로 검색 (예: 유산균, 뼈, 눈)"
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:border-accent"
      />
      {groups.map((group) => {
        const list = filtered.filter((i) => i.group === group);
        if (list.length === 0) return null;
        return (
          <section key={group} className="mt-8">
            <h2 className="text-sm font-bold text-muted">{ingredientGroups[group]}</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((i) => (
                <li key={i.id}>
                  <Link
                    href={`/ingredients/${i.id}`}
                    className="flex h-full flex-col rounded-xl border border-border bg-surface p-4 hover:border-accent"
                  >
                    <span className="font-bold">{i.name}</span>
                    <span className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                      {i.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted">검색 결과가 없습니다.</p>
      )}
    </div>
  );
}
