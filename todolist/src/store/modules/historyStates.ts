import {
  ListInterface,
  ListsStateInterface,
} from "@/src/components/interfaces/interfaces";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

@Module({ namespaced: true, name: "listsAndItemsStates" })
class ListsAndItemsStates extends VuexModule {
  public currentIndex = 0;
  public listsHistoryStates: ListsStateInterface[] = [];

  @Mutation
  public addListToHistory(newState: ListsStateInterface): void {
    this.listsHistoryStates.push(newState);
  }

  @Mutation
  public removeStateFromHistory(list: ListsStateInterface): void {
    const history = this.listsHistoryStates.findIndex(
      (e: ListsStateInterface) => e.id === list.id
    );
    this.listsHistoryStates[history].listItemsStates.forEach((element) => {
      if (
        this.listsHistoryStates[history].listItemsStates.indexOf(element) >
        this.listsHistoryStates[history].indexer
      ) {
        this.listsHistoryStates[history].listItemsStates.pop();
      }
    });
  }

  @Mutation
  public addStateToListHistory(newState: ListInterface): void {
    const listIndex = this.listsHistoryStates.findIndex(
      (e: ListsStateInterface) => e.id === newState.id
    );
    this.listsHistoryStates[listIndex].listItemsStates.push(newState);
    this.listsHistoryStates[listIndex].indexer =
      this.listsHistoryStates[listIndex].listItemsStates.length - 1;
  }

  @Mutation
  public setPrevIndexerOnSelectedList(listData: ListsStateInterface): void {
    const listIndex = this.listsHistoryStates.findIndex(
      (e: ListsStateInterface) => e.id === listData.id
    );
    const indexer = +this.listsHistoryStates[listIndex].indexer - 1;
    this.listsHistoryStates[listIndex].indexer = indexer;
  }

  @Mutation
  public setNextIndexerOnSelectedList(listData: ListsStateInterface): void {
    const listIndex = this.listsHistoryStates.findIndex(
      (e: ListsStateInterface) => e.id === listData.id
    );
    const indexer = +this.listsHistoryStates[listIndex].indexer + 1;
    this.listsHistoryStates[listIndex].indexer = indexer;
  }

  @Action
  public updateListsArray(newState: ListsStateInterface): void {
    this.context.commit("addListToHistory", newState);
  }

  @Action
  public updateList(newState: ListInterface): void {
    this.context.commit("addStateToListHistory", newState);
  }

  @Action
  public previousState(listItems: ListsStateInterface): void {
    this.context.commit("setPrevIndexerOnSelectedList", listItems);
  }

  @Action
  public nextState(listItems: ListsStateInterface): void {
    this.context.commit("setNextIndexerOnSelectedList", listItems);
  }

  @Action
  public removeState(listItems: ListsStateInterface): void {
    this.context.commit("removeStateFromHistory", listItems);
  }
}
export default ListsAndItemsStates;
