import { Todo, TodoState } from "./model";
import * as fromStore from "./store";

import { renderTodos } from "./utils";

const input = document.querySelector("input") as HTMLInputElement;
const addTodoButton = document.getElementById("add-todo") as HTMLButtonElement;
const destroy = document.querySelector(".unsubscribe") as HTMLButtonElement;
const reSubscribe = document.querySelector(".resubscribe") as HTMLButtonElement;
const todoList = document.querySelector(".todos") as HTMLLIElement;

// Map reducer's fn with state slice
const reducers = {
  todos: fromStore.reducer,
  // Here add multiple slices of application
};

// Create only one store from one or many reducers
const store = new fromStore.Store<TodoState>(reducers);

// Add new TODO to list
addTodoButton.addEventListener(
  "click",
  () => {
    if (!input.value.trim()) return;
    const todo = { label: input.value, complete: false };
    // Dispatch Action Add
    store.dispatch(new fromStore.AddTodo(todo));
    input.value = "";
  },
  false
);

// Remove TODO from list
todoList.addEventListener("click", function (event) {
  const target = event.target as HTMLButtonElement;
  if (target.nodeName.toLowerCase() === "button") {
    const todo = JSON.parse(target.getAttribute("data-todo") as string) as Todo;
    // Dispatch Action Remove
    store.dispatch(new fromStore.RemoveTodo(todo));
  }
});

let subscription = store.subscribe((state) => {
  renderTodos(state.todos.data);
});

// Destroy component subscription
destroy.addEventListener(
  "click",
  () => {
    subscription.unsubscribe();
  },
  false
);

// Resubscribe component subscription
reSubscribe.addEventListener(
  "click",
  () => {
    subscription = store.subscribe((state) => renderTodos(state.todos.data));
  },
  false
);

store.subscribe((state) => console.log("STATE:::", state));
