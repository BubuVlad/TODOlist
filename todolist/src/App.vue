<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    </v-app-bar>
    <v-main class="mt-5">
      <v-row>
        <v-col cols="12">
          <v-layout>
            <v-flex>
              <item-importer-for-file-list />
            </v-flex>
          </v-layout>
           <v-layout class="mt-4">
            <v-flex>
              <item-exporter-for-file-list />
            </v-flex>
          </v-layout>
        </v-col>
      </v-row>
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
      <!-- <template v-for=""></template> -->
      <list-of-lists />
      <!-- <todo-list /> -->
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import TodoInput from './components/TodoInput.vue';
import ListOfLists from './components/ListOfLists.vue';
import ItemImporterForFileList from './components/ItemImporter.vue';
import ItemExporterForFileList from './components/ItemListExporter.vue';

export default Vue.extend({
  name: 'App',
  components: {
    TodoInput,
    ListOfLists,
    ItemImporterForFileList,
    ItemExporterForFileList
  },
  data() {
    return {
      formVisible: false,
      showModalImporter: false
    }
  }
});
</script>
