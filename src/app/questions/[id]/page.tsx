import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCategory, getQuestion, questions } from "@/data/questions";
import { getSource } from "@/data/sources";

export function generateStaticParams() {
  return questions.map((q) => ({ id: q.id }));
}

export async function generateMetadata(props: PageProps<"/questions/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const question = getQuestion(id);
  return question ? { title: `${question.title} | 영양제 궁금증 가이드` } : {};
}

export default function QuestionPage(props: PageProps<"/questions/[id]">) {
  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/" className="text-sm text-muted hover:text-accent">
        ← 질문 목록
      </Link>
      {/* params는 URL마다 달라서 App Shell 밖(Suspense 안)에서 읽음 */}
      <Suspense fallback={<div className="mt-6 h-40 animate-pulse rounded-xl bg-surface" />}>
        <QuestionDetail params={props.params} />
      </Suspense>
    </article>
  );
}

async function QuestionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = getQuestion(id);
  if (!question) notFound();

  const category = getCategory(question.category);
  const related = questions
    .filter((q) => q.category === question.category && q.id !== question.id)
    .slice(0, 3);

  return (
    <>
      <p className="mt-6 text-sm font-medium text-accent">
        {category.emoji} {category.label}
      </p>
      <h1 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">{question.title}</h1>
      <p className="mt-4 text-lg leading-relaxed">{question.summary}</p>

      <section className="mt-10">
        <h2 className="text-lg font-bold">✔ 무엇을 확인할까</h2>
        <ul className="mt-3 space-y-2">
          {question.checks.map((check) => (
            <li key={check} className="flex gap-3 rounded-lg bg-surface px-4 py-3 leading-relaxed">
              <span className="text-accent">•</span>
              <span>{check}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold">🔎 어디서 찾을까</h2>
        <ol className="mt-3 space-y-3">
          {question.where.map((ref, i) => {
            const source = getSource(ref.sourceId);
            if (!source) return null;
            return (
              <li key={ref.sourceId} className="rounded-xl border border-border bg-surface p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-bold">
                    <span className="mr-2 text-accent">{i + 1}</span>
                    {source.name}
                    <span className="ml-2 text-xs font-normal text-muted">{source.org}</span>
                  </p>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent underline-offset-2 hover:underline"
                    >
                      사이트 열기 ↗
                    </a>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{ref.how}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {question.caution && (
        <aside className="mt-8 rounded-xl bg-warn-soft p-5 leading-relaxed text-warn">
          <strong>주의</strong> · {question.caution}
        </aside>
      )}

      {related.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-sm font-bold text-muted">같은 주제의 다른 질문</h2>
          <ul className="mt-3 space-y-2">
            {related.map((q) => (
              <li key={q.id}>
                <Link href={`/questions/${q.id}`} className="hover:text-accent">
                  {q.title} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
