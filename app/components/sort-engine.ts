export type BattleChoice = {
  leftMovieId: string;
  rightMovieId: string;
  result: 'left' | 'tie' | 'right';
};

export type SortState = {
  runId: string;
  pending: string[][];
  built: string[][];
  left: string[] | null;
  right: string[] | null;
  leftIndex: number;
  rightIndex: number;
  merged: string[];
  decisions: number;
  choices: BattleChoice[];
  ties: [string, string][];
  result: string[] | null;
};

type TieRootFinder = (id: string) => string;

function createTieRootFinder(ties: [string, string][]): TieRootFinder {
  const parent = new Map<string, string>();

  const find = (id: string): string => {
    const current = parent.get(id) ?? id;
    if (current === id) return id;
    const root = find(current);
    parent.set(id, root);
    return root;
  };

  for (const [leftId, rightId] of ties) {
    const leftRoot = find(leftId);
    const rightRoot = find(rightId);
    if (leftRoot !== rightRoot) parent.set(rightRoot, leftRoot);
  }

  return find;
}

function getTieBlock(
  run: string[],
  startIndex: number,
  findTieRoot: TieRootFinder,
) {
  const firstId = run[startIndex];
  if (!firstId) return [];

  const root = findTieRoot(firstId);
  let endIndex = startIndex + 1;
  while (endIndex < run.length && findTieRoot(run[endIndex]) === root) {
    endIndex += 1;
  }

  return run.slice(startIndex, endIndex);
}

function countTieBlocks(
  run: string[],
  findTieRoot: TieRootFinder,
  startIndex = 0,
) {
  let blocks = 0;
  let index = startIndex;

  while (index < run.length) {
    const block = getTieBlock(run, index, findTieRoot);
    if (!block.length) break;
    blocks += 1;
    index += block.length;
  }

  return blocks;
}

export function cloneState(state: SortState): SortState {
  return {
    ...state,
    runId: state.runId || crypto.randomUUID(),
    pending: state.pending.map((run) => [...run]),
    built: state.built.map((run) => [...run]),
    left: state.left ? [...state.left] : null,
    right: state.right ? [...state.right] : null,
    merged: [...state.merged],
    choices: (state.choices ?? []).map((choice) => ({ ...choice })),
    ties: (state.ties ?? []).map((pair) => [...pair] as [string, string]),
    result: state.result ? [...state.result] : null,
  };
}

export function prepareNextPair(input: SortState): SortState {
  const state = cloneState(input);

  while (!state.left && !state.result) {
    if (state.pending.length >= 2) {
      state.left = state.pending[0];
      state.right = state.pending[1];
      state.pending = state.pending.slice(2);
      state.leftIndex = 0;
      state.rightIndex = 0;
      state.merged = [];
      break;
    }

    if (state.pending.length === 1) {
      state.built.push(state.pending[0]);
      state.pending = [];
    }

    if (state.pending.length === 0) {
      if (state.built.length <= 1) {
        state.result = state.built[0] ?? [];
        break;
      }

      state.pending = state.built;
      state.built = [];
    }
  }

  return state;
}

export function createSortState(ids: string[]): SortState {
  const shuffled = [...ids];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return prepareNextPair({
    runId: crypto.randomUUID(),
    pending: shuffled.map((id) => [id]),
    built: [],
    left: null,
    right: null,
    leftIndex: 0,
    rightIndex: 0,
    merged: [],
    decisions: 0,
    choices: [],
    ties: [],
    result: null,
  });
}

export function applyChoice(
  input: SortState,
  choice: 'left' | 'tie' | 'right',
): SortState {
  if (!input.left || !input.right || input.result) return input;

  const state = cloneState(input);
  const leftRun = state.left;
  const rightRun = state.right;
  if (!leftRun || !rightRun) return input;

  const findTieRoot = createTieRootFinder(state.ties);
  const leftBlock = getTieBlock(leftRun, state.leftIndex, findTieRoot);
  const rightBlock = getTieBlock(rightRun, state.rightIndex, findTieRoot);
  const leftId = leftBlock[0];
  const rightId = rightBlock[0];

  state.choices.push({
    leftMovieId: leftId,
    rightMovieId: rightId,
    result: choice,
  });

  if (choice === 'left' || choice === 'tie') {
    state.merged.push(...leftBlock);
    state.leftIndex += leftBlock.length;
  }

  if (choice === 'right' || choice === 'tie') {
    state.merged.push(...rightBlock);
    state.rightIndex += rightBlock.length;
  }

  if (choice === 'tie') state.ties.push([leftId, rightId]);
  state.decisions += 1;

  const leftDone = state.leftIndex >= leftRun.length;
  const rightDone = state.rightIndex >= rightRun.length;

  if (leftDone || rightDone) {
    const completedRun = [
      ...state.merged,
      ...leftRun.slice(state.leftIndex),
      ...rightRun.slice(state.rightIndex),
    ];
    state.built.push(completedRun);
    state.left = null;
    state.right = null;
    state.leftIndex = 0;
    state.rightIndex = 0;
    state.merged = [];
    return prepareNextPair(state);
  }

  return state;
}

export function estimateRemainingComparisons(state: SortState) {
  if (state.result) return 0;

  const findTieRoot = createTieRootFinder(state.ties);
  let comparisons = 0;
  const nextRound = state.built.map((run) => countTieBlocks(run, findTieRoot));

  if (state.left && state.right) {
    const leftRemaining = countTieBlocks(
      state.left,
      findTieRoot,
      state.leftIndex,
    );
    const rightRemaining = countTieBlocks(
      state.right,
      findTieRoot,
      state.rightIndex,
    );
    if (leftRemaining > 0 && rightRemaining > 0) {
      comparisons += leftRemaining + rightRemaining - 1;
    }
    nextRound.push(
      countTieBlocks(state.merged, findTieRoot) +
        leftRemaining +
        rightRemaining,
    );
  }

  for (let index = 0; index < state.pending.length; index += 2) {
    const leftLength = countTieBlocks(state.pending[index], findTieRoot);
    const rightRun = state.pending[index + 1];
    if (!rightRun) {
      nextRound.push(leftLength);
    } else {
      const rightLength = countTieBlocks(rightRun, findTieRoot);
      comparisons += leftLength + rightLength - 1;
      nextRound.push(leftLength + rightLength);
    }
  }

  let round = nextRound;
  while (round.length > 1) {
    const followingRound: number[] = [];
    for (let index = 0; index < round.length; index += 2) {
      const leftLength = round[index];
      const rightLength = round[index + 1];
      if (rightLength === undefined) {
        followingRound.push(leftLength);
      } else {
        comparisons += leftLength + rightLength - 1;
        followingRound.push(leftLength + rightLength);
      }
    }
    round = followingRound;
  }

  return comparisons;
}

export function groupResultIds(state: SortState) {
  const findTieRoot = createTieRootFinder(state.ties);
  const groups: { rank: number; ids: string[] }[] = [];
  let previousRoot: string | null = null;
  let position = 1;

  for (const id of state.result ?? []) {
    const root = findTieRoot(id);
    const currentGroup = groups[groups.length - 1];
    if (currentGroup && root === previousRoot) {
      currentGroup.ids.push(id);
    } else {
      groups.push({ rank: position, ids: [id] });
    }
    previousRoot = root;
    position += 1;
  }

  return groups;
}
