import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function formatNumber(num: number, precision = 2) {
    return num.toLocaleString('pt-BR', {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
    });
}
