<template>
  <div>
    <h3>Item</h3>
    <h4>nume: {{ name }}</h4>
    <h5>Category: {{ category }}</h5>
    <v-btn
      class="mx-2"
      fab
      dark
      x-small
      color="cyan"
      @click="edit = !edit"
    >
      <v-icon dark>
        mdi-pencil
      </v-icon>
    </v-btn>
    <div v-if="edit">
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
                v-model="nameEdit"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                label="List group"
                solo
                v-model="categoryEdit"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
            >
              <v-btn
                @click="edit = !edit"
                depressed
                class="mr-5"
                small
              >Cancel</v-btn>
              <v-btn
                depressed
                color="primary"
                small
                @click="updateItem"
              >Update</v-btn>
            </v-col>
          </v-row>
        </v-container>
    </v-form>
    </div>
    <v-btn
      v-if="done === false"
        class="ma-5"
        color="error"
        plain
        @click="remove"
      >
        Archive
      </v-btn>
      <v-btn
      v-else
        class="ma-5"
        color="error"
        plain
        @click="addItem"
      >
        Add Back
      </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { ItemInterface } from './interfaces/interfaces'
import TodoListModule from '../store/modules/todoList';

@Component
export default class TodoItem extends Vue {
 @Prop({type: String, default: 'Random Name'}) readonly name!: string
 @Prop({type: String, default: 'Random Category'}) readonly category!: string
 @Prop({type: Boolean, default: false}) readonly done!: boolean
 todoListModule: TodoListModule = getModule(TodoListModule, this.$store);

 data() {
   return {
     nameEdit: this.$props['name'],
     categoryEdit: this.$props['category'],
     doneEdit: this.$props['done']
   }
 }


private edit = false;

 remove():void {
     this.todoListModule.removeItemFromTodoList({
       name: this.$props['name'],
       category: this.$props['category'],
       done: this.$props['done']
     })
   }

 addItem():void {
  let index = this.todoListModule.todosList.findIndex((e: ItemInterface) => e.name === this.$props.name);
  this.todoListModule.todosList[index].done = false;
 }

 updateItem():void {
    let index = this.todoListModule.todosList.findIndex((e: ItemInterface) => e.name === this.$props.name);
    let item = this.todoListModule.todosList[index]
    item.name = this.$data.nameEdit;
    item.category = this.$data.categoryEdit;
    this.edit = !this.edit
 }
}
</script>

<style>

</style>