import { FlowControl } from "../flow";
import { $wire } from "../shortcuts";
import { DeepFlowLogic, FlowLogic, FlowLogicItem } from "../types";
import { Wire } from "../wire";

export const $if = (
  condition: () => boolean,
  ...doElseBlocks: DeepFlowLogic<ReturnType<typeof $else>>
) => {
  let doBlock: FlowLogic = [];
  let elseBlock: FlowLogic = [];
  doElseBlocks.forEach((item) => {
    if ((item as ReturnType<typeof $else>).type == "$else")
      elseBlock.push(...(item as FlowLogic));
    else if (item instanceof Array) {
      doBlock.push(...(item as FlowLogic));
    } else doBlock.push(item);
  });
  const hasElse = elseBlock.length > 0;
  const doSize = 1 + doBlock.length;
  const elseSize = hasElse ? elseBlock.length + 1 : 0;
  const size = doSize + elseSize;
  return [
    new FlowControl(async (cursor) => {
      if (condition()) return cursor.address + 1;
      else if (hasElse) return cursor.address + doSize + 1;
      else return cursor.address + size;
    }, "$if:decide-path"),
    ...doBlock,
    ...(hasElse
      ? [
          new FlowControl(
            async (cursor) => cursor.address + elseSize,
            "$if:skip-else"
          ),
          ...elseBlock,
        ]
      : []),
  ];
};

export const $else = (...doBlock: DeepFlowLogic) => {
  const block = $flat(doBlock) as FlowLogic<{ type: "$else" }>;
  block.type = "$else";
  return block;
};

export const $switch = (
  defaultBlock: ReturnType<typeof $default>,
  ...cases: ReturnType<typeof $case>[]
) => {
  let block: FlowLogic = defaultBlock;
  for (let i = cases.length - 1; i >= 0; i--) {
    const [condition, doBlock] = cases[i];
    if (block.length > 0) block = $if(condition, doBlock, $else(...block));
    else block = $if(condition, doBlock);
  }
  return block;
};

export const $case = (
  condition: () => boolean,
  ...doBlock: FlowLogic
): [() => boolean, FlowLogic] => {
  return [condition, doBlock];
};

export const $default = (...doBlock: FlowLogic) => {
  const block = [...doBlock] as FlowLogic<{ type: "$default" }>;
  block.type = "$default";
  return block;
};

export const $while = (
  condition: () => boolean,
  ...doBlocks: DeepFlowLogic
) => {
  let doBlock = $flat<FlowLogicItem>(doBlocks);
  const size = 2 + doBlock.length;

  return [
    new FlowControl(async (cursor) => {
      if (condition()) return cursor.address + 1;
      else return cursor.address + size - 1;
    }, "$while:check-condition"),
    ...doBlock,
    new FlowControl(async (cursor) => {
      return cursor.address - (size - 1);
    }, "$while:loop"),
  ];
};

export const $repeat = (
  times: Wire<number>,
  logic: (i: Wire<number>) => FlowLogic | FlowLogic[]
) => {
  let i = $wire(0);
  const doBlock = $flat(logic(i));
  const size = 3 + doBlock.length;

  return [
    new FlowControl(async (cursor) => {
      i.value = 0;
      return cursor.address + 1;
    }, "$repeat:setup-iterator"),
    new FlowControl(async (cursor) => {
      if (i.value < times.value) return cursor.address + 1;
      else return cursor.address + size - 1;
    }, "$repeat:check-iterator"),
    ...doBlock,
    new FlowControl(async (cursor) => {
      i.value++;
      return cursor.address - (size - 2);
    }, "$repeat:loop"),
  ];
};

export const $split = (
  ...deepBlocks: FlowLogic<ReturnType<typeof $thread>>[]
) => {
  const blocks = deepBlocks.map((block) => $flat(block));
  const size = blocks.reduce((a, b) => a + b.length, 0) + blocks.length;
  const addresses: number[] = [1];
  let address = 1;
  for (let block of blocks.slice(0, -1)) {
    address += block.length + 1;
    addresses.push(address);
  }
  return [
    new FlowControl(async (cursor, spawn) => {
      for (let address of addresses) spawn(cursor.address + address);
      return cursor.address + size + 1;
    }, "$split:spawn-threads"),
    ...$flat(
      blocks.map((block, i) => {
        return [
          ...(i > 0
            ? [
                new FlowControl(async (cursor) => {
                  return cursor.address - addresses[i - 1] - 1 + size;
                }, "$split:goto-end"),
              ]
            : []),
          ...block,
        ];
      })
    ),
    new FlowControl(async (cursor) => {
      cursor.success();
      return cursor.address;
    }, "$split:close-threads"),
  ];
};

export const $branch = (deepBlock: FlowLogic<ReturnType<typeof $thread>>) => {
  const block = $flat(deepBlock);
  const size = 2 + block.length;
  return [
    new FlowControl(async (cursor, spawn) => {
      spawn(cursor.address + 1, false);
      return cursor.address + size;
    }, "$branch:spawn-thread"),
    ...block,
    new FlowControl(async (cursor) => {
      cursor.success();
      return cursor.address;
    }, "$branch:close-thread"),
  ];
};

export const $thread = (...doBlock: DeepFlowLogic) => {
  const block = $flat([...doBlock]) as FlowLogic<{ type: "$thread" }>;
  block.type = "$thread";
  return block;
};

export const $flat = <ListType>(list: (ListType | ListType[])[]): ListType[] =>
  list.flat<any[]>();
