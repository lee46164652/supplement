import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PersonalIntake from "@/components/PersonalIntake";
import { describeIntake, getIngredient, ingredientGroups, ingredients } from "@/data/ingredients";
import { getSource } from "@/data/sources";

export function generateStaticParams() {
  return ingredients.map((i) => ({ id: i.id }));
}

export async function generateMetadata(props: PageProps<"/ingredients/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const ingredient = getIngredient(id);
  return ingredient ? { title: `${ingredient.name} | 영양제 궁금증 가이드` } : {};
}

export default function IngredientPage(props: PageProps<"/ingredients/[id]">) {
  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/ingredients" className="text-sm text-muted hover:text-accent">
        ← 성분 목록
      </Link>
      {/* params는 URL마다 달라서 App Shell 밖(Suspense 안)에서 읽음 */}
      <Suspense fallback={<div className="mt-6 h-40 animate-pulse rounded-xl bg-surface" />}>
        <IngredientDetail params={props.params} />
      </Suspense>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

async function IngredientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ingredient = getIngredient(id);
  if (!ingredient) notFound();

  const intake = describeIntake(ingredient);

  return (
    <>
      <p className="mt-6 text-sm font-medium text-accent">{ingredientGroups[ingredient.group]}</p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{ingredient.name}</h1>
      {ingredient.aliases.length > 0 && (
        <p className="mt-1 text-sm text-muted">다른 이름 · {ingredient.aliases.join(", ")}</p>
      )}
      <p className="mt-4 text-lg leading-relaxed">{ingredient.summary}</p>

      <Section title="📏 하루 섭취 기준">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="font-bold">{intake.target}</p>
          <p className="mt-1 text-sm text-muted">기준 · {intake.basis}</p>
        </div>
        <div className="mt-3">
          <PersonalIntake id={ingredient.id} />
        </div>
      </Section>

      <Section title="✔ 인정된 기능성">
        <ul className="space-y-2">
          {ingredient.functions.map((f) => (
            <li key={f} className="rounded-lg bg-surface px-4 py-3">
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">식약처 고시·인정 기능성 내용을 요약했습니다.</p>
      </Section>

      <Section title="🧪 원료 형태별 차이">
        <dl className="divide-y divide-border rounded-xl border border-border bg-surface">
          {ingredient.forms.map((form) => (
            <div key={form.name} className="p-4">
              <dt className="font-medium">{form.name}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{form.note}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {ingredient.foods.length > 0 && (
        <Section title="🥗 음식으로 먹으려면">
          <div className="flex flex-wrap gap-2">
            {ingredient.foods.map((food) => (
              <span key={food} className="rounded-full bg-accent-soft px-3 py-1 text-sm text-accent">
                {food}
              </span>
            ))}
          </div>
        </Section>
      )}

      <Section title="⚠️ 주의사항">
        <ul className="space-y-2 rounded-xl bg-warn-soft p-5 text-warn">
          {ingredient.cautions.map((c) => (
            <li key={c} className="leading-relaxed">
              · {c}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="🔎 더 알아보기">
        <ul className="space-y-2">
          {ingredient.sources.map((ref) => {
            const source = getSource(ref.sourceId);
            if (!source) return null;
            return (
              <li key={ref.sourceId} className="flex items-baseline justify-between gap-3 rounded-lg bg-surface px-4 py-3">
                <span>
                  <strong>{source.name}</strong>
                  <span className="ml-2 text-sm text-muted">{ref.how}</span>
                </span>
                {source.url && (
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm text-accent hover:underline">
                    열기 ↗
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
