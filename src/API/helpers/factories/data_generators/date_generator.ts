export function generateRandomStringDate(
  dueDate?: boolean,
  days?: number,
): string {
  const randomDate: string = dueDate
    ? new Date(
        new Date().setDate(new Date().getDate() + (days ?? 0)),
      ).toISOString()
    : '';

  return randomDate;
}
