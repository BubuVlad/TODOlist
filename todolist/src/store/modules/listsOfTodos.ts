import { ItemInterface, ListInterface } from '@/src/components/interfaces/interfaces';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

@Module({ namespaced: true, name: 'listOfLists' })
class ListOfLists extends VuexModule {

  public listOfLists: ListInterface[] = []

  @Mutation
  public addNewList(newItem: ListInterface): void {
    this.listOfLists.push(newItem)
  }

  @Mutation
  public addItemInExistingList(newItem: ItemInterface): void {
    const listIndex = this.listOfLists.findIndex((e: ListInterface) => e.name === newItem.category)
    this.listOfLists[listIndex].items.push(newItem)
  }

  @Mutation
  public removeList(newItem: ListInterface): void {
    const index: number = this.listOfLists.findIndex((e: ListInterface) => e.name === newItem.name);
    this.listOfLists[index].done = true;
  }

  @Mutation
  public historySetter(newList:ListInterface[]): void {
    this.listOfLists = newList;
  }

  @Action
  public setHistoryListValues( newList: ListInterface[]):void {
    this.context.commit('historySetter', newList);
  }

  @Action
  public removeListFromLists( newItem: ListInterface): void {
      this.context.commit('removeList', newItem);
  }

  @Action
  public updateListOfLists( newItem: ListInterface): void {
      this.context.commit('addNewList', newItem);
  }

  @Action
  public addItemInExistingListAction( newItem: ItemInterface): void {
    this.context.commit('addItemInExistingList', newItem)
  }
}

export default ListOfLists