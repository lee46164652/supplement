import Link from "next/link";
import QuestionBrowser from "@/components/QuestionBrowser";

const tools = [
  { href: "/assessment", emoji: "📊", title: "영양 종합 평가", desc: "식습관·생활습관으로 부족하기 쉬운 영양소를 점검" },
  { href: "/my", emoji: "🎯", title: "맞춤 정보·추천", desc: "내 기준 섭취량과 검토해 볼 성분, 약 관련 주의사항" },
  { href: "/compare", emoji: "⚖️", title: "내 기준 제품 비교", desc: "하루 비용, 함량, 함께 먹을 때 상한 초과 여부 계산" },
  { href: "/ingredients", emoji: "🧪", title: "성분·원료 정보", desc: "기능성, 섭취 기준, 원료 형태별 차이와 주의사항" },
];

export default function Home() {
  return (
    <div>
      <section className="mb-8">
        <h1 className="text-2xl font-bold leading-snug sm:text-3xl">
          영양제 살 때 궁금한 것,
          <br />
          <span className="text-accent">어디서 확인해야 할지</span> 알려드려요
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          효과, 부작용, 약과 같이 먹어도 되는지, 정품인지… 질문마다 무엇을 확인하고 어떤
          공공기관·자료를 보면 되는지 정리했습니다.
        </p>
      </section>

      <ul className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent"
            >
              <span className="text-2xl">{tool.emoji}</span>
              <span className="mt-2 font-bold">{tool.title}</span>
              <span className="mt-1 text-sm leading-relaxed text-muted">{tool.desc}</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mb-4 text-xl font-bold">자주 하는 질문</h2>
      <QuestionBrowser />
    </div>
  );
}
