import QRCode from "qrcode";
import sharp from "sharp";

export async function generateQrCode(
  checkInUrl: string,
  qrToken: string,
  accessCode: string
) {
  const qrPayload = `${checkInUrl}/${qrToken}`;

  const qrBuffer = await QRCode.toBuffer(qrPayload, {
    errorCorrectionLevel: "H",
    width: 500,
    margin: 2,
  });

  const label = Buffer.from(`
    <svg width="180" height="70">

      <rect
        width="180"
        height="70"
        rx="12"
        fill="white"
      />

      <text
        x="90"
        y="45"
        text-anchor="middle"
        font-size="24"
        font-family="Arial"
        font-weight="bold"
        fill="black"
      >
        ${accessCode}
      </text>

    </svg>
  `);

  const finalQr = await sharp(qrBuffer)
    .composite([
      {
        input: label,
        gravity: "center",
      },
    ])
    .png()
    .toBuffer();

  return `data:image/png;base64,${finalQr.toString("base64")}`;
}
