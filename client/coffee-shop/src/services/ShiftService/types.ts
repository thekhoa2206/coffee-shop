

export type ShiftResponse = {
    id: number;
    name: string;
    createdOn: string;
    createdBy?: string;
    modifiedOn: string;
    modifiedBy?: string;
    status?: String;
    shiftTurnover?:number ;
    userStartId?: number ;
      userStart?: string;
      userEndId?: number;
      userEnd?: string;
      moneyOrder?: number;
      totalOrder?: number;
      totalExport?: number;
      importMoney?:number;
      importTotal?: number;
      money_cancel_order?:number;
      total_order_cancel?: number;
      money_export_cancel?: number;
      total_export_cancel?: number;
      money_import_cancel?: number;
      total_import_cancel?: number;
}


export type ShiftRequest = {
    id?: number;

}


