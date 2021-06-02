<template lang="html">
  <v-combobox
    :key="index"
    v-model="select"
    :items="items"
    label="Combobox"
    multiple
    outlined
    dense
  ></v-combobox>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// import { getModule } from 'vuex-module-decorators';
// import FileList from '../store/modules/filesList';

@Component
export default class DropdownListOfItems extends Vue {

  @Prop({type: String, default: 'Random Name'}) items!: []
  @Prop({type: String, default: 'Random Name'}) select!: string


  // filesList: FileList = getModule(FileList, this.$store);
  
  data(): Record<string, unknown> {
    return {
      select: this.$props['select'],
      items: [...this.$props['items']]
    }
  }

  async dowloadItem(): Promise<void> {
   
    //Logic
    console.log('Picked!')
  }
}

</script>

<style>

</style>