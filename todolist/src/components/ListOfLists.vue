<template>
  <div>
    <div v-for="list in listOfLists" :key="list.id" :listId='list.id' ref='list'>
      <h2>{{ list.nameOf }}</h2>
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
            >Undo</v-btn>
            <v-btn
              depressed
              color="primary"
              small
              @click="stateManagement('next', list.id)"
              :disabled="isDisabled"
            >Redo</v-btn>
          </v-col>
      </v-row>
      <template v-if="items(list.nameOf)">
          <todo-list v-bind:list="list.items"/>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import TodoList from './TodoList.vue';
import { namespace } from 'vuex-class'
import { getModule } from 'vuex-module-decorators';
import TodoListModule from '../store/modules/todoList';
import ListOfListVuex from '../store/modules/listsOfTodos';
import ListOfListsForHistory from '../store/modules/listsOfTodos';
import { ListInterface, ItemInterface, ListsStateInterface } from './interfaces/interfaces';
import ListsAndItemsStates from '../store/modules/historyStates';

const lists = namespace('listOfLists');

@Component({
  components: {
    TodoList
  }
})
export default class ListOfLists extends Vue {
  @Prop({type: String}) listId!: string
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

  data(): Record<string, unknown> {
    return {
      disabled: true
    }
  }


  // computed: {
    get isDisabled():boolean {
      return this.$data.disabled ? true: false
    }
  // }

  async stateManagement(action:string, id: string): Promise<void> {
    
    const listInHistoryToGetValueFrom = this.listsAndItemsStates.listsHistoryStates.findIndex((el:ListsStateInterface) => el.id === id)
    // const currentIndexer = listInHistoryToGetValueFrom.indexer!
    let indexer = this.listsAndItemsStates.listsHistoryStates[listInHistoryToGetValueFrom].indexer;

    const list = this.listsAndItemsStates.listsHistoryStates[listInHistoryToGetValueFrom]

    if(action === 'prev' && indexer > 0) {
      await this.listsAndItemsStates.previousState(list)
      // await this.listOfLists
      const listToChange = this.listOfLists.find((list:ListInterface) => list.id === id)
      
      await this.listOfListsForHistory.setterCurrentListFromHistory(list.listItemsStates[+indexer-1])

    } else if (action === 'next' && indexer < this.listsAndItemsStates.listsHistoryStates[listInHistoryToGetValueFrom].listItemsStates.length - 1) {

      await this.listsAndItemsStates.nextState(list)

      await this.listOfListsForHistory.setterCurrentListFromHistory(list.listItemsStates[+indexer+1])

    }
  }

  mounted() {
    // console.log('This ListofLists: ', this.listOfLists)
  }

  updated() {
    // console.log('Update lists of list: ', this.listOfLists)
  }
}

</script>

<style>

</style>