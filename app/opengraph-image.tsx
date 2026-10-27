import { ImageResponse } from "next/og";

export const alt = "Wolsfelt's Bridal & Tuxedos — Where generations say yes. Aurora, IL since 1973.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(150deg, #f7f3ec 0%, #ede6da 60%, #e8d5cf 100%)",
          color: "#1c1714",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: "#7a5c2b" }}>Aurora, Illinois · Est. 1973</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, lineHeight: 0.95 }}>Where Generations</div>
          <div style={{ display: "flex", fontSize: 120, lineHeight: 0.95 }}>
            <span>Say&nbsp;</span>
            <span style={{ fontStyle: "italic", color: "#9c7c45" }}>Yes</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #c9a96e", paddingTop: 28 }}>
          <div style={{ fontSize: 44 }}>Wolsfelt&rsquo;s Bridal &amp; Tuxedos</div>
          <div style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#7a5c2b" }}>Book your appointment</div>
        </div>
      </div>
    ),
    size,
  );
}
