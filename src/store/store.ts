export class Store {
  private subscribers: Function[];
  private reducers: { [key: string]: Function };
  private state: { [key: string]: any };

  constructor(reducers = {}, initialState = {}) {
    this.subscribers = [];
    this.reducers = reducers;
    this.state = this.reduce(initialState, {});
  }

  get value() {
    return this.state;
  }

  // Create a new subscription add it to the subscribers list and return unsubscribe function.
  subscribe(fn) {
    this.subscribers = [...this.subscribers, fn];
    this.notify();
    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers.filter((sub) => {
          return sub !== fn;
        });
      },
    };
  }

  // Trigger reduce to create the new state
  dispatch(action) {
    this.state = this.reduce(this.state, action);
    this.notify();
  }

  // Run every subscriber's function
  private notify() {
    this.subscribers.forEach((fn) => fn(this.value));
  }

  // Returns new state by running each reducer's function
  private reduce(state, action) {
    const newState = {};
    for (const prop in this.reducers) {
      // Take each slice of the store and run the appropriate reducer and return latest state.
      newState[prop] = this.reducers[prop](state[prop], action);
    }
    return newState;
  }
}
