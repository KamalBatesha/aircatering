import { onlineOrderToast } from "./onlineOrderToast";

export function ExportToExel(grid) {
  if (grid) {
    console.log(grid);
    grid.excelExport();
  } else {
    onlineOrderToast.error("No Data To Export");
  }
}
