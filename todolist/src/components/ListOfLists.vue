<template>
  <div>
    <div v-for="(list, index) in revertList" :key="index">
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
import { ListInterface, ItemInterface, ListsStateInterface } from './interfaces/interfaces';

const lists = namespace('listOfLists');

@Component({
  components: {
    TodoList
  }
})
export default class ListOfLists extends Vue {
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
    const stateInStoreLength = this.$store.state.listsAndItemsStates.listsHistoryStates.length;
    const currentIndex = this.$store.state.listsAndItemsStates.currentIndex
    // const currentStoreStateHistoryIndex = this.$store.state.listsAndItemsStates.findIndex((e:ListsStateInterface) => e['itemList'] === this.todoListModule.todosList)

    // - trebuie current state la iteme si liste fac o filtrare pe state cu current items obj
    // - trebuie sa fac 
// console.log('Wrapper')
// console.log(this.$store.state.listsAndItemsStates.listsHistoryStates.length)
// console.log(stateInStoreLength)
// console.log(currentIndex)
// console.log(action)
// console.log('End of wrapper')
    if (action === 'prev' && stateInStoreLength > 1 && currentIndex > 1) {
      // console.log(this.$store.state.listsAndItemsStates.currentIndex)
      // console.log('Length for prev: ', this.$store.state.todoList)
      console.log('Todo List items: ', this.$store.state.todoList.todosList)
      console.log('Lists List: ', this.$store.state.listOfLists.listOfLists)
      console.log(this.$store.state.listsAndItemsStates.listsHistoryStates[currentIndex-2].itemList)
      console.log('Before reasign: ', this.listOfLists)
      this.$store.state.todoList.todosList = this.$store.state.listsAndItemsStates.listsHistoryStates[currentIndex-2].itemList
      // this.listOfLists = this.$store.state.listsAndItemsStates.listsHistoryStates[currentIndex-2].itemList
      this.$store.state.listsAndItemsStates.currentIndex -= 2
      console.log('After: ', this.$store.state.todoList.todosList)
      console.log('After reasign: ', this.listOfLists)
    } else if ( action === 'next' && currentIndex < stateInStoreLength) {
      console.log(this.$store.state.listsAndItemsStates.currentIndex)
      console.log('Length for next: ', this.$store.state.listsAndItemsStates)
    }
    // console.log(this.$store.state.listsAndItemsStates.length > 1)
    // if () {

    // }
  }

  mounted() {
    console.log('lala', this.listOfLists)
    console.log('Store: ', this.$store.state.todoList.todosList)
  }
}

</script>

<style>

</style>