export type File = {
  absolute: string;
  direct: string;
};

export type Possbilities =
  | string
  | number
  | boolean
  | any[]
  | object
  | undefined;

export type Options = {
  sync?: boolean;
};
//   export type State = 'idle' | 'loading' | 'loaded';
