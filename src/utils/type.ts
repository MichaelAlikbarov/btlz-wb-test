export interface ITariff {
  id?: number;
  created_at?: string;
  geo_name: string;
  warehouse_name: string;
  box_delivery_base: string;
  box_delivery_coef_expr: string;
  box_delivery_liter: string;
  box_delivery_marketplace_base: string;
  box_delivery_marketplace_coef_expr: string;
  box_delivery_marketplace_liter: string;
  box_storage_base: string;
  box_storage_coef_expr: string;
  box_storage_liter: string;
}
