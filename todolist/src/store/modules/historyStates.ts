import { ItemInterface, ListInterface, ListsStateInterface } from '@/src/components/interfaces/interfaces';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'


@Module({ namespaced: true, name: 'listsAndItemsStates' })
class ListsAndItemsStates extends VuexModule {
  public currentIndex = 0;
  public listsHistoryStates: ListsStateInterface[] = [];

  @Mutation
  public addListToHistory(newState: ListsStateInterface): void {
    this.listsHistoryStates.push(newState)
  }

  @Mutation
  public addStateToListHistory(newState: ListInterface): void {
    const listIndex = this.listsHistoryStates.findIndex((e:ListsStateInterface) => e.id === newState.id)
    this.listsHistoryStates[listIndex].listItemsStates.push(newState)
    this.listsHistoryStates[listIndex].indexer = this.listsHistoryStates[listIndex].listItemsStates.length - 1
    console.log('Inside mutation: ', this.listsHistoryStates[listIndex])
  }

  // @Mutation
  // public addItemToCurrentState(newState: ListInterface):void {
  //   const listIndex = this.listsHistoryStates.findIndex((e:ListsStateInterface) => e.id === newState.id)
  //   this.listsHistoryStates[listIndex].listItemsStates[newState.indexer].push(newState.items)
  // }

  @Action
  public updateListsArray( newState: ListsStateInterface): void {
    this.context.commit('addListToHistory', newState);
  }

  @Action
  public updateList(newState: ListInterface):void {
    console.log('UpdateList param: ', newState)
    this.context.commit('addStateToListHistory', newState);
  }

  // @Action
  // public updateListsStatesItems( listItems: ListsStateInterface): void {
  //   this.context.commit('addStateToListHistory', listItems);
  // }
}
export default ListsAndItemsStates