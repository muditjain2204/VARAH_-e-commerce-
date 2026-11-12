import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const shipmentId = searchParams.get("shipment_id") || "SHP_990142";
  const awb = searchParams.get("awb") || `VRH${Math.floor(100000000 + Math.random() * 900000000)}IN`;
  const courier = searchParams.get("courier") || "Delhivery Surface";
  const orderNumber = searchParams.get("order") || "VRH-20260908-1042";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Shipping Label - ${orderNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 24px;
      background: #f4f4f5;
      display: flex;
      justify-content: center;
    }
    .label {
      width: 400px;
      background: #fff;
      border: 2px solid #000;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #000;
      padding-bottom: 8px;
    }
    .logo {
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .barcode {
      text-align: center;
      margin: 14px 0;
      padding: 8px;
      border: 1px dashed #666;
      background: #fafafa;
    }
    .barcode-bars {
      font-family: monospace;
      font-size: 24px;
      letter-spacing: 4px;
      font-weight: bold;
    }
    .section {
      border-bottom: 1px solid #ddd;
      padding: 8px 0;
      font-size: 12px;
    }
    .routing {
      display: flex;
      justify-content: space-between;
      background: #000;
      color: #fff;
      padding: 6px 10px;
      font-weight: bold;
      font-size: 13px;
      margin-top: 8px;
    }
    .print-btn {
      margin-bottom: 12px;
      padding: 8px 16px;
      background: #800020;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    }
    @media print {
      body { background: none; padding: 0; }
      .print-btn { display: none; }
      .label { box-shadow: none; width: 100%; border: 2px solid #000; }
    }
  </style>
</head>
<body>
  <div>
    <button class="print-btn" onclick="window.print()">🖨️ Print Label</button>
    <div class="label">
      <div class="header">
        <div>
          <div class="logo">MAA LAXMI</div>
          <div style="font-size: 10px; color: #555;">Handcrafted Varanasi Sarees</div>
        </div>
        <div style="text-align: right; font-size: 11px;">
          <strong>Prepaid / Standard</strong><br>
          ${courier}
        </div>
      </div>

      <div class="barcode">
        <div class="barcode-bars">||||| | |||| || ||| |||||</div>
        <div style="font-size: 11px; font-weight: bold; margin-top: 4px;">AWB: ${awb}</div>
        <div style="font-size: 10px; color: #666;">Shipment ID: ${shipmentId}</div>
      </div>

      <div class="routing">
        <span>ORIGIN: VNS / UP</span>
        <span>DEST: STANDARD</span>
      </div>

      <div class="section">
        <strong>DELIVER TO (CONSIGNEE):</strong><br>
        Customer Order: ${orderNumber}<br>
        Delivery within 3-5 business days across India.
      </div>

      <div class="section">
        <strong>RETURN IF UNDELIVERED TO:</strong><br>
        Varah Silk Store Logistics Hub<br>
        K37/42 Godowlia Chowk, Varanasi, UP - 221001<br>
        Support: care@maalaxmi.store | +91 9461500924
      </div>

      <div style="font-size: 10px; color: #777; margin-top: 8px; text-align: center;">
        Goods intended for end consumer consumption. GST Paid invoice included inside package.
      </div>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
