import { Kodo } from "./kodo";
import { WireListener } from "./types";
import { Wiring } from "./wire";
export declare class Gene<InputType = any, OutputType = any> extends Wiring<InputType, OutputType> {
    private _kodo;
    private _isFrozen;
    private _isReady;
    private _readyResolver;
    private _readyPromise;
    get kodo(): Kodo;
    get isActive(): boolean;
    get isFrozen(): boolean;
    get isReady(): boolean;
    watch<Key extends keyof InputType>(key: Key, listener: WireListener<InputType[Key]>): boolean;
    write<Key extends keyof OutputType>(key: Key, value: OutputType[Key]): Promise<void>;
    init(kodo: Kodo): void;
    freeze(): void;
    continue(): void;
    kill(): void;
    onInit(): void;
    onReady(): void;
    onFreeze(): void;
    onResume(): void;
    onKill(): void;
}
