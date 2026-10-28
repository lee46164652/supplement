"use client";

import Link from "next/link";
import { describeIntake, ingredients } from "@/data/ingredients";
import { assess, type NutrientResult } from "@/lib/assessment";
import { concernLabels, describeProfile } from "@/lib/profile";
import { profileStore } from "@/lib/profileStore";

const levelStyle: Record<NutrientResult["level"], { label: string; className: string }> = {
  high: { label: "부족 가능성 높음", className: "bg-warn-soft text-warn" },
  medium: { label: "확인 필요", className: "bg-accent-soft text-accent" },
  low: { label: "특이 신호 없음", className: "bg-background text-muted" },
};

function Section({ id, title, desc, children }: { id: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-6">
      <h2 className="text-xl font-bold">{title}</h2>
      {desc && <p className="mt-1 text-sm leading-relaxed text-muted">{desc}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function MyReport() {
  const profile = profileStore.useValue();

  if (!profile) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center">
        <p className="font-bold">아직 영양 평가를 하지 않았어요</p>
        <p className="mt-2 text-sm text-muted">몇 가지 질문에 답하면 맞춤 정보와 추천을 보여드려요.</p>
        <Link href="/assessment" className="mt-5 inline-block rounded-xl bg-accent px-6 py-3 font-bold text-white dark:text-background">
          영양 평가 시작하기
        </Link>
      </div>
    );
  }

  const result = assess(profile);
  const kdri = ingredients.filter((i) => i.intake.kind === "kdri");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface p-5">
        <div>
          <p className="text-sm text-muted">평가 기준</p>
          <p className="font-bold">{describeProfile(profile)}</p>
          {profile.concerns.length > 0 && (
            <p className="mt-1 text-sm text-muted">관심 분야 · {profile.concerns.map((c) => concernLabels[c]).join(", ")}</p>
          )}
        </div>
        <div className="flex gap-2 text-sm">
          <Link href="/assessment" className="rounded-full border border-border px-4 py-2 hover:border-accent hover:text-accent">
            답변 수정
          </Link>
          <button onClick={() => profileStore.set(null)} className="rounded-full border border-border px-4 py-2 text-muted hover:text-warn">
            기록 삭제
          </button>
        </div>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2 text-sm">
        {[
          ["summary", "종합 평가"],
          ["recommend", "추천 성분"],
          ["info", "맞춤 영양 정보"],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded-full bg-accent-soft px-3 py-1.5 text-accent">
            {label}
          </a>
        ))}
      </nav>

      <Section id="summary" title="📊 영양 종합 평가" desc="응답을 바탕으로 한 참고 지표입니다. 실제 영양 상태는 식사 기록이나 혈액검사로 확인할 수 있습니다.">
        <div className="grid gap-3 sm:grid-cols-3">
          {result.scores.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">{s.label}</p>
              <p className="mt-1 text-3xl font-bold">
                {s.value}
                <span className="text-base font-normal text-muted"> / 100</span>
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-accent" style={{ width: `${s.value}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted">{s.note}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-8 font-bold">영양소별 부족 가능성</h3>
        <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-surface">
          {result.nutrients.map((n) => (
            <li key={n.ingredient.id} className="flex flex-wrap items-start justify-between gap-2 p-4">
              <div>
                <Link href={`/ingredients/${n.ingredient.id}`} className="font-medium hover:text-accent">
                  {n.ingredient.name}
                </Link>
                {n.signals.length > 0 && (
                  <ul className="mt-1 text-sm text-muted">
                    {n.signals.map((s) => (
                      <li key={s.reason}>· {s.reason}</li>
                    ))}
                  </ul>
                )}
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${levelStyle[n.level].className}`}>
                {levelStyle[n.level].label}
              </span>
            </li>
          ))}
        </ul>

        {result.lifestyle.length > 0 && (
          <div className="mt-6 rounded-xl bg-accent-soft p-5">
            <p className="font-bold text-accent">생활 속에서 먼저 해볼 것</p>
            <ul className="mt-2 space-y-1 leading-relaxed">
              {result.lifestyle.map((t) => (
                <li key={t}>· {t}</li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section
        id="recommend"
        title="🎯 검토해 볼 만한 성분"
        desc="부족 가능성 신호와 관심 분야에 맞는 식약처 인정 기능성을 점수화해 정렬했습니다. 구매 권유가 아니라 ‘알아볼 순서’로 참고하세요."
      >
        {result.recommendations.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
            응답에서 뚜렷한 부족 신호가 없었어요. 균형 잡힌 식사를 유지한다면 영양제가 꼭 필요하지 않을 수 있습니다.
            관심 분야를 선택하면 관련 성분을 보여드려요.
          </p>
        ) : (
          <ol className="grid gap-3 sm:grid-cols-2">
            {result.recommendations.map((r, i) => {
              const intake = describeIntake(r.ingredient, profile);
              return (
                <li key={r.ingredient.id} className="flex flex-col rounded-xl border border-border bg-surface p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-bold">
                      <span className="mr-2 text-accent">{i + 1}</span>
                      {r.ingredient.name}
                    </p>
                    <span className="text-xs text-muted">점수 {r.score}</span>
                  </div>
                  <p className="mt-1 text-sm text-accent">{intake.target}</p>
                  <ul className="mt-3 flex-1 space-y-1 text-sm text-muted">
                    {r.reasons.map((reason) => (
                      <li key={reason}>· {reason}</li>
                    ))}
                  </ul>
                  {r.cautions.map((c) => (
                    <p key={c} className="mt-3 rounded-lg bg-warn-soft p-3 text-sm leading-relaxed text-warn">
                      ⚠️ {c}
                    </p>
                  ))}
                  <Link href={`/ingredients/${r.ingredient.id}`} className="mt-4 text-sm font-medium text-accent hover:underline">
                    성분 자세히 보기 →
                  </Link>
                </li>
              );
            })}
          </ol>
        )}

        {result.medNotes.some((m) => m.notes.length > 0) && (
          <div className="mt-6 rounded-xl bg-warn-soft p-5 text-warn">
            <p className="font-bold">복용 중인 약과 관련된 성분</p>
            {result.medNotes
              .filter((m) => m.notes.length > 0)
              .map((m) => (
                <div key={m.med} className="mt-3">
                  <p className="text-sm font-medium">{m.label}</p>
                  <ul className="mt-1 space-y-1 text-sm leading-relaxed">
                    {m.notes.map((n) => (
                      <li key={n.ingredient.id}>
                        · <strong>{n.ingredient.name}</strong> — {n.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}

        <Link href="/compare" className="mt-6 block rounded-xl border border-accent p-4 text-center font-medium text-accent hover:bg-accent-soft">
          가지고 있는 제품을 내 기준으로 비교해 보기 →
        </Link>
      </Section>

      <Section id="info" title="📋 맞춤 영양 정보" desc="한국인 영양소 섭취기준(2020)을 내 나이·성별에 맞춰 보여드립니다. 음식으로 먹는 양을 포함한 하루 전체 섭취량 기준입니다.">
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="border-b border-border text-left text-muted">
              <tr>
                <th className="p-3 font-medium">영양소</th>
                <th className="p-3 font-medium">내 기준 섭취량</th>
                <th className="p-3 font-medium">상한섭취량</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {kdri.map((ing) => {
                const intake = describeIntake(ing, profile);
                return (
                  <tr key={ing.id}>
                    <td className="p-3">
                      <Link href={`/ingredients/${ing.id}`} className="font-medium hover:text-accent">
                        {ing.name}
                      </Link>
                    </td>
                    <td className="p-3">{intake.target}</td>
                    <td className="p-3 text-muted">{intake.upper?.replace("상한섭취량 ", "") ?? "미설정"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
