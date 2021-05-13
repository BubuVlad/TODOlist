import { ListInterface } from '@/src/components/interfaces/interfaces';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

@Module({ namespaced: true, name: 'listOfLists' })
class ListOfLists extends VuexModule {

  public listOfLists: ListInterface[] = [
    {
      name: 'Grocery',
      done: false,
    },
    {
      name: 'Detergents',
      done: false,
      // items: this.todoListModule.todosList[]
      // listOfProducts: this
    }
  ]

  @Mutation
  public addNewList(newItem: ListInterface): void {
    this.listOfLists.push(newItem)
  }

  @Mutation
  public removeList(newItem: ListInterface): void {
    const index: number = this.listOfLists.findIndex((e: ListInterface) => e.name === newItem.name);
    this.listOfLists[index].done = true;
  }

  @Action
  public removeListFromLists( newItem: ListInterface): void {
      this.context.commit('removeList', newItem);
  }

  @Action
  public updateListOfLists( newItem: ListInterface): void {
      this.context.commit('addNewList', newItem);
  }
}

export default ListOfLists