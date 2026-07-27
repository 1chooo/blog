import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const alt = "Hugo Lin Dev's Open Graph Image";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public", "images", "opengraph-image.png"),
  );
  const imagePath = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#18181b",
          fontSize: 60,
          fontWeight: 800,
        }}
      >
        <div style={{ marginTop: 40, color: "#fafafa" }}>
          Hugo
        </div>
        <div style={{ marginTop: 40, color: "#fafafa" }}>
          Dev
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
