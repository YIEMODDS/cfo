import { InvoiceArchivePresenter } from "@/presenters/InvoiceArchivePresenter";
import Invoice from "@/models/Invoice";
import { MockView } from "./BillingDocumentPresenter.spec";

describe("InvoiceArchivePresenter", () => {
  let p;
  describe("generate receipt from invoices", () => {
    beforeEach(() => {
      p = new InvoiceArchivePresenter(new MockView(), undefined);
    });
    it("should change button color after toggle generate receipt mode", () => {
      p.toggleGenerateReceipt();
      expect(p.buttonColor).toEqual("purple");
    });
    it("should have primary color by default", () => {
      expect(p.buttonColor).toEqual("primary");
    });
    it("should change button color back to primary after confirm generating a receipt", () => {
      p.toggleGenerateReceipt();
      p.toggleGenerateReceipt();
      expect(p.buttonColor).toEqual("primary");
    });
    it("should redirect to create receipt page after confirm generating a receipt", async () => {
      let selectedInvoices = [
        new Invoice({ invoiceNumber: "202101-001" }),
        new Invoice({ invoiceNumber: "202101-002" }),
      ];
      givenGenerateReceiptWith2Invoices(selectedInvoices);

      p.toggleGenerateReceipt();

      expectToRedirectToCreateReceiptPage(p.view, selectedInvoices);
    });
    function givenGenerateReceiptWith2Invoices(selectedInvoices) {
      p.toggleGenerateReceipt();
      p.selectedInvoices = selectedInvoices;
      vi.spyOn(p.view, "goTo");
    }
    function expectToRedirectToCreateReceiptPage(view, selectedInvoices) {
      expect(view.goTo).toHaveBeenCalledWith({
        path: "/receipt/create",
        query: expect.objectContaining({
          receipt:
            expect.stringContaining(selectedInvoices[0].invoiceNumber) &&
            expect.stringContaining(selectedInvoices[1].invoiceNumber),
        }),
      });
    }
  });
});
