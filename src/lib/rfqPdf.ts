export interface RfqPdfLineItem {
  group: string;
  description: string;
  spec?: string;
  unit: string;
  quantity: number;
}

export interface RfqPdfData {
  builder: {
    companyName: string;
    email?: string;
    phone?: string;
    logoUrl?: string;
  };
  project: {
    name: string;
    address: string;
    stage: string;
    scopes: string[];
    createdAt: string;
  };
  items: RfqPdfLineItem[];
  disclaimer: string;
}

export function buildRfqHtml(data: RfqPdfData) {
  const rows = data.items
    .map(
      (item) => `<tr>
<td>${item.group} – ${item.description}</td>
<td>${item.spec ?? ""}</td>
<td>${item.unit}</td>
<td style="text-align:right">${item.quantity}</td>
</tr>`
    )
    .join("");

  return `<!doctype html>
<html><head><meta charset="utf-8" />
<title>Quote Request</title>
<style>
@page { size: A4; margin: 20mm; }
body { font-family: Arial, sans-serif; color: #1f2937; }
.header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
.logo { max-height:48px; max-width:140px; object-fit:contain; }
table { width:100%; border-collapse: collapse; font-size:12px; }
th, td { border-bottom:1px solid #d1d5db; padding:8px 6px; vertical-align:top; }
th { text-align:left; background:#f3f4f6; }
footer { position: fixed; bottom: 6mm; left: 20mm; right:20mm; font-size:10px; color:#6b7280; }
</style></head>
<body>
<div class="header">
<div>
<h1 style="margin:0 0 4px; font-size:18px;">Quote Request</h1>
<div style="font-size:12px;">${data.builder.companyName}</div>
<div style="font-size:12px;">${data.builder.email ?? ""} ${data.builder.phone ?? ""}</div>
</div>
${data.builder.logoUrl ? `<img class="logo" src="${data.builder.logoUrl}" alt="Builder logo"/>` : ""}
</div>
<p><strong>Project:</strong> ${data.project.name}<br/>
<strong>Address:</strong> ${data.project.address}<br/>
<strong>Stage:</strong> ${data.project.stage}<br/>
<strong>Scope(s):</strong> ${data.project.scopes.join("; ")}<br/>
<strong>Date created:</strong> ${data.project.createdAt}</p>
<table>
<thead><tr><th>Description</th><th>Spec</th><th>Unit</th><th>Qty</th></tr></thead>
<tbody>${rows}</tbody>
</table>
<footer>${data.disclaimer}</footer>
</body></html>`;
}

export function printRfqAsPdf(data: RfqPdfData) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(buildRfqHtml(data));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
