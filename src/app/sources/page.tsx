import type { Metadata } from "next";
import { sourceGroups, sources, type SourceGroup } from "@/data/sources";

export const metadata: Metadata = {
  title: "정보처 모음 | 영양제 궁금증 가이드",
};

export default function SourcesPage() {
  const groups = Object.keys(sourceGroups) as SourceGroup[];

  return (
    <div>
      <h1 className="text-2xl font-bold">정보처 모음</h1>
      <p className="mt-2 leading-relaxed text-muted">
        영양제 정보를 확인할 때 믿을 수 있는 곳들입니다. 사이트마다 무엇을 찾을 수 있는지 함께
        정리했어요.
      </p>

      {groups.map((group) => (
        <section key={group} className="mt-10">
          <h2 className="text-lg font-bold">{sourceGroups[group].label}</h2>
          <p className="text-sm text-muted">{sourceGroups[group].description}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {sources
              .filter((s) => s.group === group)
              .map((source) => (
                <li key={source.id} className="rounded-xl border border-border bg-surface p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-bold">{source.name}</p>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-sm text-accent hover:underline"
                      >
                        열기 ↗
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-muted">{source.org}</p>
                  <p className="mt-3 text-sm leading-relaxed">{source.description}</p>
                  <ul className="mt-3 space-y-1 text-sm text-muted">
                    {source.findHere.map((item) => (
                      <li key={item}>· {item}</li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
