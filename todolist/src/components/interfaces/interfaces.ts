// import TodoList from "@/src/store/modules/todoList"

export type ItemInterface = {
  name: string;
  category: string;
  done: Boolean;
}

export type ListInterface = {
  name: ItemInterface['category'];
  done: Boolean;
  // listOfProducts: ItemInterface[]
}

export type ListsStateInterface = {
  itemList: ItemInterface[],
  listOfLists: ListInterface[],
  indexer: Number
}

// export default ItemInterface ListInterface
