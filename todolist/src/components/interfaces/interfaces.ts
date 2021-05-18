// import TodoList from "@/src/store/modules/todoList"

export type ItemInterface = {
  name: string;
  category: string;
  done: Boolean;
}

export type ListInterface = {
  name: ItemInterface['category'];
  items: ItemInterface[];
  done: Boolean;
  id: string;
}

export type ListsStateInterface = {
  id: string,
  listItemsStates: ListInterface[],
  indexer: Number
}
