<template>
  <div class="mx-3 my-5">
    <h2>Todo List</h2>
    <ul>
      <li v-for="(item, index) in todosList" :key="index">
        <todo-item v-bind:name="item.name" v-bind:category="item.category"/>
      </li>
    </ul>
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

  mounted() {
    console.log('lala', this.todosList)
  }
}

</script>

<style>

</style>