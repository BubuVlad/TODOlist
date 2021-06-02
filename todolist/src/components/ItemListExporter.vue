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
// import FileList from '../store/modules/filesList';
import DropdownListOfItems from './DropDownListOfDownloadableItems.vue'
import ListOfLists from '../store/modules/listsOfTodos';
import {cloneDeep} from 'lodash';
import { ListInterface } from './interfaces/interfaces';

@Component({
  components: {
    DropdownListOfItems
  }
})
export default class ItemExporterForFileList extends Vue {

  listOfLists: ListOfLists = getModule(ListOfLists, this.$store);
  // filesList: FileList = getModule(FileList, this.$store);
  
  data(): Record<string, unknown> {
    return {
      loadingItems: false,
      dialogBox: false,
      disabled: false,
      listsData: [],
      listExported: ''
    }
  }

  dowloadItem() {
    console.log('Download')
  }
  created() {
    this.$data.listExported = JSON.stringify(this.listOfLists.listOfLists)
  }

  async convertListFormatPreExport(format:string):Promise<void> {
    if (format === 'JSON') {
      this.$data.listExported = JSON.stringify(this.listOfLists.listOfLists, null, 2)
    } else if (format === 'XML') {
      // this.$data.listExported = builderXML(this.listOfLists.listOfLists)
      console.log("this.listOfLists.listOfLists: ", this.listOfLists.listOfLists)
      const validateD = await jsontoxmlBuilder(this.listOfLists.listOfLists)
      console.log('validadeXMLTags: ', validateD)
      this.$data.listExported = jsontoxmlBuilder(this.listOfLists.listOfLists)
    }
  }

  checkDataForFututreImport() {
    console.log('LIST OF LISTs: ', this.listOfLists.listOfLists)
    // console.log('File-Lists: ', this.filesList.listsOfFiles)
    // const jsonType = this.filesList.listsOfFiles.findIndex((e:string) => e.)
    // if ( this.filesList.listsOfFiles[0].filesList[0].fileTypeOfItem === 'JSON') {
    //   console.log('Reach first layer data imported FILELIST JSON Lists array: ', this.filesList.listsOfFiles[0].filesList[0].textValueOfItem)
    //   const importedDataClone:ListInterface = cloneDeep(this.filesList.listsOfFiles[0].filesList[0].textValueOfItem)
    //   console.log('ImportedDataClonned: ', importedDataClone)
    //   // for( const element in importedDataClone ) {
    //   //   console.log("ELEMENT: ", element)
    //   // }
    //   // for (const [key, value]:[string, {}] of Object.entries(importedDataClone)) {
    //   //   console.log(key)
    //   //   console.log('VAlue: ', value)
    //   //   const listChecker = this.listOfLists.listOfLists.findIndex(el => el.name === value.name)
    //   // }
    //   // importedDataClone.forEach((element:any) => {
    //   //   const listChecker = this.listOfLists.listOfLists.findIndex(el => el.name === element.name)
    //   //   console.log('List checker index: ', listChecker)
    //   // });
    // } else if (this.filesList.listsOfFiles[0].filesList[0].fileTypeOfItem === 'XML') {
    //   console.log('La check e XML')
    // }
  }
}

</script>

<style>

</style>