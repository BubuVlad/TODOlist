<template>
  <div>
    <h2 class="ml-3">Todo Input</h2>
    <v-form id='item-form'>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              label="Item name"
              solo
              v-model="name"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              label="List group"
              solo
              v-model="category"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
          >
            <v-btn
              depressed
              class="mr-5"
              small
            >Cancel</v-btn>
            <v-btn
              depressed
              color="primary"
              small
              @click="updateList().then((response) => updateState(response))"
            >Add item</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { ItemInterface, ListInterface, ListsStateInterface } from './interfaces/interfaces'
import TodoListModule from '../store/modules/todoList';
import ListOfLists from '../store/modules/listsOfTodos';
import ListsAndItemsStates from '../store/modules/historyStates';

@Component
export default class TodoInput extends Vue {

  todoListModule: TodoListModule = getModule(TodoListModule, this.$store);
  listOfLists: ListOfLists = getModule(ListOfLists, this.$store);
  listsAndItemsStates: ListsAndItemsStates = getModule(ListsAndItemsStates, this.$store);

  data(): ItemInterface {
    return {
      name : '',
      category : '',
      done: false
    }
  }

  mounted(): void {
    // console.log('STORE : ', this.$store.state.historyList.listsHistoryStates)
    // const checkerOfItems = this.listsAndItemsStates.listsHistoryStates.findIndex((e:ListsStateInterface) => e['itemList'] === this.todoListModule.todosList)
    // const checkerOfList = this.listsAndItemsStates.listsHistoryStates.findIndex((e:ListsStateInterface) => e['listOfLists'] === this.listOfLists.listOfLists)
    // if (!checkerOfItems || !checkerOfList) {
      // this.historyList.updateListsState({itemList: this.todoListModule.todosList, listOfLists: this.listOfLists.listOfLists} as ListsStateInterface)

      this.listsAndItemsStates.updateListsState({itemList: this.todoListModule.todosList, listOfLists: this.listOfLists.listOfLists, indexer: 1} as ListsStateInterface)

    //   console.log('History: ',this.listsAndItemsStates)
    //   console.log('State din history: ', this.$store.state)
    //   // console.log('indexush: ', checkerOfItems)
    // }
  }

  async updateList(): Promise<boolean> {
    const listIndex = this.listOfLists.listOfLists.findIndex((e: ListInterface) => e.name.toLowerCase() === this.$data.category.toLowerCase())
    const itemInList = this.todoListModule.todosList.findIndex((e: ItemInterface) => e.name.toLowerCase() === this.$data.name.toLowerCase())
    let action = false;
    if (!this.listOfLists.listOfLists[listIndex] && !this.todoListModule.todosList[itemInList]) {
      this.listOfLists.updateListOfLists({name: this.$data.category, done: false} as ListInterface);
      action = true;
    }
    if (!this.todoListModule.todosList[itemInList]) {
      this.todoListModule.updateTodoList({name: this.$data.name, category: this.$data.category, done: false} as ItemInterface);
      action = true;
    }
    console.log(this)
    // if (action === true) {
      // this.listsAndItemsStates.updateListsState({itemList: this.todoListModule.todosList, listOfLists: this.listOfLists.listOfLists, indexer: ++this.listsAndItemsStates.listsHistoryStates.length} as ListsStateInterface)
    // }
    return action
  }

  updateState(response: boolean): void {
    if (response === true) {
      this.listsAndItemsStates.updateListsState({itemList: this.todoListModule.todosList, listOfLists: this.listOfLists.listOfLists, indexer: this.listsAndItemsStates.listsHistoryStates.length} as ListsStateInterface)
    }
  }

  // resetData(): void {
  //   this.$data.name = '';
  //   this.$data.category = '';
  // }
}
</script>

<style>

</style>