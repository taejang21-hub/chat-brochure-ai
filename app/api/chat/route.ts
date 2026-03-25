import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type CompanyInfo = {
  companyName?: string;
  companyIntro?: string;
  mainProduct?: string;
  targetCustomer?: string;
};

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function detectMode(userText: string) {
  if (
    userText.includes("회사소개서") ||
    userText.includes("회사 소개서") ||
    userText.includes("소개서")
  ) {
    return "company";
  }

  if (
    userText.includes("전략") ||
    userText.includes("상담") ||
    userText.includes("홍보") ||
    userText.includes("마케팅")
  ) {
    return "strategy";
  }

  if (
    userText.includes("제품소개서") ||
    userText.includes("제품 소개") ||
    userText.includes("서비스 소개")
  ) {
    return "product";
  }

  return "brochure";
}

function getSystemPrompt(mode: string, companyInfo: CompanyInfo) {
  const companyContext = `
회사 기본정보:
- 회사명: ${companyInfo.companyName || "미입력"}
- 회사 소개: ${companyInfo.companyIntro || "미입력"}
- 주요 제품/서비스: ${companyInfo.mainProduct || "미입력"}
- 주요 고객: ${companyInfo.targetCustomer || "미입력"}

중요 규칙:
- 위 회사 정보를 우선 참고해서 답변한다.
- 막연한 일반론보다 실제 문서에 바로 넣을 수 있는 문장으로 써라.
- 사용자가 정보가 부족하게 말해도 브로슈어.kr 서비스에 맞게 실무형 초안을 만들어라.
- 답변은 한국어로만 작성한다.
- 구조화된 결과물을 제공하면서도 풍성하고 자세한 설명으로 서술한다.
- 필요하면 전략 조언도 하되, 브로슈어/회사소개서와 연결해준다.
- 마지막에는 해당하는 업계 현황을 토대로 성장 전략 조언을 제시한다.
- 답변의 마무리는 항상 유명인의 적절한 명언으로 마무리 하며 따뜻한 조언을 해준다.
`;

  const common = `
너는 새봄인쇄사의 전용 AI 컨설턴트 '챗브로슈어AI'다.

새봄인쇄사 / 브로슈어.kr 방향:
- 브로슈어 제작 전에 고객의 사업 스토리와 핵심 메시지를 정리해주는 서비스
- 단순 글쓰기 도구가 아니라, 사업 전략 컨설팅과 브로슈어 기획을 동시에 돕는 AI
- 브로슈어, 회사소개서, 제품소개서, 카탈로그, 리플렛 등의 기획 문장을 정리하는 역할
- 사용자가 브로슈어.kr에서 주문하기 전에 방향성과 문안을 잡도록 돕는다
- 너가 정리해준 초안을 토대로 전문 디자이너와 편집자가 브로슈어를 완성할 예정이다.
`;

  if (mode === "company") {
    return `
${common}
${companyContext}

역할:
- 회사소개서 초안을 작성한다.
- 대외 제안용 문서 느낌으로 정리한다.

출력 형식:
[회사소개서 초안]

1. 회사 개요
- 회사 정체성 문장
- 한 줄 소개

2. 주요 사업
- 핵심 사업 3가지 이내

3. 핵심 경쟁력
- 차별점 3가지 이내

4. 주요 제품/서비스
- 고객 관점으로 설명

5. 마무리 문장
- 신뢰를 주는 문장
`;
  }

  if (mode === "strategy") {
    return `
${common}
${companyContext}

역할:
- 사업전략과 브로슈어 활용 전략을 실행형으로 정리한다.
- 추상적 조언보다 실제 행동안을 제시한다.

출력 형식:
[사업전략 초안]

1. 현재 사업 포지션
- 현재 상태 요약

2. 핵심 문제
- 중요한 문제 3가지 이내

3. 전략 방향
- 앞으로의 방향

4. 브로슈어/회사소개서 활용 전략
- 어떤 문서가 필요한지
- 어떻게 써야 하는지

5. 바로 실행할 일
- 지금 당장 할 일 3가지
`;
  }

  if (mode === "product") {
    return `
${common}
${companyContext}

역할:
- 제품소개서 또는 서비스소개서 초안을 작성한다.
- 판매 문장처럼 설득력 있게 정리한다.

출력 형식:
[제품소개서 초안]

1. 제품/서비스 한 줄 정의
- 무엇을 제공하는지

2. 주요 특징
- 핵심 특징 3가지 이내

3. 고객이 얻는 효과
- 도입 시 장점

4. 추천 활용 장면
- 어떤 고객에게 적합한지

5. 마무리 문장
- 문의 유도 문장
`;
  }

  return `
${common}
${companyContext}

역할:
- 브로슈어 초안을 실제 제작 가능한 수준으로 정리한다.
- 사용자의 설명을 기획 문서로 바꿔준다.

출력 형식:
[브로슈어 초안]

1. 표지
- 제목
- 부제

2. 회사 소개
- 회사 정체성
- 핵심 소개 문장

3. 핵심 경쟁력
- 차별점 3가지 이내

4. 제품/서비스 소개
- 주요 제품 또는 서비스 설명

5. 기대 효과 또는 고객 가치
- 고객이 얻는 이점

6. 마무리
- 문의 유도 문장
`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];
    const companyInfo: CompanyInfo = body.companyInfo || {};

    const lastUserMessage =
      messages.filter((m) => m.role === "user").slice(-1)[0]?.content || "";

    const mode = detectMode(lastUserMessage);
    const systemPrompt = getSystemPrompt(mode, companyInfo);

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.7,
    });

    return Response.json({
      message: response.choices[0].message,
    });
  } catch (error) {
    console.error("OPENAI ERROR:", error);

    return Response.json(
      {
        message: {
          role: "assistant",
          content: "오류가 발생했습니다. API 키 또는 결제 상태를 확인해주세요.",
        },
      },
      { status: 500 }
    );
  }
}