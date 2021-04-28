<template>
  <div>
    <h2 class="ml-3">Todo Input</h2>
    <v-form>
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
              @click='updateTodoList({name, category, done}, "add")'
            >Add item</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class'
import ItemInterface from './interfaces/interfaces'
const toDoList = namespace('todoList')
@Component
export default class TodoInput extends Vue {
  data():ItemInterface {
    return {
      name : '',
      category : '',
      done: false
    }
  }
  @toDoList.Action
  public updateTodoList!: (newItem:ItemInterface, action:string) => void
}
</script>

<style>

</style>