"use client";

import Link from "next/link";
import { formatAmount, getIngredient, ingredients, type Ingredient } from "@/data/ingredients";
import { defaultProfile, describeProfile, type Profile } from "@/lib/profile";
import { profileStore } from "@/lib/profileStore";
import { createLocalStore } from "@/lib/store";

type Product = {
  id: string;
  name: string;
  price: number;
  units: number;
  perDay: number;
  taking: boolean;
  /** 1일 섭취량 기준 함량 */
  items: { ingredientId: string; amount: number }[];
};

const examples: Product[] = [
  {
    id: "ex-a",
    name: "예시 A · 종합비타민",
    price: 32000,
    units: 90,
    perDay: 1,
    taking: true,
    items: [
      { ingredientId: "vitamin-d", amount: 25 },
      { ingredientId: "vitamin-c", amount: 100 },
      { ingredientId: "zinc", amount: 8.5 },
      { ingredientId: "magnesium", amount: 100 },
    ],
  },
  {
    id: "ex-b",
    name: "예시 B · 비타민 D 4000 IU",
    price: 15000,
    units: 120,
    perDay: 1,
    taking: true,
    items: [{ ingredientId: "vitamin-d", amount: 100 }],
  },
  {
    id: "ex-c",
    name: "예시 C · 오메가-3",
    price: 28000,
    units: 120,
    perDay: 2,
    taking: false,
    items: [{ ingredientId: "omega-3", amount: 1000 }],
  },
];

const productStore = createLocalStore<Product[]>("supplement-products", examples);

const newId = () => `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

type Status = { text: string; tone: "ok" | "low" | "warn" };

function evaluate(ing: Ingredient, amount: number, p: Profile): Status {
  const intake = ing.intake;
  if (intake.kind === "functional") {
    if (amount < intake.min) return { text: `기준 미만 (${intake.min}~${intake.max})`, tone: "low" };
    if (amount > intake.max) return { text: `기준 초과 (${intake.min}~${intake.max})`, tone: "warn" };
    return { text: "인정 섭취량 범위 내", tone: "ok" };
  }
  const upper = intake.upper?.(p);
  if (upper && amount > upper) return { text: `상한 ${formatAmount(upper, ing.unit)} 초과`, tone: "warn" };
  if (upper && amount === upper) return { text: `상한 ${formatAmount(upper, ing.unit)}에 도달`, tone: "warn" };
  const pct = Math.round((amount / intake.reference(p)) * 100);
  return { text: `${intake.label}의 ${pct}%`, tone: pct < 30 ? "low" : "ok" };
}

const toneClass: Record<Status["tone"], string> = {
  ok: "text-accent",
  low: "text-muted",
  warn: "font-medium text-warn",
};

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;

function NumberInput({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted">
      {label}
      <span className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          step="any"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-accent"
        />
        {suffix && <span className="shrink-0">{suffix}</span>}
      </span>
    </label>
  );
}

export default function ProductCompare() {
  const products = productStore.useValue();
  const savedProfile = profileStore.useValue();
  const profile = savedProfile ?? defaultProfile;

  const save = (next: Product[]) => productStore.set(next);
  const update = (id: string, patch: Partial<Product>) =>
    save(products.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const addProduct = () =>
    save([...products, { id: newId(), name: "새 제품", price: 0, units: 30, perDay: 1, taking: false, items: [] }]);

  // 함께 먹는 제품들의 성분 합산
  const combined = new Map<string, number>();
  for (const p of products.filter((p) => p.taking))
    for (const item of p.items) combined.set(item.ingredientId, (combined.get(item.ingredientId) ?? 0) + item.amount);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface p-4 text-sm">
        <p>
          <span className="text-muted">비교 기준 · </span>
          <strong>{describeProfile(profile)}</strong>
          {!savedProfile && <span className="text-muted"> (기본값)</span>}
        </p>
        <Link href="/assessment" className="text-accent hover:underline">
          {savedProfile ? "기준 바꾸기" : "영양 평가로 내 기준 설정하기"} →
        </Link>
      </div>

      <ul className="mt-6 grid gap-4 lg:grid-cols-2">
        {products.map((product) => {
          const days = product.perDay > 0 ? product.units / product.perDay : 0;
          const daily = days > 0 ? product.price / days : 0;
          const usedIds = new Set(product.items.map((i) => i.ingredientId));
          return (
            <li key={product.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2">
                <input
                  value={product.name}
                  onChange={(e) => update(product.id, { name: e.target.value })}
                  aria-label="제품 이름"
                  className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-1 py-1 font-bold outline-none hover:border-border focus:border-accent"
                />
                <button
                  onClick={() => save(products.filter((p) => p.id !== product.id))}
                  className="shrink-0 text-xs text-muted hover:text-warn"
                >
                  삭제
                </button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <NumberInput label="가격" value={product.price} suffix="원" onChange={(v) => update(product.id, { price: v })} />
                <NumberInput label="총 개수" value={product.units} suffix="정" onChange={(v) => update(product.id, { units: v })} />
                <NumberInput label="1일 섭취" value={product.perDay} suffix="정" onChange={(v) => update(product.id, { perDay: v })} />
              </div>

              <div className="mt-3 flex items-baseline justify-between rounded-lg bg-accent-soft px-3 py-2">
                <span className="text-sm text-accent">하루 비용</span>
                <span className="font-bold text-accent">
                  {won(daily)} <span className="text-xs font-normal">· {Math.floor(days)}일분</span>
                </span>
              </div>

              <p className="mt-4 text-xs text-muted">1일 섭취량 기준 함량 (라벨의 ‘1일 섭취량당’ 값을 입력)</p>
              <ul className="mt-2 space-y-2">
                {product.items.map((item, idx) => {
                  const ing = getIngredient(item.ingredientId);
                  if (!ing) return null;
                  const status = evaluate(ing, item.amount, profile);
                  return (
                    <li key={item.ingredientId} className="rounded-lg border border-border p-2">
                      <div className="flex items-center gap-2">
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">{ing.name}</span>
                        <input
                          type="number"
                          min={0}
                          step="any"
                          value={item.amount}
                          aria-label={`${ing.name} 함량`}
                          onChange={(e) => {
                            const items = [...product.items];
                            items[idx] = { ...item, amount: Number(e.target.value) || 0 };
                            update(product.id, { items });
                          }}
                          className="w-24 rounded-lg border border-border bg-background px-2 py-1 text-right text-sm outline-none focus:border-accent"
                        />
                        <span className="w-14 shrink-0 text-xs text-muted">{ing.unit}</span>
                        <button
                          onClick={() => update(product.id, { items: product.items.filter((_, i) => i !== idx) })}
                          aria-label={`${ing.name} 빼기`}
                          className="shrink-0 px-1 text-muted hover:text-warn"
                        >
                          ×
                        </button>
                      </div>
                      <p className={`mt-1 text-xs ${toneClass[status.tone]}`}>{status.text}</p>
                    </li>
                  );
                })}
              </ul>

              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) update(product.id, { items: [...product.items, { ingredientId: e.target.value, amount: 0 }] });
                }}
                className="mt-2 w-full rounded-lg border border-dashed border-border bg-transparent px-2 py-2 text-sm text-muted"
              >
                <option value="">+ 성분 추가</option>
                {ingredients
                  .filter((i) => !usedIds.has(i.id))
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.unit})
                    </option>
                  ))}
              </select>

              <label className="mt-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={product.taking}
                  onChange={(e) => update(product.id, { taking: e.target.checked })}
                  className="size-4 accent-[var(--accent)]"
                />
                함께 먹는 중 (아래 합산에 포함)
              </label>
            </li>
          );
        })}
        <li>
          <button
            onClick={addProduct}
            className="flex h-full min-h-40 w-full items-center justify-center rounded-xl border border-dashed border-border text-muted hover:border-accent hover:text-accent"
          >
            + 제품 추가
          </button>
        </li>
      </ul>

      <section className="mt-10">
        <h2 className="text-xl font-bold">🧮 함께 먹을 때 합산</h2>
        <p className="mt-1 text-sm text-muted">
          ‘함께 먹는 중’으로 표시한 제품의 같은 성분을 더했습니다. 음식으로 먹는 양은 포함되지 않았어요.
        </p>
        {combined.size === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
            함께 먹는 제품을 선택하면 성분 합산과 상한섭취량 초과 여부를 보여드려요.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface">
            {[...combined].map(([id, amount]) => {
              const ing = getIngredient(id)!;
              const status = evaluate(ing, amount, profile);
              return (
                <li key={id} className="flex flex-wrap items-baseline justify-between gap-2 p-4">
                  <Link href={`/ingredients/${id}`} className="font-medium hover:text-accent">
                    {ing.name}
                  </Link>
                  <span className="text-sm">
                    <strong>{formatAmount(amount, ing.unit)}</strong>
                    <span className={`ml-2 ${toneClass[status.tone]}`}>{status.text}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <button onClick={() => save(examples)} className="mt-6 text-sm text-muted underline hover:text-accent">
        예시 제품으로 초기화
      </button>
    </div>
  );
}
