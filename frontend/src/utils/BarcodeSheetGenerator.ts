interface Item {
  itemId: string;
  itemName: string;
  barcode?: string;
}

interface BarcodeSheetGeneratorProps {
  item: Item;
  count: number;
}

export const generateBarcodeSheet = ({ item, count }: BarcodeSheetGeneratorProps) => {
  if (!item || !item.barcode || count <= 0) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  let html = `
    <html>
      <head>
        <title>Barcode Sheet - ${item.itemName}</title>
        <style>
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          .barcode-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .barcode-item { text-align: center; border: 1px dashed #ccc; padding: 10px; }
          .barcode-item canvas { margin: 5px 0; }
          .item-info { font-size: 10px; margin-top: 5px; }
          @media print { body { margin: 0; } }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
      </head>
      <body>
        <h3>Barcode Sheet - ${item.itemName}</h3>
        <div class="barcode-grid">
  `;

  for (let i = 0; i < count; i++) {
    html += `
      <div class="barcode-item">
        <canvas id="barcode${i}"></canvas>
        <div class="item-info">
          <div>${item.itemName}</div>
        </div>
      </div>
    `;
  }

  html += `
        </div>
        <script>
          window.onload = function() {
            for (let i = 0; i < ${count}; i++) {
              JsBarcode("#barcode" + i, "${item.barcode}", {
                width: 1,
                height: 40,
                fontSize: 10,
                textMargin: 1
              });
            }
            setTimeout(() => window.print(), 500);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};