export interface SelectItem {
  label: string;
  value: string;
}

export const operators: SelectItem[] = [
  {
    label: "<",
    value: "<",
  },
  {
    label: "<=",
    value: "<=",
  },
  {
    label: ">",
    value: ">",
  },
  {
    label: ">=",
    value: ">=",
  },
  {
    label: "==",
    value: "==",
  },
  {
    label: "is",
    value: "is",
  },
];
