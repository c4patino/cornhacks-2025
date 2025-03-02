import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffle<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  let currentIndex = shuffledArray.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    const temp = shuffledArray[currentIndex];
    shuffledArray[currentIndex] = shuffledArray[randomIndex]!;
    shuffledArray[randomIndex] = temp!;
  }

  return shuffledArray;
}
