import type { DialogueChoice } from "./DialogueChoice.model"
import type { TextModifier } from "./TextModifiers.model"

//#region define Node Info
export interface NodePosition{
    x: number,
    y: number
}

export interface NodeInfo{
    position: NodePosition,
    title: string,
    shape: string,
    color: string
}
//#endregion

export interface BaseNode{
    id: string,
    node_info: NodeInfo,
    next_node: string
}

export interface DialogueNode extends BaseNode{
    type: "dialogue",
    speaker: string,
    mood: string,
    text: string,
    choices: DialogueChoice[],
    text_modifiers: TextModifier[]
}

export interface ConditionalNode extends BaseNode{
    type: "condition"
    var_to_check: string,
    true_node: string,
    false_node: string
}

export interface EventNode extends BaseNode{
    type: "event",
    event_name: string,
    parameters: Record<string, any>;
}