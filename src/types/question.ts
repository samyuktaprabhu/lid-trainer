export type QuestionId = number | string;

export interface Question {
  /** Kept identical to the legacy trainer so saved progress remains compatible. */
  n: QuestionId;
  /** Legacy topic identifier for general questions; state questions use "by". */
  t: string;
  q: string;
  o: [string, string, string, string];
  a: number;
  e: string;
  ea: string;
  im: string | null;
  oe: [string, string, string, string];
  v: [string, string][];
}

export type ImageAsset = string | string[];
export type ImageBank = Record<string, ImageAsset>;

export type BundeslandCode =
  | 'bw' | 'by' | 'be' | 'bb' | 'hb' | 'hh' | 'he' | 'mv'
  | 'ni' | 'nw' | 'rp' | 'sl' | 'sn' | 'st' | 'sh' | 'th';

export interface Bundesland {
  code: BundeslandCode;
  name: string;
  nameEn: string;
}
