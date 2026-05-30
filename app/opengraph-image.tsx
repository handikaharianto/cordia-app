import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        backgroundColor: "#0f172a",
        padding: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#3b82f6",
            borderRadius: "16px",
            padding: "12px 24px",
            fontSize: "36px",
            fontWeight: 700,
            color: "white",
          }}
        >
          Cordia
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "white",
            marginBottom: "16px",
          }}
        >
          Classroom Finder
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#94a3b8",
            maxWidth: "800px",
          }}
        >
          Find available classrooms and study rooms at Concordia University.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          display: "flex",
          gap: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            padding: "12px 20px",
            fontSize: "20px",
            color: "#e2e8f0",
          }}
        >
          SGW Campus
        </div>
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            padding: "12px 20px",
            fontSize: "20px",
            color: "#e2e8f0",
          }}
        >
          Loyola Campus
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  )
}
