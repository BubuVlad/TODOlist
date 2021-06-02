import {
  ItemInterface,
  ListInterface,
} from "@/src/components/interfaces/interfaces";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

@Module({ namespaced: true, name: "listOfLists" })
class ListOfLists extends VuexModule {
  public listOfLists: ListInterface[] = [];

  @Mutation
  public addNewList(newItem: ListInterface): void {
    this.listOfLists.push(newItem);
  }

  @Mutation
  public addItemInExistingList(newItem: ItemInterface): void {
    const listIndex = this.listOfLists.findIndex(
      (e: ListInterface) => e.nameOf === newItem.category
    );
    this.listOfLists[listIndex].items.push(newItem);
  }

  @Mutation
  public removeList(newItem: ListInterface): void {
    const index: number = this.listOfLists.findIndex(
      (e: ListInterface) => e.nameOf === newItem.nameOf
    );
    this.listOfLists[index].done = true;
  }

  @Mutation
  public historySetter(newList: ListInterface): void {
    this.listOfLists = this.listOfLists.map((list) => {
      if (list.id === newList.id) {
        return newList;
      } else {
        return list;
      }
    });
  }

  @Action
  public setHistoryListValues(newList: ListInterface[]): void {
    this.context.commit("historySetter", newList);
  }

  @Action
  public removeListFromLists(newItem: ListInterface): void {
    this.context.commit("removeList", newItem);
  }

  @Action
  public updateListOfLists(newItem: ListInterface): void {
    this.context.commit("addNewList", newItem);
  }

  @Action
  public addItemInExistingListAction(newItem: ItemInterface): void {
    this.context.commit("addItemInExistingList", newItem);
  }

  @Action
  public async addItemWithCheckOfList(data: {
    index: number;
    item: ItemInterface;
    idForList: string;
  }): Promise<void> {
    if (data.index < 0) {
      await this.context.commit("addNewList", {
        nameOf: data.item.category,
        items: [],
        done: Boolean,
        id: data.idForList,
      });
      await this.context.commit(
        "addItemInExistingList",
        data.item as ItemInterface
      );
    } else {
      if (
        this.listOfLists[data.index].items.findIndex(
          (item: ItemInterface) => item.nameOf === data.item.nameOf
        ) < 0
      ) {
        this.context.commit(
          "addItemInExistingList",
          data.item as ItemInterface
        );
      }
    }
  }

  @Action
  public setterCurrentListFromHistory(newItem: ListInterface): void {
    this.context.commit("historySetter", newItem);
  }
}

export default ListOfLists;
