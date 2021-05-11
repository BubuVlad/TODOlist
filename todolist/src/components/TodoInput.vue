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
              @click="updateList"
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
import ItemInterface from './interfaces/interfaces'
import TodoListModule from '../store/modules/todoList';
// import { Action } from 'vuex';

// let todoListModule: TodoListModule;

@Component
export default class TodoInput extends Vue {

  todoListModule: TodoListModule = getModule(TodoListModule, this.$store);

  data(): ItemInterface {
    return {
      name : '',
      category : '',
      done: false
    }
  }

  // form = <HTMLFormElement>document.getElementById('item-form');

  updateList(): void {
    this.todoListModule.updateTodoList(this.$data as ItemInterface);
    // let form: HTMLFormElement = document.getElementById('item-form');
    // form.reset();
    // console.log('updateList');
    // console.log(this.$data)
    console.log(this)
  }

  // resetAll() {
  //   this.$data.name = '';
  //   this.$data.category = '';
  // }
}
</script>

<style>

</style>