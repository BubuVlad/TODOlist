import { ItemInterface } from '@/src/components/interfaces/interfaces';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'


@Module({ namespaced: true, name: 'todoList' })
class TodoList extends VuexModule {
  // private listName: string = 'Grocery';
  public todosList: ItemInterface[] = [
    {
      name: 'lolo',
      category: 'Grocery',
      done: false
    },
    {
      name: 'lulu',
      category: 'Detergents',
      done: false
    }
  ];
  @Mutation
  public addTodoToList(newItem: ItemInterface): ItemInterface[] {
    this.todosList.push(newItem)
    console.log('Added: ', this.todosList)
    return this.todosList
  }

  @Mutation
  public removeItemFromTodos(newItem: ItemInterface): ItemInterface[] {
    const index: number = this.todosList.findIndex((e: ItemInterface) => e.name === newItem.name);
    this.todosList[index].done = true;
    return this.todosList
  }

  @Action
  public removeItemFromTodoList( newItem: ItemInterface): void {
      this.context.commit('removeItemFromTodos', newItem);
  }

  @Action
  public updateTodoList( newItem: ItemInterface): void {
    const index = this.todosList.findIndex((e: ItemInterface) => e.name.toLowerCase() === newItem.name.toLowerCase());
    if (this.todosList[index]) {
      return
    }
    this.context.commit('addTodoToList', newItem);
  }
}
export default TodoList