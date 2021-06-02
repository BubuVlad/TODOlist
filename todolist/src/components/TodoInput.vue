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
              v-model="nameOf"
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
              @click="updateList().then((responseId) => updateState(responseId))"
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
import uuidv4 from '../plugins/utils'
import {cloneDeep} from 'lodash';

@Component
export default class TodoInput extends Vue {

  todoListModule: TodoListModule = getModule(TodoListModule, this.$store);
  listOfLists: ListOfLists = getModule(ListOfLists, this.$store);
  listsAndItemsStates: ListsAndItemsStates = getModule(ListsAndItemsStates, this.$store);

  data(): ItemInterface {
    return {
      nameOf : '',
      category : '',
      done: false
    }
  }

  async updateList(): Promise<string> {
    const listIndex = this.listOfLists.listOfLists.findIndex((e: ListInterface) => e.nameOf.toLowerCase() === this.$data.category.toLowerCase())
    const itemInList = this.todoListModule.todosList.findIndex((e: ItemInterface) => e.nameOf.toLowerCase() === this.$data.nameOf.toLowerCase())
    let action = '';
    //needs to be true
    const listChecker = this.listOfLists.listOfLists.findIndex((el:ListInterface) => el.nameOf === this.$data.category)
    if (listChecker >= 0) {
      const idOfList = this.listOfLists.listOfLists[listChecker].id
      const historyList = this.listsAndItemsStates.listsHistoryStates.findIndex((el: ListsStateInterface) => el.id === idOfList)
  
      //needs to be less then length
      const indexOfHistory = this.listsAndItemsStates.listsHistoryStates[historyList].indexer
      const lengthOfStatesOfListOnHistory = this.listsAndItemsStates.listsHistoryStates[historyList].listItemsStates.length
  
      if ( indexOfHistory < lengthOfStatesOfListOnHistory - 1) {
        await this.listsAndItemsStates.removeState(this.listsAndItemsStates.listsHistoryStates[historyList])
      }
    }

    if (!this.listOfLists.listOfLists[listIndex] && !this.todoListModule.todosList[itemInList]) {
      const createId = uuidv4();
      await this.todoListModule.updateTodoList({nameOf: this.$data.nameOf, category: this.$data.category, done: false} as ItemInterface);
      await this.listOfLists.updateListOfLists({
        nameOf: this.$data.category,
        done: false,
        id: createId,
        items: [{
          category: this.$data.category,
          nameOf: this.$data.nameOf,
          done: false
          }]});
      action = createId;
    } else if (!this.todoListModule.todosList[itemInList]) {
      await this.todoListModule.updateTodoList({nameOf: this.$data.nameOf, category: this.$data.category, done: false} as ItemInterface);
       await this.listOfLists.addItemInExistingListAction({
          category: this.$data.category,
          nameOf: this.$data.nameOf,
          done: false
          });
    }
    return action
  }

  async updateState(responseId:string):Promise<void> {
    if (responseId) {
      await this.listsAndItemsStates.updateListsArray({
        id: responseId,
        listItemsStates: [cloneDeep(this.listOfLists.listOfLists.find((e:ListInterface) => e.id === responseId))!],
        indexer: 0
        })
    } else {
      this.listsAndItemsStates.listsHistoryStates.forEach((e:ListsStateInterface): void => {
        const value = cloneDeep(this.listOfLists.listOfLists.find((i:ListInterface) => i.id === e.id)!);
        const thisListFromHistory = e.listItemsStates.findIndex((u:ListInterface) => JSON.stringify(u.items) === JSON.stringify(value.items))
        if(thisListFromHistory < 0) {
          this.listsAndItemsStates.updateList(value);
        }
      })
    }
  }
}
</script>

<style>

</style>