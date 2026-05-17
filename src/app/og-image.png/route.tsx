import { ImageResponse } from "next/og";

const size = {
  width: 1200,
  height: 630,
};

function ChartLine({
  color,
  top,
  opacity = 0.85,
}: {
  color: string;
  top: number;
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 620,
        top,
        width: 430,
        height: 4,
        background: color,
        opacity,
        borderRadius: 999,
        transform: "rotate(-7deg)",
        boxShadow: `0 0 26px ${color}`,
      }}
    />
  );
}

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#070B14",
          color: "#E8F1FF",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 78% 28%, rgba(0,194,255,0.24), transparent 32%), radial-gradient(circle at 52% 76%, rgba(122,92,255,0.18), transparent 30%), linear-gradient(135deg, #070B14 0%, #0E1628 58%, #070B14 100%)",
          }}
        />
        {Array.from({ length: 13 }).map((_, index) => (
          <div
            key={`v-${index}`}
            style={{
              position: "absolute",
              left: 72 + index * 88,
              top: 0,
              width: 1,
              height: "100%",
              background: "rgba(232,241,255,0.055)",
            }}
          />
        ))}
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={`h-${index}`}
            style={{
              position: "absolute",
              left: 0,
              top: 72 + index * 72,
              width: "100%",
              height: 1,
              background: "rgba(232,241,255,0.055)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            right: 88,
            top: 86,
            width: 420,
            height: 420,
            border: "1px solid rgba(0,194,255,0.2)",
            borderRadius: 24,
            background: "rgba(232,241,255,0.035)",
            boxShadow: "0 0 80px rgba(0,194,255,0.16)",
          }}
        />
        <ChartLine color="#00C2FF" top={256} />
        <ChartLine color="#7A5CFF" top={318} opacity={0.7} />
        <ChartLine color="#E8F1FF" top={382} opacity={0.45} />
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={`bar-${index}`}
            style={{
              position: "absolute",
              right: 142 + index * 36,
              bottom: 150,
              width: 18,
              height: 64 + ((index * 29) % 126),
              borderRadius: 7,
              background:
                index % 3 === 0
                  ? "rgba(0,194,255,0.56)"
                  : index % 3 === 1
                    ? "rgba(122,92,255,0.48)"
                    : "rgba(232,241,255,0.26)",
              boxShadow: index % 3 === 0 ? "0 0 24px rgba(0,194,255,0.45)" : "none",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 76,
            top: 74,
            display: "flex",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              width: 74,
              height: 74,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#070B14",
              border: "1px solid rgba(232,241,255,0.18)",
              boxShadow: "0 0 36px rgba(0,194,255,0.22)",
              fontSize: 44,
              fontWeight: 800,
              color: "#00C2FF",
            }}
          >
            A
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 29,
                letterSpacing: 8,
                fontWeight: 800,
                color: "#E8F1FF",
              }}
            >
              ALPHAFORGE
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 18,
                letterSpacing: 3,
                color: "rgba(232,241,255,0.55)",
              }}
            >
              MARKET INTELLIGENCE
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 76,
            top: 228,
            display: "flex",
            flexDirection: "column",
            maxWidth: 590,
          }}
        >
          <div
            style={{
              display: "flex",
              width: "fit-content",
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid rgba(0,194,255,0.35)",
              background: "rgba(0,194,255,0.1)",
              color: "#9BEAFF",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            Live data · Risk signals · Global research
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 58,
              lineHeight: 1.02,
              fontWeight: 850,
              letterSpacing: -2,
            }}
          >
            Futuristic market intelligence.
          </div>
          <div
            style={{
              marginTop: 40,
              fontSize: 24,
              lineHeight: 1.35,
              color: "rgba(232,241,255,0.68)",
            }}
          >
            Global stock research with sentiment, volatility, technical signals, and explainable
            market insight.
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 76,
            bottom: 52,
            display: "flex",
            gap: 14,
            color: "rgba(232,241,255,0.64)",
            fontSize: 19,
          }}
        >
          <span>apforges.vercel.app</span>
          <span style={{ color: "#00C2FF" }}>•</span>
          <span>Educational research only</span>
        </div>
      </div>
    ),
    size
  );
}
