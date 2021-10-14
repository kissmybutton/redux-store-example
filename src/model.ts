export interface Todo {
  label: string;
  complete: boolean;
}

export interface TodoState {
  loaded: boolean;
  loading: boolean;
  data: Todo[];
}
