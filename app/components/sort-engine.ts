export type BattleResult =
  | 'left'
  | 'right'
  | 'unseen-left'
  | 'unseen-right'
  | 'unseen-both';

export type BattleChoice = {
  leftMovieId: string;
  rightMovieId: string;
  result: BattleResult;
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
  unseen: string[];
  result: string[] | null;
};

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
    unseen: [...(state.unseen ?? [])],
    result: state.result ? [...state.result] : null,
  };
}

export function prepareNextPair(input: SortState): SortState {
  const state = cloneState(input);

  while (!state.left && state.result === null) {
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
    unseen: [],
    result: null,
  });
}

export function applyChoice(input: SortState, choice: BattleResult): SortState {
  if (!input.left || !input.right || input.result !== null) return input;

  const state = cloneState(input);
  const leftRun = state.left;
  const rightRun = state.right;
  if (!leftRun || !rightRun) return input;

  const leftId = leftRun[state.leftIndex];
  const rightId = rightRun[state.rightIndex];
  if (!leftId || !rightId) return input;

  state.choices.push({
    leftMovieId: leftId,
    rightMovieId: rightId,
    result: choice,
  });

  if (choice === 'left') {
    state.merged.push(leftId);
    state.leftIndex += 1;
  } else if (choice === 'right') {
    state.merged.push(rightId);
    state.rightIndex += 1;
  } else {
    if (choice === 'unseen-left' || choice === 'unseen-both') {
      state.unseen.push(leftId);
      state.leftIndex += 1;
    }
    if (choice === 'unseen-right' || choice === 'unseen-both') {
      state.unseen.push(rightId);
      state.rightIndex += 1;
    }
  }

  state.decisions += 1;

  const leftDone = state.leftIndex >= leftRun.length;
  const rightDone = state.rightIndex >= rightRun.length;

  if (leftDone || rightDone) {
    const completedRun = [
      ...state.merged,
      ...leftRun.slice(state.leftIndex),
      ...rightRun.slice(state.rightIndex),
    ];
    if (completedRun.length) state.built.push(completedRun);
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
  if (state.result !== null) return 0;

  let comparisons = 0;
  const nextRound = state.built.map((run) => run.length);

  if (state.left && state.right) {
    const leftRemaining = state.left.length - state.leftIndex;
    const rightRemaining = state.right.length - state.rightIndex;
    if (leftRemaining > 0 && rightRemaining > 0) {
      comparisons += leftRemaining + rightRemaining - 1;
    }
    nextRound.push(state.merged.length + leftRemaining + rightRemaining);
  }

  for (let index = 0; index < state.pending.length; index += 2) {
    const leftLength = state.pending[index].length;
    const rightRun = state.pending[index + 1];
    if (!rightRun) {
      nextRound.push(leftLength);
    } else {
      comparisons += leftLength + rightRun.length - 1;
      nextRound.push(leftLength + rightRun.length);
    }
  }

  let round = nextRound.filter((length) => length > 0);
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
  return (state.result ?? []).map((id, index) => ({
    rank: index + 1,
    ids: [id],
  }));
}
