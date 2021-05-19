import { ListInterface, ListsStateInterface } from '@/src/components/interfaces/interfaces';
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

  @Mutation
  public setPrevIndexerOnSelectedList(listData: ListsStateInterface):void {
    const listIndex = this.listsHistoryStates.findIndex((e:ListsStateInterface) => e.id === listData.id)
    const indexer = +this.listsHistoryStates[listIndex].indexer - 1
    this.listsHistoryStates[listIndex].indexer = indexer
  }

  @Mutation
  public setNextIndexerOnSelectedList(listData: ListsStateInterface):void {
    const listIndex = this.listsHistoryStates.findIndex((e:ListsStateInterface) => e.id === listData.id)
    const indexer = +this.listsHistoryStates[listIndex].indexer + 1
    this.listsHistoryStates[listIndex].indexer = indexer
  }

  @Action
  public updateListsArray( newState: ListsStateInterface): void {
    this.context.commit('addListToHistory', newState);
  }

  @Action
  public updateList(newState: ListInterface):void {
    console.log('UpdateList param: ', newState)
    this.context.commit('addStateToListHistory', newState);
  }

  @Action
  public previousState( listItems: ListsStateInterface): void {
    this.context.commit('setPrevIndexerOnSelectedList', listItems);
  }

  @Action
  public nextState( listItems: ListsStateInterface): void {
    this.context.commit('setNextIndexerOnSelectedList', listItems);
  }
}
export default ListsAndItemsStates