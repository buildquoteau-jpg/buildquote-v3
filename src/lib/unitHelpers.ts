import type { PurchaseUnit } from "../types/lineItem";

export function formatUnit(unit: PurchaseUnit, quantity: number): string {
  if (unit === "each") return quantity === 1 ? "each" : "each";
  return unit;
}

export function formatPackSize(
  unit: PurchaseUnit,
  packSize?: string
): string {
  if (unit === "each" || !packSize) return "";
  return `(${packSize})`;
}
