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
            <!-- <v-btn
              depressed
              color="primary"
              small
              @click="updateState().then((responseId) => updateList(responseId))"
            >Add item</v-btn> -->
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
      name : '',
      category : '',
      done: false
    }
  }

  // freshDataClonned: ListOfLists = {...this.listOfLists.listOfLists}

  async updateList(): Promise<string> {
    const listIndex = this.listOfLists.listOfLists.findIndex((e: ListInterface) => e.name.toLowerCase() === this.$data.category.toLowerCase())
    const itemInList = this.todoListModule.todosList.findIndex((e: ItemInterface) => e.name.toLowerCase() === this.$data.name.toLowerCase())

    let action = '';
    // console.log('Data: ', this.$data)
    if (!this.listOfLists.listOfLists[listIndex] && !this.todoListModule.todosList[itemInList]) {
      const createId = uuidv4();
      await this.todoListModule.updateTodoList({name: this.$data.name, category: this.$data.category, done: false} as ItemInterface);
      await this.listOfLists.updateListOfLists({
        name: this.$data.category,
        done: false,
        id: createId,
        items: [{
          category: this.$data.category,
          name: this.$data.name,
          done: false
          }]});
      action = createId;
    } else if (!this.todoListModule.todosList[itemInList]) {
      await this.todoListModule.updateTodoList({name: this.$data.name, category: this.$data.category, done: false} as ItemInterface);
       await this.listOfLists.addItemInExistingListAction({
          category: this.$data.category,
          name: this.$data.name,
          done: false
          });
      // action = true;
    }

    // console.log('List of lists 2: ', this.listOfLists.listOfLists)
    // console.log('Todo list Module 2: ', this.todoListModule.todosList)

    return action
  }

  async updateState(responseId:string):Promise<void> {
    // const clonedLists = {...this.listOfLists.listOfLists}
    // console.log('this.listOfLists.listOfLists): ', this.listOfLists.listOfLists)
    // console.log('this.listsAndItemsStates.listsHistoryStates :  ', this.listsAndItemsStates.listsHistoryStates)
    // console.log('Destructured: ', this.listsAndItemsStates.listsHistoryStates.find((e:ListsStateInterface) => e.id === responseId))
    
    // const listInHistoriesList:ListInterface[] = this.listsAndItemsStates.listsHistoryStates.find((e:ListsStateInterface) => e.id === responseId)

    if (responseId) {
      await this.listsAndItemsStates.updateListsArray({
        id: responseId,
        // listItemsStates: [...listInHistoriesList, this.listOfLists.listOfLists.find((e:ListInterface) => e.id === responseId)!],
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
      // await this.listsAndItemsStates.updateList({
      //   id: ,
      //   listItemsStates: [...listInHistoriesList, this.listOfLists.listOfLists.find((e:ListInterface) => e.id === responseId)!],
      //   indexer: 1
      //   })
    }
      console.log('History: ', this.listsAndItemsStates.listsHistoryStates)

      // return createId
  }
}
</script>

<style>

</style>