document.addEventListener('DOMContentLoaded', function() {
    const customerNameInput = document.getElementById('customerName');
    const billingDateInput = document.getElementById('billingDate');
    const invoiceNumberInput = document.getElementById('invoiceNumber');
    const invoiceDateDisplay = document.getElementById('invoiceDateDisplay');
    const invoiceNumberDisplay = document.getElementById('invoiceNumberDisplay');
    const customerNameDisplay = document.getElementById('customerNameDisplay');

    const itemDescriptionInput = document.getElementById('itemDescription');
    const itemUnitPriceInput = document.getElementById('itemUnitPrice');
    const itemQtyInput = document.getElementById('itemQty');
    const addItemBtn = document.getElementById('addItemBtn');

    const itemsContainer = document.getElementById('items');
    const subtotalAmountSpan = document.getElementById('subtotalAmount');
    const totalAmountSpan = document.getElementById('totalAmount');
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    const goToAdminBtn = document.getElementById('goToAdmin');

    let billItems = [];

    function updateInvoiceMeta() {
        invoiceDateDisplay.textContent = billingDateInput.value;
        invoiceNumberDisplay.textContent = invoiceNumberInput.value;
        customerNameDisplay.textContent = customerNameInput.value;
    }

    function renderBillItems() {
        itemsContainer.innerHTML = `<div class="item-header">
                    <span>DESCRIPTION</span>
                    <span>UNIT PRICE</span>
                    <span>QTY</span>
                    <span>TAXED</span>
                    <span>AMOUNT</span>
                </div>`;
        let subtotal = 0;
        billItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('bill-item');
            const amount = item.quantity * item.unitPrice;
            itemDiv.innerHTML = `
                <span>${item.description}</span>
                <span>₹${item.unitPrice.toFixed(2)}</span>
                <span>${item.quantity}</span>
                <span></span>
                <span>₹${amount.toFixed(2)}</span>
            `;
            itemsContainer.appendChild(itemDiv);
            subtotal += amount;
        });
        subtotalAmountSpan.textContent = `₹${subtotal.toFixed(2)}`;
        totalAmountSpan.textContent = `₹${subtotal.toFixed(2)}`; // Basic total
    }

    addItemBtn.addEventListener('click', function() {
        const description = itemDescriptionInput.value.trim();
        const unitPrice = parseFloat(itemUnitPriceInput.value);
        const quantity = parseInt(itemQtyInput.value, 10);

        if (description && !isNaN(unitPrice) && !isNaN(quantity) && quantity > 0) {
            billItems.push({ description, quantity, unitPrice });
            renderBillItems();
            itemDescriptionInput.value = '';
            itemUnitPriceInput.value = '0.00';
            itemQtyInput.value = 1;
        } else {
            alert('Please enter a description, valid unit price, and quantity.');
        }
    });

    billingDateInput.addEventListener('change', updateInvoiceMeta);
    invoiceNumberInput.addEventListener('change', updateInvoiceMeta);
    customerNameInput.addEventListener('input', updateInvoiceMeta);
    updateInvoiceMeta();
    renderBillItems();

    generatePdfBtn.addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const margin = 15;
        let y = 20;
        const lineHeight = 5;
        const pageWidth = pdf.internal.pageSize.getWidth();

        // Business Info
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('MAA REFRIGERATION', margin, y);
        y += lineHeight * 2;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Near Techno Gurukul School', margin, y);
        y += lineHeight;
        pdf.text('Nabarangpur, ODISHA - 764059', margin, y);
        y += lineHeight;
        pdf.text(`Email: [Your Email ID]`, margin, y);
        y += lineHeight;
        pdf.text(`Mobile: [Your Mobile No]`, margin, y);
        y += lineHeight * 2;

        // Invoice Meta
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('INVOICE', pageWidth - margin - pdf.getTextWidth('INVOICE', { size: 12 }), 20);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`DATE: ${billingDateInput.value}`, pageWidth - margin - 50, 30);
        pdf.text(`INVOICE #: ${invoiceNumberInput.value}`, pageWidth - margin - 50, 38);

        // Bill To
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('BILL TO', margin, y);
        y += lineHeight;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Name: ${customerNameInput.value}`, margin, y);
        y += lineHeight * 2;

        // Items Table Header
        const headers = ['DESCRIPTION', 'UNIT PRICE', 'QTY', 'AMOUNT'];
        const colWidths = [60, 25, 20, 30];
        let currentX = margin;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        headers.forEach((header, i) => {
            pdf.text(header, currentX, y);
            currentX += colWidths[i];
        });
        y += lineHeight;
        pdf.line(margin, y - 1, pageWidth - margin, y - 1);

        // Items
        pdf.setFont('helvetica', 'normal');
        let subtotalPdf = 0;
        billItems.forEach(item => {
            currentX = margin;
            pdf.text(item.description, currentX, y);
            currentX += colWidths[0];
            pdf.text(item.unitPrice.toFixed(2), currentX, y, { align: 'right' });
            currentX += colWidths[1];
            pdf.text(item.quantity.toString(), currentX, y, { align: 'center' });
            currentX += colWidths[2];
            const amount = item.quantity * item.unitPrice;
            pdf.text(amount.toFixed(2), currentX, y, { align: 'right' });
            subtotalPdf += amount;
            y += lineHeight;
        });
        pdf.line(margin, y - 1, pageWidth - margin, y - 1);

        // Totals
        y += lineHeight;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Subtotal', pageWidth - margin - 50, y);
        pdf.setFont('helvetica', 'normal');
        pdf.text(subtotalPdf.toFixed(2), pageWidth - margin, y, { align: 'right' });
        y += lineHeight * 1.5;
        pdf.setFont('helvetica', 'bold');
        pdf.text('TOTAL', pageWidth - margin - 50, y);
        pdf.setFont('helvetica', 'normal');
        pdf.text(subtotalPdf.toFixed(2), pageWidth - margin, y, { align: 'right' });

        // Terms and Bank Details
        y += lineHeight * 3;
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('TERM AND CONDITIONS', margin, y);
        y += lineHeight;
        pdf.setFont('helvetica', 'normal');
        pdf.text('1. Goods once sold will not be taken back or exchanged', margin, y);
        y += lineHeight;
        pdf.text('2. All disputes are subject to Nabarangpur jurisdiction only', margin, y);
        y += lineHeight * 2;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Bank Details', margin, y);
        y += lineHeight;
        pdf.setFont('helvetica', 'normal');
        pdf.text('A/C Holder - [Your Account Holder Name]', margin, y);
        y += lineHeight;
        pdf.text('Account No. - [Your Account Number]', margin, y);
        y += lineHeight;
        pdf.text('IFSC CODE - [Your IFSC Code]', margin, y);
        y += lineHeight;
        pdf.text('Bank Name - [Your Bank Name]', margin, y);

        // Footer
        const footerY = pdf.internal.pageSize.getHeight() - 30;
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text('THIS IS A COMPUTER GENERATED BILL - SIGNATURE NOT REQUIRED', margin, footerY);
        pdf.text('For MAA REFRIGERATION', pageWidth - margin - pdf.getTextWidth('For MAA REFRIGERATION', { size: 8 }), footerY);

        pdf.save(`invoice_${invoiceNumberInput.value || 'TEMP'}.pdf`);
    });

    goToAdminBtn.addEventListener('click', function() {
        window.location.href = 'admin.html';
    });
});