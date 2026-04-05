import { ImageResponse } from "next/og";

export const alt = "Shortener-Paste";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: "-0.02em",
          }}
        >
          Shortener-Paste
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            marginTop: "16px",
          }}
        >
          Shorten links & share text instantly
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#3b82f6",
            marginTop: "32px",
          }}
        >
          url.stephen-ali.com
        </div>
      </div>
    ),
    { ...size }
  );
}
