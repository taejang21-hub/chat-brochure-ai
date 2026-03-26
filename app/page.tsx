"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type CompanyInfo = {
  companyName: string;
  companyIntro: string;
  mainProduct: string;
  targetCustomer: string;
};

type StarterItem = {
  title: string;
  icon: string;
  prompt: string;
  description: string;
};

type ProductPackage = {
  name: string;
  price: string;
  duration: string;
  note: string;
  features: string[];
};

const PHONE_NUMBER = "0507-1338-8402";
const KAKAO_URL = "https://talk.naver.com/ct/wcekgn?frm=home";
const BROCHURE_URL = "https://브로슈어.kr";
const VISIT_ADDRESS =
  "경기도 화성시 효행구 봉담읍 와우안길 109 화성공구유통밸리 109동 211호 방문 상담 가능";

const starterPrompts: StarterItem[] = [
  {
    title: "브로슈어 초안",
    icon: "✦",
    prompt:
      "우리 회사 정보를 바탕으로 브로슈어 초안을 실제 제작 가능한 문서 형태로 작성해줘.",
    description: "표지, 회사소개, 서비스, 스토리까지 초안 생성",
  },
  {
    title: "회사소개서 초안",
    icon: "◼",
    prompt:
      "우리 회사 정보를 바탕으로 회사소개서 초안을 실제 문서 형태로 작성해줘.",
    description: "대외 소개용 문서를 구조적으로 정리",
  },
  {
    title: "제품소개서 초안",
    icon: "◆",
    prompt:
      "우리 회사의 주요 제품과 서비스를 바탕으로 제품소개서 초안을 작성해줘.",
    description: "제품/서비스 설명을 판매 문장으로 정리",
  },
  {
    title: "사업전략 상담",
    icon: "▲",
    prompt:
      "우리 회사의 사업 방향과 홍보 전략을 브로슈어 활용까지 포함해서 실행형으로 상담해줘.",
    description: "막연한 조언이 아니라 실행안 중심으로 정리",
  },
];

const brochurePackages: ProductPackage[] = [
  {
    name: "브로슈어200",
    price: "₩2,000,000",
    duration: "15일",
    note: "부가세, 배송비 별도",
    features: [
      "AI를 활용한 사업 스토리 구축",
      "브로슈어 8p(중철제본) 인쇄 제작 1000부",
      "배포 대행",
      "동일 디자인 재제작 시 50% 할인",
      "월별 주문 제한 없음",
    ],
  },
  {
    name: "브로슈어400",
    price: "₩4,000,000",
    duration: "15일",
    note: "부가세 별도",
    features: [
      "AI를 활용한 사업 스토리 구축",
      "전속 디자이너 배정",
      "사진촬영(제품)",
      "브로슈어 8p(중철제본) 인쇄 제작 1000부",
      "배포 대행",
      "영업 대행(1회)",
      "온라인브로슈어 제작 (월 4만원 정기결제 추가)",
      "명함 3건 무상 제작",
      "배송비 무상 제공",
      "동일 디자인 재제작 시 60% 할인",
      "월별 10건 주문 제한",
    ],
  },
  {
    name: "브로슈어600",
    price: "₩6,000,000",
    duration: "15일",
    note: "부가세 별도",
    features: [
      "AI를 활용한 사업 스토리 구축",
      "전속 디자이너 배정",
      "사진촬영(제품 및 공장, 인물)",
      "브로슈어 16p(중철제본) 인쇄 제작 1000부",
      "인쇄 재질, 후가공 퀄리티 보장",
      "배포 대행",
      "영업 대행(5회)",
      "온라인브로슈어 제작 (월 2만원 정기결제 추가)",
      "명함 5건 무상 제작",
      "배송비 무상 제공",
      "동일 디자인 재제작 시 1회 무상제작",
      "월별 6건 주문 제한",
    ],
  },
  {
    name: "브로슈어800",
    price: "₩8,000,000",
    duration: "15일",
    note: "부가세 별도",
    features: [
      "AI를 활용한 사업 스토리 구축",
      "사업 컨설팅(전문인력) 매칭",
      "전속 디자이너 배정",
      "사진촬영(제품 및 공장, 인물)",
      "영상촬영",
      "브로슈어 16p(중철제본) 인쇄 제작 1000부",
      "인쇄 재질, 후가공 퀄리티 보장",
      "배포 대행",
      "영업 대행(10회)",
      "온라인브로슈어 제작 (비용추가 없음)",
      "명함 10건, 리플렛 1건 무상 제작",
      "배송비 무상 제공",
      "동일 디자인 재제작 시 1회 무상제작",
      "월별 3건 주문 제한",
    ],
  },
  {
    name: "브로슈어1000",
    price: "₩10,000,000",
    duration: "15일",
    note: "부가세 별도",
    features: [
      "AI를 활용한 사업 스토리 구축",
      "사업 컨설팅(전문인력) 매칭",
      "전속 디자이너 배정",
      "사진촬영(제품 및 공장, 인물)",
      "영상촬영",
      "브로슈어 16p(중철제본) 인쇄 제작 1000부",
      "인쇄 재질, 후가공 퀄리티 보장",
      "배포 대행",
      "영업 대행(10회)",
      "온라인브로슈어 제작 (비용추가 없음)",
      "명함 10건, 리플렛 1건 무상 제작",
      "600만원 선결제, 1년 후 잔액 400만원 결제",
      "배송비 무상 제공",
      "동일 디자인 재제작 시 연간 1회씩 평생 무상제작",
      "월별 1건 주문 제한",
    ],
  },
];

function LogoArea() {
  const [imageError, setImageError] = useState(false);

  if (!imageError) {
    return (
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 18,
          overflow: "hidden",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.26)",
          boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
          flexShrink: 0,
        }}
      >
        <img
          src="/logo.png"
          alt="챗브로슈어AI 로고"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: 54,
        height: 54,
        borderRadius: 18,
        background: "rgba(255,255,255,0.16)",
        border: "1px solid rgba(255,255,255,0.28)",
        display: "grid",
        placeItems: "center",
        boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 10,
          background: "#ffffff",
          color: "#9f1239",
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
          fontSize: 12,
          letterSpacing: "-0.04em",
        }}
      >
        CB
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </div>
  );
}

function renderStructuredContent(content: string) {
  const sections = content
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {sections.map((section, sectionIndex) => {
        const lines = section.split("\n").filter(Boolean);

        return (
          <div key={sectionIndex} style={{ display: "grid", gap: 4 }}>
            {lines.map((line, lineIndex) => {
              const trimmed = line.trim();

              if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                return (
                  <div
                    key={lineIndex}
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: "#ffffff",
                      marginBottom: 2,
                    }}
                  >
                    {trimmed}
                  </div>
                );
              }

              if (/^\d+\./.test(trimmed)) {
                return (
                  <div
                    key={lineIndex}
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#ffffff",
                      marginTop: lineIndex === 0 ? 0 : 8,
                    }}
                  >
                    {trimmed}
                  </div>
                );
              }

              if (trimmed.startsWith("-")) {
                return (
                  <div
                    key={lineIndex}
                    style={{
                      paddingLeft: 8,
                      lineHeight: 1.85,
                      color: "rgba(255,255,255,0.95)",
                    }}
                  >
                    {trimmed}
                  </div>
                );
              }

              return (
                <div
                  key={lineIndex}
                  style={{
                    lineHeight: 1.85,
                    color: "rgba(255,255,255,0.96)",
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function PackageCard({ pkg }: { pkg: ProductPackage }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 16,
        background: "rgba(255,255,255,0.86)",
        border: "1px solid rgba(236,72,153,0.10)",
        boxShadow: "0 8px 20px rgba(168,85,247,0.05)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#4c1d95",
              letterSpacing: "-0.04em",
              marginBottom: 4,
            }}
          >
            {pkg.name}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            {pkg.duration} / {pkg.note}
          </div>
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#7c3aed",
            whiteSpace: "nowrap",
          }}
        >
          {pkg.price}
        </div>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        {pkg.features.map((feature, index) => (
          <div
            key={index}
            style={{
              fontSize: 13,
              lineHeight: 1.75,
              color: "#374151",
            }}
          >
            · {feature}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [companyIntro, setCompanyIntro] = useState("");
  const [mainProduct, setMainProduct] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");

  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadRequest, setLeadRequest] = useState("");
  const [showLeadBox, setShowLeadBox] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const companyInfo: CompanyInfo = useMemo(
    () => ({
      companyName,
      companyIntro,
      mainProduct,
      targetCustomer,
    }),
    [companyName, companyIntro, mainProduct, targetCustomer]
  );

  useEffect(() => {
    const savedCompanyInfo = localStorage.getItem("companyInfo");
    const savedMessages = localStorage.getItem("chatMessages");

    if (savedCompanyInfo) {
      try {
        const parsed = JSON.parse(savedCompanyInfo);
        setCompanyName(parsed.companyName || "");
        setCompanyIntro(parsed.companyIntro || "");
        setMainProduct(parsed.mainProduct || "");
        setTargetCustomer(parsed.targetCustomer || "");
      } catch {}
    }

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("companyInfo", JSON.stringify(companyInfo));
  }, [companyInfo]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });

    const assistantCount = messages.filter((m) => m.role === "assistant").length;
    if (assistantCount >= 1) {
      setShowLeadBox(true);
    }
  }, [messages]);

  const sendMessage = async (customInput?: string) => {
    const text = (customInput ?? input).trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
          companyInfo,
        }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data?.message?.content || "AI 응답이 없습니다.",
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "오류가 발생했습니다.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  const clearCompanyInfo = () => {
    setCompanyName("");
    setCompanyIntro("");
    setMainProduct("");
    setTargetCustomer("");
    localStorage.removeItem("companyInfo");
  };

  const clearAll = () => {
    clearMessages();
    clearCompanyInfo();
  };

  const submitLead = () => {
    if (!leadName.trim() || !leadPhone.trim()) {
      alert("이름과 연락처를 입력해주세요.");
      return;
    }

    const summary = `
[챗브로슈어AI 상담 신청]

이름: ${leadName}
연락처: ${leadPhone}
회사명: ${companyName || "미입력"}
주요 고객: ${targetCustomer || "미입력"}
주요 제품/서비스: ${mainProduct || "미입력"}
요청사항: ${leadRequest || "미입력"}
회사 소개: ${companyIntro || "미입력"}
희망 상품 검토: 브로슈어200 / 400 / 600 / 800 / 1000
`;

    const subject = encodeURIComponent("챗브로슈어AI 상담 신청");
    const body = encodeURIComponent(summary);

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setLeadSubmitted(true);
  };

  const printStyles = `
    @media print {
      aside,
      .composer-shell,
      .chip-row,
      .quick-title,
      .sidebar-actions,
      .lead-box,
      .floating-cta {
        display: none !important;
      }

      input, textarea, button {
        display: none !important;
      }

      body {
        background: white !important;
      }

      .main-panel,
      .chat-panel {
        box-shadow: none !important;
        border: none !important;
        background: white !important;
      }

      main {
        padding: 0 !important;
      }
    }
  `;

  const globalStyles = `
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      font-family: Inter, Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif;
      overflow: hidden;
    }
    body {
      color: #0f172a;
      background: #f7f3ff;
    }
    button, input, textarea { font: inherit; }

    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-thumb {
      background: rgba(168,85,247,0.22);
      border-radius: 999px;
    }
    ::-webkit-scrollbar-track { background: transparent; }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: rgba(255,255,255,0.95);
      display: inline-block;
      animation: dotBounce 1.2s infinite ease-in-out;
    }
    .dot:nth-child(2) { animation-delay: 0.15s; }
    .dot:nth-child(3) { animation-delay: 0.3s; }

    @keyframes dotBounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40% { transform: translateY(-4px); opacity: 1; }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .app-shell {
      max-width: 1500px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 330px 1fr;
      gap: 22px;
      position: relative;
      z-index: 1;
      height: calc(100vh - 44px);
      align-items: stretch;
    }

    .sidebar {
      position: sticky;
      top: 20px;
      height: 100%;
      animation: fadeUp 0.55s ease;
    }

    .sidebar-panel {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .main-panel {
      animation: fadeUp 0.65s ease;
      height: 100%;
      overflow: hidden;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0;
      align-items: start;
      margin-bottom: 14px;
      flex-shrink: 0;
    }

    .company-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 14px;
      flex-shrink: 0;
    }

    .chip-row {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 14px;
      flex-shrink: 0;
    }

    .chat-panel {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      position: relative;
      scroll-behavior: smooth;
    }

    .message-row {
      display: flex;
      margin-bottom: 16px;
      animation: fadeUp 0.35s ease;
    }

    .message-row.user { justify-content: flex-end; }
    .message-row.assistant { justify-content: flex-start; }

    .message-bubble {
      max-width: 84%;
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .message-bubble:hover { transform: translateY(-1px); }

    .composer-shell {
      position: relative;
      padding-top: 10px;
      background: linear-gradient(180deg, rgba(250,245,255,0) 0%, rgba(250,245,255,0.84) 14%, rgba(250,245,255,0.98) 100%);
      backdrop-filter: blur(12px);
      flex-shrink: 0;
    }

    .composer-grid {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: center;
    }

    .quick-card {
      transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
    }

    .quick-card:hover {
      transform: translateY(-2px);
      background: rgba(255,255,255,0.18) !important;
      border-color: rgba(255,255,255,0.30) !important;
    }

    .action-btn {
      transition: transform 0.16s ease, opacity 0.16s ease;
    }

    .action-btn:hover {
      transform: translateY(-1px);
      opacity: 0.96;
    }

    .floating-cta {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 50;
      display: grid;
      gap: 10px;
    }

    .package-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .sidebar-actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .sidebar-reset-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin-top: 10px;
    }

    @media (max-width: 1180px) {
      html, body { overflow: auto; }
      .app-shell {
        grid-template-columns: 1fr;
        height: auto;
      }
      .sidebar { position: relative; top: 0; height: auto; }
      .sidebar-panel { height: auto; }
      .main-panel { height: auto; overflow: visible; }
      .package-grid { grid-template-columns: 1fr; }
      .chip-row { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 760px) {
      html, body { overflow: auto; }
      main { padding: 12px !important; }
      .hero-grid { grid-template-columns: 1fr; }
      .company-grid { grid-template-columns: 1fr; }
      .full-span { grid-column: auto !important; }
      .composer-grid { grid-template-columns: 1fr; }
      .message-bubble { max-width: 95% !important; }
      .main-panel { padding: 18px !important; border-radius: 24px !important; height: auto !important; }
      .sidebar-panel { border-radius: 24px !important; padding: 18px !important; }
      .hero-title { font-size: 28px !important; line-height: 1.12 !important; }
      .hero-subtitle { font-size: 14px !important; }
      .floating-cta {
        right: 12px;
        bottom: 12px;
        display: flex;
        gap: 8px;
      }
      .package-grid { grid-template-columns: 1fr; }
      .chip-row { grid-template-columns: 1fr 1fr; }
      .sidebar-actions-grid { grid-template-columns: 1fr 1fr; }
      .sidebar-reset-grid { grid-template-columns: 1fr; }
    }
  `;

  return (
    <>
      <style>{printStyles}</style>
      <style>{globalStyles}</style>

      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #e9f0ff 0%, #f3ecff 52%, #faeff7 100%)",
          padding: "22px",
          color: "#0f172a",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <div className="app-shell">
          <aside className="sidebar">
            <div
              className="sidebar-panel"
              style={{
                background: "rgba(255, 228, 236, 0.72)",
                color: "#6b2143",
                borderRadius: 28,
                padding: 22,
                boxShadow: "0 20px 40px rgba(236,72,153,0.08)",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.42)",
                backdropFilter: "blur(18px)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div>
                    <LogoArea />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "rgba(107,33,67,0.72)",
                        letterSpacing: "0.06em",
                        marginBottom: 4,
                      }}
                    >
                      세계최초 AI 브로슈어 플랫폼
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        letterSpacing: "-0.05em",
                        lineHeight: 1.05,
                        color: "#6b2143",
                      }}
                    >
                      챗브로슈어AI
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.46)",
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 16,
                    color: "#9f1239",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: "#f472b6",
                      display: "inline-block",
                    }}
                  />
                  사업전략 구성을 위한 자체개발 AI모델
                </div>

                <div
                  style={{
                    borderRadius: 20,
                    padding: "18px 16px",
                    background: "rgba(255,255,255,0.42)",
                    border: "1px solid rgba(255,255,255,0.38)",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      lineHeight: 1.3,
                      letterSpacing: "-0.04em",
                      color: "#6b2143",
                      marginBottom: 10,
                    }}
                  >
                    사업 내용을 문서로 바꾸고
                    <br />
                    브로슈어 전략까지 설계합니다
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: 1.85,
                      color: "#7a3652",
                    }}
                  >
                    ① 챗브로슈어AI가 당신 사업의 초안을 먼저 정리합니다. (시간절약)
                    <br />
                    ② 전문 디자이너와 편집자가 배정되어 브로슈어를 완성합니다. (비용절약)
                    <br />
                    ③ 전문가의 손길로 인쇄와 제작을 진행합니다. (퀄리티보장)
                    <br />
                    ④ 마케팅 전략을 설정하고 배포와 영업을 대행합니다. (영업대행)
                    <br />
                    ⑤ 최고의 마케팅 성과를 달성해 드립니다.
                  </div>
                </div>
              </div>

              <div className="sidebar-actions" style={{ flexShrink: 0 }}>
                <div className="sidebar-actions-grid">
                  <a href={`tel:${PHONE_NUMBER}`} style={linkReset}>
                    <div className="action-btn" style={sideButtonPink}>전화 문의</div>
                  </a>
                  <a href={KAKAO_URL} target="_blank" rel="noreferrer" style={linkReset}>
                    <div className="action-btn" style={sideButtonPink}>톡톡 상담</div>
                  </a>
                  <a href={BROCHURE_URL} target="_blank" rel="noreferrer" style={linkReset}>
                    <div className="action-btn" style={sideButtonPink}>브로슈어.kr 이동</div>
                  </a>
                  <button onClick={() => window.print()} className="action-btn" style={sideButtonPink}>
                    PDF로 저장
                  </button>
                </div>

                <div className="sidebar-reset-grid">
                  <button onClick={clearMessages} className="action-btn" style={sideButtonSoft}>
                    대화 초기화
                  </button>
                  <button onClick={clearCompanyInfo} className="action-btn" style={sideButtonSoft}>
                    정보 초기화
                  </button>
                  <button onClick={clearAll} className="action-btn" style={sideButtonSoft}>
                    전체 초기화
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <section
            className="main-panel"
            style={{
              background: "rgba(255,255,255,0.50)",
              backdropFilter: "blur(20px)",
              borderRadius: 28,
              padding: 24,
              border: "1px solid rgba(255,255,255,0.34)",
              boxShadow: "0 20px 48px rgba(99,102,241,0.06)",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <div className="hero-grid">
              <div>
                <div
                  className="hero-subtitle"
                  style={{
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: "#5b5f75",
                  }}
                >
                  똑똑한 AI가 당신 사업이 나아갈 길을 안내합니다. 무료로 챗브로슈어AI를 활용하세요.
                </div>
              </div>
            </div>

            <div className="company-grid">
              <input
                type="text"
                placeholder="회사명"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={fieldStylePremium}
              />
              <input
                type="text"
                placeholder="주요 고객"
                value={targetCustomer}
                onChange={(e) => setTargetCustomer(e.target.value)}
                style={fieldStylePremium}
              />
              <input
                type="text"
                placeholder="주요 제품/서비스"
                value={mainProduct}
                onChange={(e) => setMainProduct(e.target.value)}
                className="full-span"
                style={{ ...fieldStylePremium, gridColumn: "1 / 3" }}
              />
              <textarea
                placeholder="회사 소개를 입력하세요. 예: 제조업과 공공기관을 대상으로 브로슈어, 카탈로그, 명함, 전단 등 다양한 인쇄물을 제작·공급하는 인쇄 편의 플랫폼입니다."
                value={companyIntro}
                onChange={(e) => setCompanyIntro(e.target.value)}
                className="full-span"
                style={{
                  ...fieldStylePremium,
                  gridColumn: "1 / 3",
                  minHeight: 88,
                  resize: "vertical",
                  paddingTop: 14,
                }}
              />
            </div>

            <div className="chip-row">
              {starterPrompts.map((item, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(item.prompt)}
                  disabled={loading}
                  className="quick-card"
                  style={{
                    textAlign: "left",
                    padding: 14,
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.40)",
                    background: "rgba(255,255,255,0.72)",
                    color: "#6b2143",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, lineHeight: 1.4 }}>
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#8a4b67",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </div>
                </button>
              ))}
            </div>

            <div
              className="chat-panel"
              style={{
                borderRadius: 24,
                background: "rgba(255,255,255,0.58)",
                border: "1px solid rgba(255,255,255,0.34)",
                padding: 20,
                marginBottom: 12,
                backdropFilter: "blur(14px)",
              }}
            >
              {messages.length === 0 ? (
                <div
                  style={{
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                    padding: "24px 20px",
                  }}
                >
                  <div>
                  <div
  style={{
    width: 76,
    height: 76,
    borderRadius: 24,
    margin: "0 auto 14px",
    overflow: "hidden",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 18px 40px rgba(67,56,202,0.20)",
    display: "grid",
    placeItems: "center",
  }}
>
  <img
    src="/logo.png"
    alt="챗브로슈어AI 로고"
    style={{
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
</div>

                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        letterSpacing: "-0.05em",
                        color: "#1e1b4b",
                        marginBottom: 8,
                      }}
                    >
                      무엇을 정리해드릴까요?
                    </div>

                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: 1.75,
                        color: "#5b5f75",
                      }}
                    >
                      회사 정보를 입력한 뒤, 가운데 작업 버튼을 누르거나
                      <br />
                      아래 입력창에서 바로 요청하면 됩니다.
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((m, i) => (
                    <div key={i} className={`message-row ${m.role}`}>
                      <div
                        className="message-bubble"
                        style={{
                          padding: "16px 18px",
                          borderRadius: 22,
                          background:
                            "linear-gradient(135deg, #1e3a8a 0%, #4338ca 52%, #7e22ce 100%)",
                          color: "#ffffff",
                          border: "none",
                          lineHeight: 1.8,
                          whiteSpace: "pre-wrap",
                          boxShadow: "0 14px 30px rgba(67,56,202,0.18)",
                        }}
                      >
                        {m.role === "assistant" ? (
                          renderStructuredContent(m.content)
                        ) : (
                          <div style={{ lineHeight: 1.8, color: "#ffffff" }}>
                            {m.content}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="message-row assistant">
                      <div
                        className="message-bubble"
                        style={{
                          padding: "16px 18px",
                          borderRadius: 22,
                          background:
                            "linear-gradient(135deg, #1e3a8a 0%, #4338ca 52%, #7e22ce 100%)",
                          color: "#ffffff",
                          boxShadow: "0 14px 30px rgba(67,56,202,0.18)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <LoadingDots />
                        <span>AI가 초안과 전략을 정리 중입니다...</span>
                      </div>
                    </div>
                  )}

                  {showLeadBox && (
                    <div
                      className="lead-box"
                      style={{
                        marginTop: 14,
                        border: "1px solid rgba(168,85,247,0.12)",
                        background: "rgba(255,255,255,0.82)",
                        borderRadius: 24,
                        padding: 18,
                        boxShadow: "0 10px 24px rgba(168,85,247,0.05)",
                        backdropFilter: "blur(14px)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#1e1b4b",
                          marginBottom: 8,
                          letterSpacing: "-0.04em",
                        }}
                      >
                        초안이 어느 정도 정리되었습니다
                      </div>

                      <div
                        style={{
                          fontSize: 14,
                          color: "#4b5563",
                          lineHeight: 1.8,
                          marginBottom: 14,
                        }}
                      >
                        이제 브로슈어.kr 상품과 연결해서 브로슈어 제작, 회사소개서 완성,
                        배포 대행, 영업 대행 상담까지 이어갈 수 있습니다.
                      </div>

                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: "#6d28d9",
                          marginBottom: 12,
                          letterSpacing: "-0.03em",
                        }}
                      >
                        브로슈어.kr 상품 안내
                      </div>

                      <div className="package-grid" style={{ marginBottom: 16 }}>
                        {brochurePackages.map((pkg) => (
                          <PackageCard key={pkg.name} pkg={pkg} />
                        ))}
                      </div>

                      {leadSubmitted ? (
                        <div
                          style={{
                            padding: "14px 16px",
                            borderRadius: 16,
                            background: "#ecfdf3",
                            color: "#027a48",
                            fontWeight: 700,
                          }}
                        >
                          상담 신청 작성이 시작되었습니다. 메일 창이 열리지 않았다면 전화 또는 톡톡 상담으로 바로 연결해주세요.
                        </div>
                      ) : (
                        <>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 10,
                              marginBottom: 10,
                            }}
                          >
                            <input
                              type="text"
                              placeholder="이름"
                              value={leadName}
                              onChange={(e) => setLeadName(e.target.value)}
                              style={leadFieldStyle}
                            />
                            <input
                              type="text"
                              placeholder="연락처"
                              value={leadPhone}
                              onChange={(e) => setLeadPhone(e.target.value)}
                              style={leadFieldStyle}
                            />
                          </div>

                          <textarea
                            placeholder="원하는 상담 내용을 입력하세요. 예: 브로슈어600 검토 + 영업대행 상담 원함"
                            value={leadRequest}
                            onChange={(e) => setLeadRequest(e.target.value)}
                            style={{
                              ...leadFieldStyle,
                              minHeight: 100,
                              resize: "vertical",
                              marginBottom: 12,
                              width: "100%",
                              paddingTop: 14,
                            }}
                          />

                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 10,
                            }}
                          >
                            <button onClick={submitLead} style={primaryCtaStyle}>
                              상담 신청 보내기
                            </button>

                            <a href={`tel:${PHONE_NUMBER}`} style={linkReset}>
                              <div style={secondaryCtaStyle}>전화 문의</div>
                            </a>

                            <a href={KAKAO_URL} target="_blank" rel="noreferrer" style={linkReset}>
                              <div style={secondaryCtaStyle}>톡톡 상담</div>
                            </a>
                          </div>

                          <div
                            style={{
                              marginTop: 12,
                              fontSize: 13,
                              color: "#667085",
                              lineHeight: 1.7,
                            }}
                          >
                            방문 상담 가능: {VISIT_ADDRESS}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            <div className="composer-shell">
              <div className="composer-grid">
                <div
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(255,255,255,0.40)",
                    borderRadius: 22,
                    padding: 8,
                    boxShadow: "0 8px 20px rgba(168,85,247,0.04)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    placeholder="예: 우리 회사 브로슈어 목차를 실제 제작용으로 정리해줘"
                    style={{
                      width: "100%",
                      height: 56,
                      padding: "0 16px",
                      border: "none",
                      borderRadius: 18,
                      fontSize: 15,
                      color: "#1e1b4b",
                      backgroundColor: "transparent",
                      outline: "none",
                    }}
                  />
                </div>

                <button
                  onClick={() => sendMessage()}
                  disabled={loading}
                  className="action-btn"
                  style={{
                    height: 72,
                    padding: "0 22px",
                    border: "none",
                    borderRadius: 22,
                    background:
                      "linear-gradient(135deg, #1e3a8a 0%, #4338ca 52%, #7e22ce 100%)",
                    color: "#ffffff",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    minWidth: 96,
                    boxShadow: "0 16px 32px rgba(67,56,202,0.18)",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  전송
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="floating-cta">
          <a href={`tel:${PHONE_NUMBER}`} style={linkReset}>
            <div style={floatingTextCta}>
              <img
                src="/ph.png"
                alt="전화문의"
                style={{
                  display: "block",
                  width: "auto",
                  height: "auto",
                  maxWidth: 52,
                  maxHeight: 52,
                  objectFit: "contain",
                }}
              />
            </div>
          </a>
          <a href={KAKAO_URL} target="_blank" rel="noreferrer" style={linkReset}>
            <div style={floatingTextCta}>
              <img
                src="/ta.png"
                alt="톡톡"
                style={{
                  display: "block",
                  width: "auto",
                  height: "auto",
                  maxWidth: 52,
                  maxHeight: 52,
                  objectFit: "contain",
                }}
              />
            </div>
          </a>
        </div>
      </main>
    </>
  );
}

const fieldStylePremium: React.CSSProperties = {
  height: 54,
  padding: "0 16px",
  border: "1px solid rgba(255,255,255,0.42)",
  borderRadius: 18,
  fontSize: 14,
  backgroundColor: "rgba(255,255,255,0.86)",
  color: "#1e1b4b",
  outline: "none",
  boxShadow: "0 4px 14px rgba(168,85,247,0.03)",
  backdropFilter: "blur(10px)",
};

const sideButtonPink: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.44)",
  backgroundColor: "rgba(255,255,255,0.52)",
  color: "#9f1239",
  fontSize: 14,
  cursor: "pointer",
  textAlign: "center",
  fontWeight: 700,
};

const sideButtonSoft: React.CSSProperties = {
  padding: "12px 10px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.34)",
  backgroundColor: "rgba(255,255,255,0.32)",
  color: "#7a3652",
  fontSize: 13,
  cursor: "pointer",
  textAlign: "center",
};

const primaryCtaStyle: React.CSSProperties = {
  padding: "13px 18px",
  borderRadius: 14,
  border: "none",
  background:
    "linear-gradient(135deg, #1e3a8a 0%, #4338ca 52%, #7e22ce 100%)",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryCtaStyle: React.CSSProperties = {
  padding: "13px 18px",
  borderRadius: 14,
  border: "1px solid rgba(168,85,247,0.14)",
  background: "#ffffff",
  color: "#7c3aed",
  fontWeight: 700,
  cursor: "pointer",
};

const floatingTextCta: React.CSSProperties = {
  padding: "8px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.92)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 14px 28px rgba(168,85,247,0.08)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.55)",
};

const leadFieldStyle: React.CSSProperties = {
  height: 50,
  padding: "0 14px",
  border: "1px solid rgba(168,85,247,0.12)",
  borderRadius: 14,
  fontSize: 14,
  backgroundColor: "#ffffff",
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
};

const linkReset: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};