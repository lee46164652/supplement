"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ageLabels,
  concernLabels,
  defaultProfile,
  medLabels,
  type AgeGroup,
  type ConcernId,
  type Diet,
  type Frequency,
  type MedId,
  type Profile,
} from "@/lib/profile";
import { profileStore } from "@/lib/profileStore";

const chip = (active: boolean) =>
  `rounded-full border px-3 py-1.5 text-sm transition-colors ${
    active
      ? "border-accent bg-accent text-white dark:text-background"
      : "border-border bg-surface text-muted hover:border-accent hover:text-accent"
  }`;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border border-border bg-surface p-5">
      <legend className="sr-only">{label}</legend>
      <p className="font-bold">{label}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Single<T extends string | boolean>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return options.map(([v, label]) => (
    <button key={String(v)} type="button" aria-pressed={value === v} className={chip(value === v)} onClick={() => onChange(v)}>
      {label}
    </button>
  ));
}

function Multi<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T[];
  options: Record<T, string>;
  onChange: (v: T[]) => void;
}) {
  return (Object.entries(options) as [T, string][]).map(([v, label]) => {
    const active = value.includes(v);
    return (
      <button
        key={v}
        type="button"
        aria-pressed={active}
        className={chip(active)}
        onClick={() => onChange(active ? value.filter((x) => x !== v) : [...value, v])}
      >
        {label}
      </button>
    );
  });
}

const freq = (rare: string, sometimes: string, often: string): [Frequency, string][] => [
  ["rare", rare],
  ["sometimes", sometimes],
  ["often", often],
];

export default function AssessmentForm() {
  const saved = profileStore.useValue();
  // 저장된 프로필이 로드되면 key가 바뀌어 폼이 그 값으로 다시 시작됨
  return <FormBody key={saved ? "saved" : "new"} initial={saved ?? defaultProfile} />;
}

function FormBody({ initial }: { initial: Profile }) {
  const router = useRouter();
  const [p, setP] = useState<Profile>(initial);
  const set = <K extends keyof Profile>(key: K) => (value: Profile[K]) => setP((prev) => ({ ...prev, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    profileStore.set({ ...p, pregnant: p.sex === "female" && p.pregnant });
    router.push("/my");
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="pt-2 text-sm font-bold text-accent">1. 기본 정보</h2>
      <Field label="나이">
        <Single<AgeGroup> value={p.ageGroup} options={Object.entries(ageLabels) as [AgeGroup, string][]} onChange={set("ageGroup")} />
      </Field>
      <Field label="성별" hint="영양소 권장섭취량이 성별에 따라 다릅니다.">
        <Single value={p.sex} options={[["female", "여성"], ["male", "남성"]]} onChange={set("sex")} />
      </Field>
      {p.sex === "female" && (
        <Field label="임신 또는 수유 중인가요?">
          <Single value={p.pregnant} options={[[false, "아니요"], [true, "예"]]} onChange={set("pregnant")} />
        </Field>
      )}

      <h2 className="pt-4 text-sm font-bold text-accent">2. 식습관</h2>
      <Field label="식단 유형">
        <Single<Diet> value={p.diet} options={[["omnivore", "고기·생선 모두 먹음"], ["vegetarian", "채식 위주 (유제품·달걀은 먹음)"], ["vegan", "완전 채식 (비건)"]]} onChange={set("diet")} />
      </Field>
      <Field label="생선은 얼마나 자주 먹나요?">
        <Single value={p.fish} options={freq("거의 안 먹음", "주 1회 정도", "주 2회 이상")} onChange={set("fish")} />
      </Field>
      <Field label="우유·요구르트·치즈 등 유제품은요?">
        <Single value={p.dairy} options={freq("거의 안 먹음", "가끔", "매일")} onChange={set("dairy")} />
      </Field>

      <h2 className="pt-4 text-sm font-bold text-accent">3. 생활습관</h2>
      <Field label="낮 시간 대부분을 실내에서 보내나요?">
        <Single value={p.sunLow} options={[[false, "아니요"], [true, "예, 햇빛을 거의 못 봐요"]]} onChange={set("sunLow")} />
      </Field>
      <Field label="음주">
        <Single value={p.alcohol} options={freq("거의 안 마심", "가끔 (주 1~2회)", "자주 (주 3회 이상)")} onChange={set("alcohol")} />
      </Field>
      <Field label="흡연">
        <Single value={p.smoking} options={[[false, "비흡연"], [true, "흡연"]]} onChange={set("smoking")} />
      </Field>

      <h2 className="pt-4 text-sm font-bold text-accent">4. 관심사와 복용 중인 약</h2>
      <Field label="관심 있는 건강 분야" hint="여러 개 선택할 수 있어요.">
        <Multi<ConcernId> value={p.concerns} options={concernLabels} onChange={set("concerns")} />
      </Field>
      <Field label="현재 복용 중인 약" hint="해당하는 것을 모두 고르세요. 없으면 비워두세요.">
        <Multi<MedId> value={p.meds} options={medLabels} onChange={set("meds")} />
      </Field>

      <button type="submit" className="w-full rounded-xl bg-accent py-4 font-bold text-white dark:text-background">
        결과 보기
      </button>
      <p className="text-center text-xs text-muted">응답은 서버로 전송되지 않고 이 브라우저에만 저장됩니다.</p>
    </form>
  );
}
