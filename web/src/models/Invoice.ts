import BillingDocument, { BillingDocumentData } from "./BillingDocument";

export interface InvoiceData extends BillingDocumentData {
  invoiceNumber: string;
  invoiceDate: string;
  quotationNumber?: string;
  purchaseOrderNumber?: string;
}

export default class Invoice extends BillingDocument {
  public invoiceNumber = "";
  public invoiceDate = "";
  public quotationNumber = "";
  public purchaseOrderNumber = "";

  constructor(data?: Partial<InvoiceData>) {
    super(data);
    if (!data) return;
    this.parse(data);
  }

  public parse(data: Partial<InvoiceData>) {
    super.parse(data);
    this.invoiceNumber = data.invoiceNumber || "";
    this.invoiceDate = data.invoiceDate || "";
    this.quotationNumber = data.quotationNumber || "";
    this.purchaseOrderNumber = data.purchaseOrderNumber || "";
  }

  get hasQuotationNumber() {
    return true;
  }

  get hasInvoiceNumber() {
    return true;
  }

  get hasReceiptNumber() {
    return false;
  }

  get number(): string {
    return this.invoiceNumber;
  }

  set number(value: string) {
    this.invoiceNumber = value;
  }

  get documentType(): string {
    return "Invoice";
  }

  get date(): string {
    return this.invoiceDate;
  }

  set date(value: string) {
    this.invoiceDate = value;
  }

  toString() {
    return this.number;
  }
}
