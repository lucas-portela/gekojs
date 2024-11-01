import { FlowControl } from "./flow";
import { Kodo } from "./kodo";
import { Wire } from "./wire";

export type GeneClass<GeneType> = { new (...args: any): GeneType };

export type Criteria<GeneType> = Partial<GeneType>;

export type Supression<GeneType> = {
  gene: GeneClass<GeneType>;
  criteria?: Criteria<GeneType>;
};

export type InputWiring<InputType> = {
  [key in keyof InputType]?: Wire<InputType[key]>;
};

export type OutputWiring<OutputType> = {
  [key in keyof OutputType]?: Wire<OutputType[key]>[];
};

export type WireListener<ValueType> = ((value: ValueType) => void) & {
  priority?: number;
};

export type FlowLogicItem = Kodo | FlowControl;
export type FlowLogic<FlowLogicType = {}> = FlowLogicItem[] & FlowLogicType;
export type DeepFlowLogic<FlowLogicType = {}> = (
  | FlowLogicItem
  | FlowLogic
  | FlowLogic<FlowLogicType>
)[];
