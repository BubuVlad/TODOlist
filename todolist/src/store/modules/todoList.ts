import { ItemInterface } from '@/src/components/interfaces/interfaces';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'


@Module({ namespaced: true, name: 'todoList' })
class TodoList extends VuexModule {
  public todosList: ItemInterface[] = [];
  @Mutation
  public addTodoToList(newItem: ItemInterface): ItemInterface[] {
    this.todosList.push(newItem)
    return this.todosList
  }

  @Mutation
  public removeItemFromTodos(newItem: ItemInterface): void {
    const index: number = this.todosList.findIndex((e: ItemInterface) => e.nameOf === newItem.nameOf);
    this.todosList[index].done = true;
  }

  @Mutation
  public historySetter(newList:ItemInterface[]): void {
    this.todosList = newList;
  }

  @Action
  public setHistoryItemsValues( newList: ItemInterface[]):void {
    this.context.commit('historySetter', newList);
  }

  @Action
  public removeItemFromTodoList( newItem: ItemInterface): void {
      this.context.commit('removeItemFromTodos', newItem);
  }

  @Action
  public async updateTodoList( newItem: ItemInterface): Promise<void> {
    const index = this.todosList.findIndex((e: ItemInterface) => e.nameOf.toLowerCase() === newItem.nameOf.toLowerCase());
    if (this.todosList[index]) {
      return
    }
    await this.context.commit('addTodoToList', newItem);
  }

  @Action
  public async updateItems( newItems: ItemInterface[]): Promise<void> {
    await this.context.commit('historySetter', newItems)
  }
}
export default TodoList