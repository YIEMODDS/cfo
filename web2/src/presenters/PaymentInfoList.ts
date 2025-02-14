import BillingDocument, {
  BillingDocumentWithId,
} from "@/models/BillingDocument";
import { PaymentInfoService } from "@/services/types";
import { ref, Ref } from "vue";

interface Header {
  text: string;
  value: string;
  sortable?: boolean;
}

export interface View {
  goTo: (path: string | { name: string; params: any }) => void;
}

export interface Presenter {
  headers: Array<{ text: string; value: string }>;
  items: Ref<BillingDocumentWithId[]>;
  init(year: number): void;
  delete(item: BillingDocument): void;
}

export default abstract class PaymentInfoList implements Presenter {
  protected view: View;
  public items: Ref<BillingDocument[]>;
  public headers: Header[];
  protected API: PaymentInfoService;

  constructor(view: View, api: PaymentInfoService) {
    this.view = view;
    this.items = ref([]);
    this.headers = [
      { text: "Number", value: "number" },
      { text: "Company", value: "targetCompany.name" },
      { text: "Project", value: "projectName" },
      { text: "Date", value: "invoiceDate" },
      { text: "Actions", value: "action", sortable: false },
    ];
    this.API = api;
  }

  public init(year: number): void {
    this.API.getAll(year)
      .then((items) => this.setAll(items))
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }

  abstract setAll(items: BillingDocument[]): void;

  public delete = (item: BillingDocument): void => {
    this.API.delete(item).then(this.removeItemFromList);
    this.closeDeleteConfirmDialogOf(item);
  };

  removeItemFromList = (item: BillingDocument): void => {
    this.items.value = this.items.value.filter((i) => i.number !== item.number);
  };

  cancelDelete = (item: BillingDocument): void => {
    this.closeDeleteConfirmDialogOf(item);
  };

  closeDeleteConfirmDialogOf = (item: BillingDocument): void => {
    item.dialog = false;
  };
}
