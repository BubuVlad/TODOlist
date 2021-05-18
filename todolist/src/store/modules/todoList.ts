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
  public removeItemFromTodos(newItem: ItemInterface): ItemInterface[] {
    const index: number = this.todosList.findIndex((e: ItemInterface) => e.name === newItem.name);
    this.todosList[index].done = true;
    return this.todosList
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
    const index = this.todosList.findIndex((e: ItemInterface) => e.name.toLowerCase() === newItem.name.toLowerCase());
    if (this.todosList[index]) {
      return
    }
    await this.context.commit('addTodoToList', newItem);
  }
}
export default TodoList