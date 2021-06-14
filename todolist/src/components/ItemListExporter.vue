<template>
  <v-dialog max-width='800px' v-model="dialogBox">
    <template v-slot:activator="{ on }">
      <v-btn
        class="mx-2 success"
        v-on="on"
        :disabled="disabled"
      >
        Export Lists
      </v-btn>
      </template>
      <template v-slot>
      <v-card>
        <v-card-title>
          <h2>Add a new file</h2>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                >
                 <v-textarea
                    label="Add text"
                    outlined
                    shaped
                    v-model='listExported'
                  ></v-textarea>
                </v-col>
                 <!--  HTML LISTS  --->
                <!-- <template v-for="(list, index) in listsData"> -->
                  <!-- <v-combobox
                    :key="index"
                    v-model="select"
                    :items="items"
                    label="Combobox"
                    multiple
                    outlined
                    dense
                  ></v-combobox> -->
                  <!-- <dropdown-list-of-items -->
                  <!-- <dropdown-list-of-items :key="index" :items='list.filesList' :listNme='list.nameOfList' /> -->
                <!-- </template> -->
                <v-col
                  cols="12"
                >
                  <v-btn
                    depressed
                    class="mr-5"
                    small
                    @click='checkDataForFututreImport'
                  >Cancel</v-btn>
                  <v-btn
                    depressed
                    color="primary"
                    class="success mr-5"
                    small
                    :loading="loadingItems"
                    @click='convertListFormatPreExport("JSON")'
                  >Convert JSON</v-btn>
                   <v-btn
                    depressed
                    color="primary"
                    class="success mr-5"
                    small
                    :loading="loadingItems"
                    @click='convertListFormatPreExport("XML")'
                  >Convert XML</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { builderXML, jsontoxmlBuilder, validadeXMLTags } from '../plugins/xmlObjBuilder'
import DropdownListOfItems from './DropDownListOfDownloadableItems.vue'
import ListOfLists from '../store/modules/listsOfTodos';

@Component({
  components: {
    DropdownListOfItems
  }
})
export default class ItemExporterForFileList extends Vue {

  listOfLists: ListOfLists = getModule(ListOfLists, this.$store);
  
  data(): Record<string, unknown> {
    return {
      loadingItems: false,
      dialogBox: false,
      disabled: false,
      listsData: [],
      listExported: ''
    }
  }

  created() {
    this.$data.listExported = JSON.stringify(this.listOfLists.listOfLists)
  }

  async convertListFormatPreExport(format:string):Promise<void> {
    if (format === 'JSON') {
      this.$data.listExported = JSON.stringify(this.listOfLists.listOfLists, null, 2)
    } else if (format === 'XML') {
      // const validateD = await jsontoxmlBuilder(this.listOfLists.listOfLists)
      // console.log('validadeXMLTags: ', validateD)
      this.$data.listExported = jsontoxmlBuilder(this.listOfLists.listOfLists)
    }
  }

  checkDataForFututreImport() {
    console.log('LIST OF LISTs: ', this.listOfLists.listOfLists)
  }
}

</script>

<style>

</style>