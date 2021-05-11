<template>
  <div>
    <div class="mx-3 my-5" style="display: inline-block; vertical-align: top; width: 40%;">
      <h2>Todo List</h2>
      <ul>
        <template v-for="(item, index) in revertList">
        <li :key="index" v-if="item.done !== true">
          <todo-item v-bind:done="item.done" v-bind:name="item.name" v-bind:category="item.category"/>
        </li>
        </template>
      </ul>
    </div>
    <div class="mx-3 my-5" style="display: inline-block; vertical-align: top; width: 40%;">
      <h2>History List</h2>
      <ul>
        <template v-for="(item, index) in revertList">
          <li :key="index" v-if="item.done === true">
          <todo-item v-bind:done="item.done" v-bind:name="item.name" v-bind:category="item.category"/>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TodoItem from './TodoItem.vue';
import { namespace } from 'vuex-class'
import ItemInterface from './interfaces/interfaces';

const list = namespace('todoList');

@Component({
  components: {
    TodoItem
  }
})
export default class TodoList extends Vue {
  @list.State
  public todosList!:ItemInterface[]
  get revertList() {
    return this.todosList.reverse();
  }

  mounted() {
    console.log('lala', this.todosList)
  }

  // computed: {
  //   reverseList: function ():ItemInterface[] {
  //     return this.todosList.reverse();
  //       // this.todosList.reverse()
  //   }
  // }
}

</script>

<style>

</style>