// import TodoList from "@/src/store/modules/todoList"

export enum AcceptedDataTypes {
  "XML" = "XML",
  "JSON" = "JSON",
  "YML" = "YML",
}

export type ItemInterface = {
  nameOf: string;
  category: string;
  done: boolean;
};

export type ListInterface = {
  nameOf: ItemInterface["category"];
  items: ItemInterface[];
  done: boolean;
  id: string;
};

export type ListsStateInterface = {
  id: string;
  listItemsStates: ListInterface[];
  indexer: number;
};

export type ObjectData = {
  data: ListInterface[] | ItemInterface[];
  type: AcceptedDataTypes;
};

export type DetectType = AcceptedDataTypes | MyError;

export interface IsTypeProps {
  type: AcceptedDataTypes;
  data: string;
}

export interface BuilderTypeToObjectProps {
  data: string;
}

export class MyError {
  public message: string;
  constructor(message: string) {
    this.message = message;
  }
}

export interface AdapterType {
  builderTypeToObject: (
    props: BuilderTypeToObjectProps
  ) => Promise<ObjectData | MyError>;
  builderObjectToType: (props: ObjectData) => IsTypeProps;
  isType: (props: IsTypeProps) => Promise<boolean | MyError>;
}
