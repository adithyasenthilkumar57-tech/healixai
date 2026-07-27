import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function calculateBMI(weight, height) {
  const heightInM = height / 100;
  const bmi = weight / (heightInM * heightInM);
  return bmi.toFixed(1);
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400" };
  if (bmi < 25) return { label: "Normal", color: "text-emerald-400" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-400" };
  return { label: "Obese", color: "text-red-400" };
}

export function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + "…" : str;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
