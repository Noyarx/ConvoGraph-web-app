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

export const initialSpeakers: SelectItem[] = [
  {
    label: "Matthew",
    value: "Matthew",
  },
  {
    label: "Mae",
    value: "Mae",
  },
  {
    label: "Gregson",
    value: "Gregson",
  },
];

export const initialMoods: SelectItem[] = [
  {
    label: "Neutral",
    value: "neutral",
  },
  {
    label: "Happy",
    value: "happy",
  },
  {
    label: "Sad",
    value: "sad",
  },
  {
    label: "Angry",
    value: "angry",
  },
  {
    label: "Annoyed",
    value: "annoyed",
  },
  {
    label: "Laughing",
    value: "laughing",
  },
];
