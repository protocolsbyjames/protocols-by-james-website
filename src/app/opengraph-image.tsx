import { ImageResponse } from "next/og";

export const alt =
  "Protocols by James — Personalized physique and self-optimization coaching";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(ellipse at top left, #1a1a14 0%, #000000 55%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "20px",
            letterSpacing: "6px",
            color: "#bdb391",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "3px",
              background: "#bdb391",
            }}
          />
          <span>Protocols by James</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: "96px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
            }}
          >
            <span>Build your&nbsp;</span>
            <span style={{ color: "#bdb391" }}>best self</span>
            <span>.</span>
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#a1a1aa",
              maxWidth: "900px",
              lineHeight: 1.35,
            }}
          >
            Physique, confidence, and performance coaching — personalized
            training, nutrition, and protocols.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            fontSize: "22px",
            color: "#71717a",
          }}
        >
          <div>protocolsbyjames.com</div>
          <div style={{ display: "flex", gap: "32px" }}>
            <div>50+ transformations</div>
            <div>8+ years coaching</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
