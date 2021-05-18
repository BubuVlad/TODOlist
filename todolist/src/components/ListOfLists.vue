<template>
  <div>
    <div v-for="(list, index) in listOfLists" :key="index">
      <h2>{{ list.name }}</h2>
      <v-row>
         <v-col
            cols="12"
          >
            <v-btn
              depressed
              class="mr-5"
              small
            >Remove List</v-btn>
            <v-btn
              depressed
              color="primary"
              small
              class="mr-5"
              @click="stateManagement('prev')"
            >Previous STATE</v-btn>
            <v-btn
              depressed
              color="primary"
              small
              @click="stateManagement('next')"
            >Next STATE</v-btn>
          </v-col>
      </v-row>
      <template v-if="items(list.name)">
          <todo-list v-bind:list="items(list.name)"/>
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
import { ListInterface, ItemInterface, ListsStateInterface } from './interfaces/interfaces';
import ListsAndItemsStates from '../store/modules/historyStates';

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

  stateManagement(action:string): void {
    const stateInStoreLength = this.listsAndItemsStates.listsHistoryStates.length;
    const currentIndex = this.listsAndItemsStates.currentIndex

    // if (action === 'prev' && stateInStoreLength > 1 && currentIndex > 1) {
    //   // this.todoListModule.setHistoryItemsValues(this.listsAndItemsStates.listsHistoryStates[currentIndex-2].itemList)
    //   this.listVuex.setHistoryListValues(this.listsAndItemsStates.listsHistoryStates[currentIndex-2].listOfLists)
    //   this.$store.state.listsAndItemsStates.currentIndex -= 2
    // } else if ( action === 'next' && currentIndex < stateInStoreLength) {
    //   console.log('Length for next: ', this.$store.state.listsAndItemsStates)
    // }
  }
}

</script>

<style>

</style>