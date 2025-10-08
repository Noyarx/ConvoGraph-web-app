import type { DialogueChoice } from "./DialogueChoice.model"

export interface DialogueNode{
    node_info: {
        position: {
            x: number,
            y: number
        },
        color: string
    },
    id: string,
    title: string,
    speaker: string,
    mood: string,
    text: string,
    choices: DialogueChoice[],
}