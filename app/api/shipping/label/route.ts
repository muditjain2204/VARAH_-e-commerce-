import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const orderId = searchParams.get("orderId") || searchParams.get("order_id");
  const orderQuery = searchParams.get("order");
  const shipmentIdParam = searchParams.get("shipment_id");
  const type = searchParams.get("type") || "all"; // "label", "invoice", or "all"

  let order: any = null;

  try {
    if (orderId || orderQuery || shipmentIdParam) {
      order = await prisma.order.findFirst({
        where: {
          OR: [
            ...(orderId ? [{ id: orderId }] : []),
            ...(orderQuery ? [{ orderNumber: orderQuery }, { id: orderQuery }] : []),
            ...(shipmentIdParam ? [{ shipping: { shipmentId: shipmentIdParam } }] : []),
          ],
        },
        include: {
          items: true,
          address: true,
          shipping: true,
          payment: true,
        },
      });
    }
  } catch (err) {
    console.warn("Could not query order in shipping label route:", err);
  }

  // Fallbacks if not found or testing standalone
  const orderNumber = order?.orderNumber || orderQuery || "VRH-20261113-9041";
  const awb =
    order?.shipping?.awbCode ||
    searchParams.get("awb") ||
    `DLV${Math.floor(1000000000 + Math.random() * 9000000000)}IN`;
  const courier = order?.shipping?.courierName || searchParams.get("courier") || "Delhivery Surface";
  const shipmentId = order?.shipping?.shipmentId || shipmentIdParam || "SHP_990142";
  const customerName = order?.address?.fullName || "Valued Saree Connoisseur";
  const addressLine1 = order?.address?.addressLine1 || "C-42, Royal Residency, MG Road";
  const addressLine2 = order?.address?.addressLine2 || "";
  const city = order?.address?.city || "Jaipur";
  const state = order?.address?.state || "Rajasthan";
  const pincode = order?.address?.pincode || "302001";
  const phone = order?.address?.phone || "9461500924";
  const totalAmount = order ? Number(order.total) : 4999;
  const subtotal = order ? Number(order.subtotal) : 4999;
  const shippingCharge = order ? Number(order.shippingCharge) : 0;
  const paymentMethod = order?.payment?.method || "Prepaid (Razorpay / UPI)";
  const weight = order?.shipping?.weight
    ? `${Number(order.shipping.weight)} kg`
    : `${order?.items?.length ? Math.max(0.8, order.items.length * 0.8) : 0.8} kg`;

  const items = order?.items || [
    {
      name: "Pure Banarasi Silk Zari Saree",
      sku: "BNR-SLK-1196",
      quantity: 1,
      price: totalAmount,
    },
  ];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Shipping Documentation - ${orderNumber}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      margin: 0;
      padding: 24px;
      background: #f4f4f5;
      color: #111;
    }
    .container {
      max-width: 820px;
      margin: 0 auto;
    }
    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 12px;
      flex-wrap: wrap;
    }
    .print-btn {
      padding: 10px 20px;
      background: #800020;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    .print-btn:hover { background: #600018; }
    .toggle-links {
      display: flex;
      gap: 8px;
    }
    .toggle-btn {
      padding: 8px 14px;
      background: #fff;
      border: 1px solid #d4d4d8;
      border-radius: 6px;
      text-decoration: none;
      color: #3f3f46;
      font-size: 13px;
      font-weight: 500;
    }
    .toggle-btn.active {
      background: #27272a;
      color: #fff;
      border-color: #27272a;
    }

    /* Shipping Label Card */
    .shipping-label {
      background: #fff;
      border: 2px solid #000;
      padding: 18px;
      margin-bottom: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }
    .label-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #000;
      padding-bottom: 12px;
    }
    .brand-name {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #800020;
    }
    .brand-sub {
      font-size: 11px;
      color: #52525b;
      margin-top: 2px;
    }
    .courier-box {
      text-align: right;
      font-size: 12px;
    }
    .courier-name {
      font-size: 16px;
      font-weight: 800;
      color: #000;
    }
    .barcode-section {
      text-align: center;
      padding: 14px 0;
      border-bottom: 1px solid #000;
      background: #fafafa;
    }
    .barcode-svg {
      letter-spacing: 6px;
      font-family: monospace;
      font-size: 26px;
      font-weight: bold;
    }
    .awb-text {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 1px;
      margin-top: 4px;
    }
    .meta-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      border-bottom: 1px solid #000;
      font-size: 12px;
      background: #f4f4f5;
    }
    .meta-cell {
      padding: 8px 10px;
      border-right: 1px solid #000;
    }
    .meta-cell:last-child { border-right: none; }
    .routing-tag {
      background: #000;
      color: #fff;
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.5px;
    }
    .address-section {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      border-bottom: 1px solid #000;
      font-size: 12px;
    }
    .address-block {
      padding: 12px;
      line-height: 1.5;
    }
    .address-block:first-child {
      border-right: 1px solid #000;
    }
    .consignee-name {
      font-size: 14px;
      font-weight: 800;
      color: #000;
      margin-bottom: 4px;
    }

    /* Invoice / Packing Slip */
    .invoice-card {
      background: #fff;
      border: 1px solid #e4e4e7;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }
    .inv-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #800020;
      padding-bottom: 16px;
      margin-bottom: 16px;
    }
    table.inv-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 13px;
    }
    table.inv-table th {
      background: #f4f4f5;
      padding: 8px 12px;
      text-align: left;
      border-bottom: 2px solid #d4d4d8;
      font-weight: 600;
    }
    table.inv-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #e4e4e7;
    }
    .totals-area {
      display: flex;
      justify-content: flex-end;
      font-size: 13px;
    }
    .totals-table {
      width: 280px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    }
    .totals-row.grand {
      font-size: 16px;
      font-weight: 800;
      border-top: 2px solid #000;
      padding-top: 8px;
      margin-top: 4px;
      color: #800020;
    }

    @media print {
      body { background: none; padding: 0; }
      .action-bar { display: none; }
      .container { max-width: 100%; }
      .shipping-label { box-shadow: none; page-break-after: always; }
      .invoice-card { box-shadow: none; border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="action-bar">
      <button class="print-btn" onclick="window.print()">
        🖨️ Print Document
      </button>
      <div class="toggle-links">
        <a href="?order=${orderNumber}&type=all" class="toggle-btn ${type === "all" ? "active" : ""}">Label + Packing Slip</a>
        <a href="?order=${orderNumber}&type=label" class="toggle-btn ${type === "label" ? "active" : ""}">Label Only</a>
        <a href="?order=${orderNumber}&type=invoice" class="toggle-btn ${type === "invoice" ? "active" : ""}">Invoice Only</a>
      </div>
    </div>

    ${type === "all" || type === "label" ? `
    <!-- OFFICIAL SHIPPING LABEL -->
    <div class="shipping-label">
      <div class="label-header">
        <div>
          <div class="brand-name">MAA LAXMI</div>
          <div class="brand-sub">Authentic Handcrafted Varanasi Sarees</div>
        </div>
        <div class="courier-box">
          <div class="courier-name">${courier.toUpperCase()}</div>
          <span style="display:inline-block; margin-top:2px; font-weight:700; background:#22c55e; color:#fff; padding:2px 6px; border-radius:4px; font-size:10px;">
            ${paymentMethod.includes("COD") ? "COD / CASH ON DELIVERY" : "PREPAID — SAFE DISPATCH"}
          </span>
        </div>
      </div>

      <div class="barcode-section">
        <div class="barcode-svg">||| | |||| || ||| ||||| || ||||</div>
        <div class="awb-text">AWB: ${awb}</div>
        <div style="font-size: 11px; color: #71717a; margin-top: 2px;">Shipment ID: ${shipmentId}</div>
      </div>

      <div class="routing-tag">
        <span>ORIGIN: VNS / VARANASI HUB</span>
        <span>DEST PIN: ${pincode}</span>
      </div>

      <div class="meta-row">
        <div class="meta-cell"><strong>Order No:</strong><br>${orderNumber}</div>
        <div class="meta-cell"><strong>Package Weight:</strong><br>${weight}</div>
        <div class="meta-cell"><strong>Declared Value:</strong><br>₹${totalAmount.toLocaleString("en-IN")}</div>
      </div>

      <div class="address-section">
        <div class="address-block">
          <div style="font-size:10px; font-weight:700; color:#71717a; text-transform:uppercase;">Deliver To (Consignee):</div>
          <div class="consignee-name">${customerName}</div>
          <div>${addressLine1}</div>
          ${addressLine2 ? `<div>${addressLine2}</div>` : ""}
          <div style="font-weight:700; margin-top:2px;">${city}, ${state} - ${pincode}</div>
          <div style="margin-top:4px; font-weight:600;">📞 Contact: +91 ${phone}</div>
        </div>

        <div class="address-block" style="background:#fafafa;">
          <div style="font-size:10px; font-weight:700; color:#71717a; text-transform:uppercase;">Return If Undelivered To:</div>
          <div style="font-weight:700; color:#800020;">MAA LAXMI SAREES</div>
          <div>K37/42 Godowlia Chowk</div>
          <div>Varanasi, UP - 221001</div>
          <div style="margin-top:4px;">📞 +91 94615 00924</div>
          <div style="font-size:11px; color:#52525b;">care@maalaxmi.store</div>
        </div>
      </div>

      <div style="padding: 10px 12px; font-size: 11px; color: #52525b; display: flex; justify-content: space-between; align-items: center;">
        <span>Contents: Handcrafted Indian Sarees (GST Paid)</span>
        <span style="font-weight: bold; color: #000;">Inspect upon delivery. Handle with care.</span>
      </div>
    </div>
    ` : ""}

    ${type === "all" || type === "invoice" ? `
    <!-- TAX INVOICE & PACKING SLIP -->
    <div class="invoice-card">
      <div class="inv-header">
        <div>
          <div style="font-size: 22px; font-weight: 900; color: #800020; font-family: serif;">MAA LAXMI SAREES</div>
          <div style="font-size: 11px; color: #52525b; margin-top: 2px;">
            Godowlia Chowk, Varanasi, UP - 221001<br>
            GSTIN: 09AABCM1429K1Z5 | Phone: +91 94615 00924
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 18px; font-weight: 800; color: #18181b;">TAX INVOICE & PACKING SLIP</div>
          <div style="font-size: 12px; color: #52525b; margin-top: 2px;">Invoice #: INV-${orderNumber.replace("VRH-", "")}</div>
          <div style="font-size: 12px; color: #52525b;">Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 12px; margin-bottom: 16px;">
        <div style="background: #fafafa; padding: 12px; border-radius: 6px;">
          <strong>Billed & Shipped To:</strong><br>
          <span style="font-weight: 700; font-size: 13px;">${customerName}</span><br>
          ${addressLine1}<br>
          ${addressLine2 ? `${addressLine2}<br>` : ""}
          ${city}, ${state} - ${pincode}<br>
          Phone: +91 ${phone}
        </div>
        <div style="background: #fafafa; padding: 12px; border-radius: 6px;">
          <strong>Dispatch & Logistics Details:</strong><br>
          Order Reference: <strong>${orderNumber}</strong><br>
          Courier Partner: <strong>${courier}</strong><br>
          Air Waybill (AWB): <strong style="font-family: monospace;">${awb}</strong><br>
          Payment: <strong>${paymentMethod}</strong>
        </div>
      </div>

      <table class="inv-table">
        <thead>
          <tr>
            <th>Item Description</th>
            <th>SKU</th>
            <th>HSN</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Rate (₹)</th>
            <th style="text-align: right;">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((it: any) => `
            <tr>
              <td><strong>${it.name}</strong></td>
              <td style="font-family: monospace; font-size: 12px;">${it.sku || "SAREE-GEN"}</td>
              <td>5208</td>
              <td style="text-align: center;">${it.quantity}</td>
              <td style="text-align: right;">${Number(it.price).toLocaleString("en-IN")}</td>
              <td style="text-align: right;"><strong>${(Number(it.price) * it.quantity).toLocaleString("en-IN")}</strong></td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="totals-area">
        <div class="totals-table">
          <div class="totals-row">
            <span>Item Subtotal:</span>
            <span>₹${subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div class="totals-row">
            <span>Shipping & Handling:</span>
            <span>${shippingCharge === 0 ? "FREE" : `₹${shippingCharge.toLocaleString("en-IN")}`}</span>
          </div>
          <div class="totals-row">
            <span>GST Included (5%):</span>
            <span>₹${Math.round(totalAmount * 0.05).toLocaleString("en-IN")}</span>
          </div>
          <div class="totals-row grand">
            <span>Total Value:</span>
            <span>₹${totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div style="margin-top: 24px; padding-top: 14px; border-top: 1px dashed #d4d4d8; font-size: 11px; color: #71717a; text-align: center;">
        Thank you for honoring Indian textile traditions with Maa Laxmi Sarees, Varanasi. For any inquiries, WhatsApp us at +91 94615 00924.
      </div>
    </div>
    ` : ""}
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
