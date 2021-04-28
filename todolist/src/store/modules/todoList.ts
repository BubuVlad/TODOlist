import ItemInterface from '@/src/components/interfaces/interfaces';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
@Module({ namespaced: true, name: 'todoList' })
class TodoList extends VuexModule {
  public todosList: ItemInterface[] = [
    {
      name: 'lolo',
      category: 'laylay',
      done: false
    },
    {
      name: 'lulu',
      category: 'lili',
      done: false
    }
  ];

  @Mutation
  public addTodoToList(newItem: ItemInterface): void {
    this.todosList.push(newItem)
  }
  public removeItemFromTodos(newItem: ItemInterface):void {
    const index: number = this.todosList.findIndex((e:ItemInterface) => e.name === newItem.name);
    this.todosList[index].done = true;
    // this.todosList.splice(index, index >= 0 ? 1 : 0);
  }
  @Action
  public updateTodoList(newItem: ItemInterface, action:string): void {
    if (action === 'remove') {
      this.context.commit('removeItemFromTodos', newItem);
    } else if (action === 'add') {
      this.context.commit('addTodoToList', newItem);
    }
    // this.context.commit((action == 'remove'?'removeItemFromTodos':'addTodoToList'), newItem)
  }
}
export default TodoList