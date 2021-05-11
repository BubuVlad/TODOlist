<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    </v-app-bar>
    <v-main class="mt-5">
      <v-row class="mx-2 my-5">
        <v-btn
          class="mx-2"
          fab
          dark
          color="indigo"
          small
          v-on:click="formVisible = !formVisible"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
        <todo-input v-show="formVisible" />
      </v-row>
      <todo-list />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import TodoInput from './components/TodoInput.vue';
import TodoList from './components/TodoList.vue';

export default Vue.extend({
  name: 'App',
  components: {
    TodoInput,
    TodoList
  },
  data() {
    return {
      formVisible: false
    }
  }
});
</script>
