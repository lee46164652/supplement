"use client";

import Link from "next/link";
import { describeIntake, getIngredient } from "@/data/ingredients";
import { describeProfile, medLabels } from "@/lib/profile";
import { profileStore } from "@/lib/profileStore";

export default function PersonalIntake({ id }: { id: string }) {
  const profile = profileStore.useValue();
  const ingredient = getIngredient(id);
  if (!ingredient) return null;

  if (!profile) {
    return (
      <div className="rounded-xl border border-dashed border-border p-5 text-sm text-muted">
        <Link href="/assessment" className="font-medium text-accent hover:underline">
          영양 평가
        </Link>
        를 하면 내 나이·성별에 맞춘 섭취 기준과 복용 중인 약 관련 주의사항을 여기에 보여드려요.
      </div>
    );
  }

  const intake = describeIntake(ingredient, profile);
  const medNotes = profile.meds
    .map((m) => ({ label: medLabels[m], text: ingredient.medCautions[m] }))
    .filter((n) => n.text);

  return (
    <div className="rounded-xl bg-accent-soft p-5">
      <p className="text-xs font-medium text-accent">내 기준 · {describeProfile(profile)}</p>
      <p className="mt-2 text-lg font-bold">{intake.target}</p>
      {intake.upper && <p className="mt-1 text-sm">{intake.upper}</p>}
      {medNotes.map((n) => (
        <p key={n.label} className="mt-3 rounded-lg bg-warn-soft p-3 text-sm leading-relaxed text-warn">
          <strong>{n.label}</strong> 복용 중 · {n.text}
        </p>
      ))}
    </div>
  );
}
