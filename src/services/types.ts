export interface SetFuncBody {
  key: string;
  value: any;
  ex: number;
}

export interface GetFuncBody {
  key: string;
}

export interface DelFuncBody {
  keys: Array<string>;
}

export interface IncrFuncBody {
  key: string;
}

export interface ZAddFuncBody {
  key: string;
  score: [number];
  member: [string];
}

export interface ZCardFuncBody {
  key: string;
}

export interface ZRankFuncBody {
  key: string;
  member: string;
}

export interface ZRangeFuncBody {
  key: string;
  start: number;
  stop: number;
}

export type OrderedArrayType = [number, string][];