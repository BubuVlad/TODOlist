import { ListsStateInterface } from '@/src/components/interfaces/interfaces';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'


@Module({ namespaced: true, name: 'listsAndItemsStates' })
class ListsAndItemsStates extends VuexModule {
  public currentIndex = 0;
  public listsHistoryStates: ListsStateInterface[] = [];
  @Mutation
  public addStateToHistory(newState: ListsStateInterface): void {
    this.listsHistoryStates.push(newState)
    this.currentIndex++
  }

  @Action
  public updateListsState( newState: ListsStateInterface): void {
    this.context.commit('addStateToHistory', newState);
  }
}
export default ListsAndItemsStates