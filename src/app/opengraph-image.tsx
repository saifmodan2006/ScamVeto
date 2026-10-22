import { ImageResponse } from "next/og";
export const alt = "ScamVeto — Think before you click.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#050b10",
        color: "#e9fff6",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 90,
        border: "2px solid #1b3440",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ color: "#36f5a2", fontSize: 32, marginBottom: 70 }}>
        ScamVeto.
      </div>
      <div style={{ fontSize: 72, letterSpacing: -3 }}>A second opinion.</div>
      <div style={{ fontSize: 72, color: "#36f5a2", letterSpacing: -3 }}>
        Before the first click.
      </div>
      <div style={{ fontSize: 23, color: "#93aab3", marginTop: 45 }}>
        Detect Deception. Stay Protected.
      </div>
    </div>,
    size,
  );
}
