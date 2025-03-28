import Invoice from "@/models/Invoice";
import LineItem from "@/models/LineItem";
import PricedLineItem from "@/models/PricedLineItem";
import { vi } from "vitest";
import { Factory } from "../factory";

describe("Invoice", () => {
  let invoice: Invoice;

  beforeEach(() => {
    invoice = Factory.createInvoice();
  });

  describe("parsing json data", () => {
    it("should have id", () => {
      expect(invoice.id).toEqual("oRFlyXTZX9cV6hIS");
    });

    it("should have invoiceNumber", () => {
      expect(invoice.invoiceNumber).toEqual("I202001-001");
    });

    it("should have quotation number", () => {
      expect(invoice.quotationNumber).toEqual("201912-060");
    });

    it("should not have receipt number", () => {
      expect(invoice.hasReceiptNumber).toEqual(false);
    });

    it("should have purchase order number", () => {
      expect(invoice.purchaseOrderNumber).toEqual("PO 20034910343");
    });

    it("should have remark", () => {
      expect(invoice.remark).toEqual("Dec 2019");
    });

    it("should have from company name", () => {
      expect(invoice.getFromCompanyName()).toEqual("ODDS HQ");
    });

    it("should have from company address", () => {
      expect(invoice.getFromCompanyAddress()).toEqual("69 We are not hiring");
    });

    it("should have from company tax id", () => {
      expect(invoice.getFromCompanyTaxId()).toEqual("0100000000000");
    });

    it("should have from company telephone number", () => {
      expect(invoice.getFromCompanyTel()).toEqual("+66896669999");
    });

    it("should have target company name field for invoice list to use", () => {
      expect(invoice.targetCompany.name).toEqual("Facebook HQ");
    });

    it("should have target company name", () => {
      expect(invoice.getTargetCompanyName()).toEqual("Facebook HQ");
    });

    it("should have target company address", () => {
      expect(invoice.getTargetCompanyAddress()).toEqual(
        "1601 Willow Rd Menlo Park, California"
      );
    });

    it("should have target company tax id", () => {
      expect(invoice.getTargetCompanyTaxId()).toEqual("0100008000007");
    });

    it("should have target company telephone number", () => {
      expect(invoice.getTargetCompanyTel()).toEqual("+1 650-960-1300");
    });

    it("should have invoiceDate", () => {
      expect(invoice.invoiceDate).toEqual("2020-01-03");
    });

    it("should use saved currency so that item price and total is shown correctly", () => {
      const data = Factory.createInvoice();
      data.currency = "USD";
      const invoice = new Invoice(data);
      expect(invoice.currency).toEqual("USD");
    });

    it("should have project name field which used in invoice list page", () => {
      expect(invoice.projectName).toEqual("React");
    });

    it("should have items as Array", () => {
      expect(Array.isArray(invoice.getItems())).toEqual(true);
    });

    it("should have duplicattion url", () => {
      expect(invoice.duplicationUrl()).toEqual(
        "/invoice/I202001-001/duplicate"
      );
    });

    it("should have payment", () => {
      expect(invoice.payment).toEqual("bank transfer");
    });

    test("can choose invoice for receipt generation in e2e test", () => {
      expect(invoice.toString()).toEqual("I202001-001");
    });

    describe("for each item", () => {
      let item: LineItem;

      beforeEach(() => {
        invoice = Factory.createInvoice();
        item = invoice.getItems()[1];
      });

      it("should have a name", () => {
        expect(item.name).toEqual("Scrum master");
      });

      it("should have a price", () => {
        expect(item.getPrice()).toEqual("THB 80.00");
      });

      it("should have an amount", () => {
        expect(item.amount).toEqual("10");
      });

      it("should have a total", () => {
        expect(item.getTotal()).toEqual("THB 800.00");
      });
    });
    describe("total", () => {
      let total: LineItem;
      beforeEach(() => {
        total = invoice.getItems()[2];
      });

      it("should follow last item", () => {
        expect(total.name).toEqual("Total");
        expect(total.getTotal()).toEqual("THB 400,800.00");
      });
      it("should have getPrice or the invoice items would not show on the invoice page", () => {
        expect(total.getPrice()).toEqual("");
      });
      it("should reflect changes in item price", () => {
        const item = invoice.getItems()[0] as PricedLineItem;
        item.price = "800";
        item.amount = "20";
        expect(item.getTotal()).toEqual("THB 16,000.00");
        expect(invoice.getItems()[1].getTotal()).toEqual("THB 800.00");
        expect(invoice.getItems()[2].getTotal()).toEqual("THB 16,800.00");
        expect(total.getTotal()).toEqual("THB 16,800.00");
      });
    });
    describe("vat", () => {
      it("should follow total", () => {
        const vat = invoice.getItems()[3];
        expect(vat.name).toEqual("VAT 7%");
        expect(vat.getTotal()).toEqual("THB 28,056.00");
      });
      it("should reflect changes in item price", () => {
        const item = invoice.getItems()[0] as PricedLineItem;
        item.price = "800";
        item.amount = "20";
        const vat = invoice.getItems()[3] as LineItem;
        expect(item.getTotal()).toEqual("THB 16,000.00");
        expect(invoice.getItems()[1].getTotal()).toEqual("THB 800.00");
        expect(invoice.getItems()[2].getTotal()).toEqual("THB 16,800.00");
        expect(vat.getTotal()).toEqual("THB 1,176.00");
      });
    });
    describe("grand total", () => {
      it("should follow vat", () => {
        const grandTotal = invoice.getItems()[4] as LineItem;
        expect(grandTotal.name).toEqual("Grand Total");
        expect(grandTotal.getTotal()).toEqual("THB 428,856.00");
      });
      it("should reflect changes in item price", () => {
        const item = invoice.getItems()[0] as PricedLineItem;
        item.price = "800";
        item.amount = "20";
        const grandTotal = invoice.getItems()[4] as LineItem;
        expect(item.getTotal()).toEqual("THB 16,000.00");
        expect(invoice.getItems()[1].getTotal()).toEqual("THB 800.00");
        expect(invoice.getItems()[2].getTotal()).toEqual("THB 16,800.00");
        expect(grandTotal.getTotal()).toEqual("THB 17,976.00");
      });
    });
  });

  describe("Printing", () => {
    it("should print small items when there are more than 3 items so it fits in 1 page", () => {
      invoice.addItemBefore(invoice.items[0]);
      invoice.addItemBefore(invoice.items[0]);
      expect(invoice.items.length).toEqual(4);
      expect(invoice.itemClass()).toEqual("small");
    });
    it("should make company name small when the name is too long", () => {
      invoice.targetCompany.name = "ตลาดหลักทรัพย์แห่งประเทศไทย (สำนักงานใหญ่)";
      expect(invoice.targetCompanyNameClass()).toEqual("small");
    });
    it("should not make company name small when the name normal", () => {
      invoice.targetCompany.name = "*3*5*7*10*13*16*19*22*25*28";
      expect(invoice.targetCompanyNameClass()).toEqual("");
    });
    it("invoice should have original", () => {
      const titles = invoice.getTitles();
      expect(titles[0].title).toEqual("Invoice (original)");
    });
    it("original invoice displays on screen and paper", () => {
      const titles = invoice.getTitles();
      expect(titles[0].css).toEqual("");
    });
    it("invoice should have copy", () => {
      const titles = invoice.getTitles();
      expect(titles[1].title).toEqual("Invoice (copy)");
    });
    it("copy invoice displays paper only", () => {
      const titles = invoice.getTitles();
      expect(titles[1].css).toEqual("print-only");
    });
    it("should have filename to be save when export to PDF and store in storage", () => {
      expect(invoice.filename()).toEqual(
        "I202001-001_INVOICE_Facebook HQ_React"
      );
    });
    it("should have small signature class when it has payment info", () => {
      expect(invoice.tablePaddingClass()).toEqual("dense");
    });
    it("should have normal signature class when have empty payment info", () => {
      invoice.payment = "";
      expect(invoice.tablePaddingClass()).toEqual("");
    });
    it("should have normal signature class when no payment infos", () => {
      invoice.payment = "";
      expect(invoice.tablePaddingClass()).toEqual("");
    });
  });

  describe("switching currency", () => {
    let item: LineItem;

    beforeEach(() => {
      item = invoice.getItems()[1];
    });

    it("should support THB and USD", () => {
      expect(invoice.getCurrencies()).toContain("THB");
      expect(invoice.getCurrencies()).toContain("USD");
    });

    it("should have a price in USD", () => {
      invoice.currency = "USD";
      expect(item.getPrice()).toEqual("USD 80.00");
      expect(item.getTotal()).toEqual("USD 800.00");
    });
  });

  describe("list invoice", () => {
    it("should have number expeced by presenter", () => {
      expect(invoice.number).toEqual("I202001-001");
    });
    it("should have date expeced by presenter", () => {
      expect(invoice.date).toEqual("2020-01-03");
    });
  });

  describe("Update duplicated invoice", () => {
    it("should be able to change from company name", () => {
      invoice.fromCompany.name = "ODDSTria";
      expect(invoice.getFromCompanyName()).toEqual("ODDSTria");
    });
    it("should be able to change from company address", () => {
      invoice.fromCompany.address = "new address";
      expect(invoice.getFromCompanyAddress()).toEqual("new address");
    });
    it("should be able to change from company tax id", () => {
      invoice.fromCompany.taxId = "new taxId";
      expect(invoice.getFromCompanyTaxId()).toEqual("new taxId");
    });
    it("should be able to change from company tel", () => {
      invoice.fromCompany.tel = "new tel";
      expect(invoice.getFromCompanyTel()).toEqual("new tel");
    });
    it("should be able to change target company name", () => {
      invoice.targetCompany.name = "ODDSTria";
      expect(invoice.getTargetCompanyName()).toEqual("ODDSTria");
    });
    it("should be able to change target company address", () => {
      invoice.targetCompany.address = "new address";
      expect(invoice.getTargetCompanyAddress()).toEqual("new address");
    });
    it("should be able to change target company tax id", () => {
      invoice.targetCompany.taxId = "new taxId";
      expect(invoice.getTargetCompanyTaxId()).toEqual("new taxId");
    });
    it("should be able to change target company tel", () => {
      invoice.targetCompany.tel = "new tel";
      expect(invoice.getTargetCompanyTel()).toEqual("new tel");
    });
    it("should be able to change invoice number", () => {
      invoice.invoiceNumber = "new number";
      expect(invoice.invoiceNumber).toEqual("new number");
    });
    it("should be able to change invoice date", () => {
      invoice.invoiceDate = "new date";
      expect(invoice.invoiceDate).toEqual("new date");
    });
    it("should be able to set invoice date to today", () => {
      const today = new Date("January 13, 2021");
      invoice.invoiceDate = "2021-01-02";
      invoice.setDateToday(today);
      expect(invoice.invoiceDate).toEqual("2021-01-13");
    });
    it("should be able to change project", () => {
      invoice.projectName = "new project";
      expect(invoice.getProjectName()).toEqual("new project");
    });
    it("should show quotation number and quotation date field to edit", () => {
      expect(invoice.hasQuotationNumber).toEqual(true);
    });
    it("should show invoice number, invoice date and PO field to edit", () => {
      expect(invoice.hasInvoiceNumber).toEqual(true);
    });
    describe("add and remove item", () => {
      beforeEach(() => {
        invoice = Factory.createInvoice();
      });
      it("add should increase total length", () => {
        invoice.addItemBefore(invoice.items[0]);
        expect(invoice.items.length).toEqual(3);
      });
      it("new item is added before the given item", () => {
        invoice.addItemBefore(invoice.items[0]);
        expect(invoice.getItems()[0].name).toEqual("");
        expect(invoice.getItems()[0].price).toEqual("");
        expect(invoice.getItems()[0].amount).toEqual("");
      });
      it("new item can get price or adding would fail to render", () => {
        invoice.addItemBefore(invoice.items[0]);
        expect(invoice.getItems()[0].getPrice()).toEqual("");
      });
      it("add last item when click on add before total", () => {
        invoice.addItemBefore(invoice.items[2]);
        expect(invoice.getItems()[2].name).toEqual("");
        expect(invoice.getItems()[2].price).toEqual("");
        expect(invoice.getItems()[2].amount).toEqual("");
      });
      it("remove should decrease total length", () => {
        invoice.removeItem(invoice.items[0]);
        expect(invoice.items.length).toEqual(1);
      });
      it("remove then the next item is moved up", () => {
        invoice.removeItem(invoice.items[0]);
        expect(invoice.getItems()[0].name).toEqual("Scrum master");
      });
      it("remove unknown item does nothing", () => {
        invoice.removeItem(invoice.items[2]);
        expect(invoice.items.length).toEqual(2);
      });
    });
  });

  describe("delete invoice", () => {
    let invoice: Invoice;
    beforeEach(() => {
      invoice = Factory.createInvoice();
    });
    it("should mark as deleted", () => {
      invoice.markAsDeleted();
      expect(invoice.deleted).toEqual(true);
    });
    it("should update invoice number so the invoice number can be reused while unique", () => {
      const t = 1610194022999;
      mockCurrentTimestamp(invoice, t);
      invoice.invoiceNumber = "202001-008";

      invoice.markAsDeleted();

      expect(invoice.invoiceNumber).toEqual(`202001-008-cancelled-${t}`);
    });
  });
  describe("edit invoice", () => {
    it("contains currency", async () => {
      const invoice = Factory.createInvoice();
      const dto = invoice.createDTO();
      expect(dto.currency).toEqual(invoice.currency);
    });
    it("contains item price and amount", async () => {
      const invoice = Factory.createInvoice();
      const dto = invoice.createDTO();
      expect(dto.items?.[0] instanceof PricedLineItem).toBeFalsy();
      expect(dto.items?.[0].price).toEqual("20000");
      expect(dto.items?.[0].amount).toEqual("20");
    });
    it("contains id so it can be updated, not recreated", async () => {
      const dto = invoice.createDTO();
      expect(dto.id).toEqual(Factory.json._id);
    });
    it("remove circular dependencies to avoid save fail", async () => {
      const dto: any = invoice.createDTO();
      expect(dto.items?.[0].item).toEqual(undefined);
      expect(dto.items?.[0].invoice).toEqual(undefined);
    });
    it("remove unused fields to avoid error when print invoice", async () => {
      const dto: any = invoice.createDTO();
      expect(dto._currencies).toBeUndefined();
    });
  });
});
function mockCurrentTimestamp(invoice: Invoice, timestamp: number) {
  vi.spyOn(invoice, "currentTimestamp").mockReturnValue(timestamp);
}
