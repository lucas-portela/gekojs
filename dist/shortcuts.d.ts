import { Flow } from "./flow";
import { Gene } from "./gene";
import { Kodo } from "./kodo";
import { FlowLogic, InputWiring, OutputWiring } from "./types";
import { Wire, WireMultiplexer, NamedWireMultiplexer, WireTransformer } from "./wire";
export declare const $kodo: <InputType, OutputType>(fn: (params: {
    input: InputWiring<InputType>;
    output: OutputWiring<OutputType>;
}) => Gene[]) => (input?: InputWiring<InputType>, output?: OutputWiring<OutputType>) => Kodo;
export declare const $gene: <InputType, OutputType>(lifeCycle: Partial<Pick<Gene<InputType, OutputType>, "onInit" | "onFreeze" | "onResume" | "onKill">>) => Gene<InputType, OutputType>;
export declare const $wire: <ValueType>(value?: ValueType) => Wire<ValueType>;
export declare const $plex: <ValueType>(wires: (Wire<ValueType> | ValueType)[]) => WireMultiplexer<ValueType>;
export declare const $named: <NamedTypes extends Record<string, any>>(wires: { [key in keyof NamedTypes]?: Wire<NamedTypes[key] | NamedTypes[key]>; }) => NamedWireMultiplexer<NamedTypes>;
export declare const $transform: <ValueType, TransformedType>(wire: Wire<ValueType>, transformer: (value: ValueType) => TransformedType) => WireTransformer<ValueType, TransformedType>;
export declare const $exp: <ValueType>(compute: () => ValueType) => Wire<ValueType>;
export declare const $flow: (...logic: FlowLogic | FlowLogic[]) => Flow;
