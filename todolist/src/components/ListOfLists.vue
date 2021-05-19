<template>
  <div>
    <div v-for="list in listOfLists" :key="list.id">
      <h2>{{ list.name }}</h2>
      <v-row>
         <v-col
            cols="12"
          >
            <v-btn
              depressed
              color="primary"
              small
              class="mr-5"
              @click="stateManagement('prev', list.id)"
            >Previous STATE</v-btn>
            <v-btn
              depressed
              color="primary"
              small
              @click="stateManagement('next', list.id)"
            >Next STATE</v-btn>
          </v-col>
      </v-row>
      <template v-if="items(list.name)">
          <todo-list v-bind:list="list.items"/>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TodoList from './TodoList.vue';
import { namespace } from 'vuex-class'
import { getModule } from 'vuex-module-decorators';
import TodoListModule from '../store/modules/todoList';
import ListOfListVuex from '../store/modules/listsOfTodos';
import ListOfListsForHistory from '../store/modules/listsOfTodos';
import { ListInterface, ItemInterface, ListsStateInterface } from './interfaces/interfaces';
import ListsAndItemsStates from '../store/modules/historyStates';
import {cloneDeep} from 'lodash';

const lists = namespace('listOfLists');

@Component({
  components: {
    TodoList
  }
})
export default class ListOfLists extends Vue {
  todoListModule: TodoListModule = getModule(TodoListModule, this.$store);
  listVuex: ListOfListVuex = getModule(ListOfListVuex, this.$store);
  listsAndItemsStates: ListsAndItemsStates = getModule(ListsAndItemsStates, this.$store);
  listOfListsForHistory: ListOfListsForHistory = getModule(ListOfListsForHistory, this.$store);

  @lists.State
  public listOfLists!:ListInterface[]
  get revertList() {
    return this.listOfLists.reverse();
  }

  items(listTitle:string) {
    let list:ItemInterface[] = this.$store.state.todoList.todosList.filter((e:ItemInterface) => e.category === listTitle)
    
    if (list[0] !== undefined) {
      return list
    }
  }

  async stateManagement(action:string, id: string): Promise<void> {
    
    const listInHistoryToGetValueFrom = this.listsAndItemsStates.listsHistoryStates.findIndex((el:ListsStateInterface) => el.id === id)
    // const currentIndexer = listInHistoryToGetValueFrom.indexer!
    let indexer = this.listsAndItemsStates.listsHistoryStates[listInHistoryToGetValueFrom].indexer;

    const list = this.listsAndItemsStates.listsHistoryStates[listInHistoryToGetValueFrom]

    if(action === 'prev' && indexer > 0) {
      await this.listsAndItemsStates.previousState(list)
      const getValueFromhistory = list.listItemsStates[+indexer-1];

      // console.log('GETVALUEItems', getValueFromhistory)
      //This List should replace the original list
      console.log('Value value', list.listItemsStates[+indexer-1].items)
      // await this.listOfLists
      const listToChange = this.listOfLists.find((list:ListInterface) => list.id === id)
      console.log('List of lists in prev: ', this.listOfLists)

      await this.listOfListsForHistory.setterCurrentListFromHistory(list.listItemsStates[+indexer-1])




      console.log('PREV todoListModule: ', this.todoListModule)
      console.log('List of lists in prev listToChange: ', listToChange)
      // this..setterCurrentListFromHistory()
      // await this.todoListModule.updateItems(getValueFromhistory.items)
    } else if (action === 'next' && indexer < this.listsAndItemsStates.listsHistoryStates[listInHistoryToGetValueFrom].listItemsStates.length) {
      console.log('NEXT')
      await this.listsAndItemsStates.nextState(list)
      // const getValueFromhistory = list.listItemsStates[+indexer+1];

      await this.listOfListsForHistory.setterCurrentListFromHistory(list.listItemsStates[+indexer+1])

    }
    // console.log('listInHistoryToGetValueFromlistInHistoryToGetValueFrom: ', listInHistoryToGetValueFrom)
  }

  mounted() {
    // console.log('This ListofLists: ', this.listOfLists)
  }

  updated() {
    console.log('Update lists of list: ', this.listOfLists)
  }
}

</script>

<style>

</style>