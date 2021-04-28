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
    >
      <v-icon dark>
        mdi-pencil
      </v-icon>
    </v-btn>
    <v-btn
        class="ma-5"
        color="error"
        plain
      >
        Delete
      </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TodoItem extends Vue {
 @Prop({type: String, default: 'Random Name'}) readonly name!: string
 @Prop({type: String, default: 'Random Category'}) readonly category!: string
}
</script>

<style>

</style>