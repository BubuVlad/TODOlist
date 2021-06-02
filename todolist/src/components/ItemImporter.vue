<template>
  <v-dialog max-width='800px' v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-btn
        class="mx-2 success"
        v-on="on"
      >
        Open Item Importer
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
                    v-model='importedItem_TextValue'
                  ></v-textarea>
                </v-col>
                  <!-- <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    label="File nameOf"
                    solo
                    v-model="importedItem_nameOf"
                  ></v-text-field>
                </v-col> -->
                <!-- <v-col
                  cols="12"
                  sm="6"
                > -->
                 <!-- <v-text-field
                    label="List nameOf"
                    solo
                    v-model="importedItem_ListnameOf"
                    :rules="inputRules[0](importedItem_ListnameOf)"
                  ></v-text-field> -->
                  <!-- <v-text-field
                    label="List nameOf"
                    solo
                    v-model="importedItem_ListnameOf"
                  ></v-text-field> -->
                <!-- </v-col> -->
                <v-col
                  cols="12"
                >
                  <v-btn
                    depressed
                    class="mr-5"
                    small
                    @click='dialog = false;'
                  >Cancel</v-btn>
                  <v-btn
                    depressed
                    color="primary"
                    class="success"
                    small
                    :loading="loadingData"
                    @click="checkImporterValue"
                  >Add to list</v-btn>
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
// import FileList from '../store/modules/filesList';
import {validadeXMLTags, jsontoxmlBuilder} from '../plugins/xmlObjBuilder'
import {cloneDeep, forEach} from 'lodash';
import jsonObjBuilder from '../plugins/jsonObjBuilder'
import ListOfLists from '../store/modules/listsOfTodos';
import { AcceptedDataTypes, ItemInterface, ListInterface } from './interfaces/interfaces';
import uuidv4 from '../plugins/utils';
import TodoListModule from '../store/modules/todoList';
import DataAdapter from '../plugins/DataAdapter'

@Component
export default class ItemImporterForFileList extends Vue {

  // filesList: FileList = getModule(FileList, this.$store);
  listOfLists: ListOfLists = getModule(ListOfLists, this.$store)
  todoItems: TodoListModule = getModule(TodoListModule, this.$store);
  
  data(): Record<string, unknown> {
    return {
      // importedItem_nameOf: '',
      importedItem_TextValue: '',
      // importedItem_ListnameOf: '',
      loadingData: false,
      dialog: false,
      fileType: String
    }
  }

  resetData():void {
    this.$data.importedItem_TextValue = ''
    // this.$data.importedItem_ListnameOf = ''
    // this.$data.importedItem_nameOf = ''
  }

  async createList(data:string):Promise<void> {
    const createId = uuidv4();
      await this.listOfLists.updateListOfLists({
        nameOf: data,
        done: false,
        id: createId,
        items: []
    });
  }

  // await this.todoListModule.updateTodoList({nameOf: this.$data.nameOf, category: this.$data.category, done: false} as ItemInterface);

  async createItems(data:ItemInterface): Promise<void> {
    console.log("Create ITEMS with: ", data)
    await this.todoItems.updateTodoList({
      nameOf: data.nameOf,
      category: data.category,
      done: false});
  }

//Checker for list or item type
  isListOfList(data:any):boolean {
    if (data.items && data.id) {
      return true
    }
    return false
  }

  //Checker for item type
  isItem(data:any):boolean {
    if (data.category && data.nameOf && data.done !== undefined) {
      return true
    }
    return false
  }

  //Checker for item type
  isArrayOfItem(data:any):boolean {
    console.log('DATA inside: ', data)
    let result = true
    data.forEach((el:any) => {
      if (!this.isItem(el)) {
        result = false
      }
    })
    return result
  }

  //Items constructions for list

  async populateLists(listOfTotosToPopulateList:ItemInterface[]):Promise<void> {
    listOfTotosToPopulateList.forEach((item:ItemInterface) => {
      //Check daca exista lista de pe 'item category prop'
      const searchIfListExists = this.listOfLists.listOfLists.findIndex((el:ListInterface) => el.nameOf === item.category)
      // let searchIfItemExistInExistingList:number;
      // if ( searchIfListExists >= 0) {
      //   searchIfItemExistInExistingList = this.listOfLists.listOfLists[searchIfListExists].items.findIndex((el:ItemInterface) => el.nameOf === item.nameOf)
      // } else {

      // }
      //Exista lista
      if (searchIfListExists >= 0 ) {
        if (this.listOfLists.listOfLists[searchIfListExists].items.findIndex((el:ItemInterface) => el.nameOf === item.nameOf) < 0) {
        this.createItems(item).then(() => {
          this.listOfLists.addItemInExistingListAction(item)
          })
        }
          //Nu exista
      } else if (searchIfListExists < 0) {
        this.createList(item.category).then(() => this.createItems(item)).then(() => this.listOfLists.addItemInExistingListAction(item))
      }
        //Daca da adaugam item

        //Daca nu, creem lista si adaugam item
    })
  }
  

  async checkImporterValue(): Promise<void> {

    this.$data.loadingData = true;
   
    const text = this.$data.importedItem_TextValue;
    console.log('TEXT: ', text)
    // const regexXML = /(<.[^(><.)]+>)/g;
    // let errorMessage = '';
    const adapter = new DataAdapter()

    const response = await adapter.builderTypeToObject({ data: text })


    console.log('RESPONSE: ', response)


    if (response.type === AcceptedDataTypes.JSON) {
      response.data.forEach((element:ListInterface|ItemInterface|ItemInterface[]): void => {

        console.log('ELEMENT: ', element)
        // const listExist = {
        //   exists: false,
        //   indexOfExistingList: -1
        // };
        //Check if its ListInterface
        if ( this.isListOfList(element)) {
          const elementList = (element as ListInterface)!
          const listInLists = this.listOfLists.listOfLists.findIndex((el:ListInterface) => el.nameOf === elementList.nameOf)!
          console.log('True, e lista')
          //List exists
          if (listInLists >= 0) {
            const listTypeConvertor =  elementList as ListInterface
             this.populateLists(listTypeConvertor.items as ItemInterface[])
          } else {
            this.createList(elementList.nameOf).then(()=> {
              const listTypeConvertor =  elementList as ListInterface
               this.populateLists(listTypeConvertor.items as ItemInterface[])
            });
          }
        } else if (this.isItem(element)) {
          const item = (element as ItemInterface)!
          //Existing list index according to item category
          // const listInLists = this.listOfLists.listOfLists.findIndex((el:ListInterface) => el.nameOf === item.category)!

          this.populateLists([item])
          // listExist.indexOfExistingList = listInLists
          console.log('False, sunt iteme!')
        } else if (this.isArrayOfItem(element)) {
          const items = (element as ItemInterface[])!
          this.populateLists(items)
        }

        // const listInLists = this.listOfLists.listOfLists.findIndex((el:ListInterface) => el.nameOf === element.nameOf)!

        // create new List
        // if (!listExist.exists) {
        //   this.createList(element.nameOf);
        // } 
  
        // let data = {
        //   index: +listInLists,
        //   item: element,
        //   idForList: uuidv4()
        // }
      })
    } 
        // this.listOfLists.addItemWithCheckOfList(data);
        //       // this.listOfLists.addItemInExistingListAction(data)
        //       this.createItems(element)
        //     // }
        //   })
        // } else {
        //   response.forEach((element:ListInterface|ItemInterface) => {
    
        //     console.log('Element: ', element)
        //     const indexOFExistingListInListsOfList = this.listOfLists.listOfLists.findIndex((el:ListInterface) => el.nameOf === element.nameOf)
        //     console.log('indexOFExistingListInListsOfList: ', indexOFExistingListInListsOfList)
    
        //     //CASE LISTS - too
        //     if (indexOFExistingListInListsOfList >= 0) {
        //       console.log('Exista')
        //       console.log('Lista indexOFExistingListInListsOfList:', this.listOfLists.listOfLists[indexOFExistingListInListsOfList])
        //       const newList:ListInterface = this.listOfLists.listOfLists.find((el:ListInterface) => el.nameOf === element.nameOf)!
        //       const setTypeToElement = element as ListInterface
              
        //       setTypeToElement.items.forEach((u:ItemInterface) => {
        //         if ((newList.items.findIndex((el) => el.nameOf === u.nameOf)) < 0) {
        //           this.createItems(u)
        //           newList.items.push(u)
        //         }
        //       });
        //     } else {
        //       //Daca nu exista lista se creaza si se pun itemele aferente
        //       this.createList(element.nameOf);
        //       const cloneList = cloneDeep(element as ListInterface)
    
        //       const newList:ListInterface = this.listOfLists.listOfLists.find((el:ListInterface) => el.nameOf === element.nameOf)!
        //       cloneList.items.forEach((el:ItemInterface) => {
        //         this.createItems(el)
        //         newList.items.push(el)
        //       })
        //     }
        //   });
          
        // }









      // if (response === true) {
      //   console.log('JSOOOON')
      // }

    // if (adapter.isType({data: text, type: AcceptedDataTypes.JSON})) {
    //   const response = await adapter.builderTypeToObject({data: text, type: AcceptedDataTypes.JSON})
    //   if (response === true) {
    //     console.log('JSOOOON')
    //   }
    // } else if (adapter.isType({data: text, type: AcceptedDataTypes.XML})) {
    //   const response = await adapter.builderTypeToObject({data: text, type: AcceptedDataTypes.JSON})
    //   if (response === true) {
    //     console.log('XMMMMML')
    //   }
    // }









   
    //JSON - validate and OBJ builder
    // if ((/^[\],:{}\s]*$/).test(text.replace(/\\["\\/bfnrtu]/g, '@').
    //   replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+,-]?\d+)?/g, ']').
    //   replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    //   const dataJson = jsonObjBuilder(text)

    //   if ( dataJson.error === false ) {
    //     this.$data.fileType = 'JSON'
    //     this.$data.importedItem_TextValue = cloneDeep(dataJson.response)
    //   } else {
    //     errorMessage = `${dataJson.response}`;
    //   }

    // //XML - validate and OBJ builder
    // } else if (regexXML.test(text)){     
    //   const dataXML = await validadeXMLTags(text)
    //   console.log('XML inside ITEMPORTER: ', dataXML.responseObj)
    //   if ( dataXML.error === false ) {
    //     this.$data.fileType = 'XML'
    //     this.$data.importedItem_TextValue = cloneDeep(dataXML.responseObj)
    //   } else {
    //     errorMessage = `${dataXML.responseObj}`;
    //   }
    // } else {
    //   errorMessage = 'Please insert a valid JSON or XML!'
    // }

    // //Error Handdle
    // // console.log('errorMessage', errorMessage)
    // if (errorMessage !== '') {
    //   alert(`Not a JSON or XML format! ${errorMessage!}`);
    //   this.resetData()
    // } else {

    //   //TODO - insert DATA in list of list
    //   console.log('This DATA textarea: ', this.$data.importedItem_TextValue)
    //   console.log('This data type format: ', this.$data.fileType)


    //   /**
    //    * 1. validate imported file data format
    //    * 2. transform from imported into list/items/ for all 3 cases
    //    * 3. add importedData to listOfLists
    //    * 4. based on transform data type check if is not duplicated info (merge if lists exist)
    //    * 5. export all import all should show the same data
    //    */

    //   //CASE list of lists
    //   const dataToUse = this.$data.importedItem_TextValue;
    //   if (this.$data.fileType === 'JSON') {
        
    //     console.log('Length: ', dataToUse.items)
    //     if (dataToUse.items) {
    //       console.log('iteme')
    //       dataToUse.items.forEach((element:ItemInterface): void => {
    //         console.log(element)
    //         const listInLists = this.listOfLists.listOfLists.findIndex((el:ListInterface) => el.nameOf === element.category)!
  
    //         ///////////////////////////////////////////////////
    //         //ISSUE CAND SE CREAZA LISTA PE BAZA ITEM.CATEGORY si se da doar item category fara lista
    //         ///////////////////////////////////////////////////
  
    //         if (listInLists < 0) {
    //           this.createList(element.category);
    //         }
  
    //         //WORKS this under
    //         // if (this.listOfLists.listOfLists[listInLists].items.findIndex((item:ItemInterface) => item.nameOf === element.nameOf) < 0) {
    //           // this.listOfLists.listOfLists[listInLists].items.push(element)
    //           let data = {
    //             index: +listInLists,
    //             item: element,
    //             idForList: uuidv4()
    //           }
    //           this.listOfLists.addItemWithCheckOfList(data);
    //           // this.listOfLists.addItemInExistingListAction(data)
    //           this.createItems(element)
    //         // }
    //       })
    //     } else {
    //       dataToUse.forEach((element:ListInterface|ItemInterface) => {
    
    //         console.log('Element: ', element)
    //         const indexOFExistingListInListsOfList = this.listOfLists.listOfLists.findIndex((el:ListInterface) => el.nameOf === element.nameOf)
    //         console.log('indexOFExistingListInListsOfList: ', indexOFExistingListInListsOfList)
    
    //         //CASE LISTS - too
    //         if (indexOFExistingListInListsOfList >= 0) {
    //           console.log('Exista')
    //           console.log('Lista indexOFExistingListInListsOfList:', this.listOfLists.listOfLists[indexOFExistingListInListsOfList])
    //           const newList:ListInterface = this.listOfLists.listOfLists.find((el:ListInterface) => el.nameOf === element.nameOf)!
    //           const setTypeToElement = element as ListInterface
              
    //           setTypeToElement.items.forEach((u:ItemInterface) => {
    //             if ((newList.items.findIndex((el) => el.nameOf === u.nameOf)) < 0) {
    //               this.createItems(u)
    //               newList.items.push(u)
    //             }
    //           });
    //         } else {
    //           //Daca nu exista lista se creaza si se pun itemele aferente
    //           this.createList(element.nameOf);
    //           const cloneList = cloneDeep(element as ListInterface)
    
    //           const newList:ListInterface = this.listOfLists.listOfLists.find((el:ListInterface) => el.nameOf === element.nameOf)!
    //           cloneList.items.forEach((el:ItemInterface) => {
    //             this.createItems(el)
    //             newList.items.push(el)
    //           })
    //         }
    //       });
          
    //     }
    //   } else if (this.$data.fileType === 'XML') {
    //     console.log('NEED WORK DATA AS XML')
    //   }

    //   //MUTATIONS, build LISTS
    //   // await this.filesList.addFileToListAction({
    //   //   nameOfFile: this.$data.importedItem_Name,
    //   //   listNameOfItem: this.$data.importedItem_ListName,
    //   //   textValueOfItem: this.$data.importedItem_TextValue,
    //   //   fileTypeOfItem: this.$data.fileType
    //   // })
    //   // .then(() =>  this.resetData())
    // }

    this.$data.loadingData = false;
    this.$data.dialog = false;
  }

  
  mounted() {
//     const test = {
//       ListOfLists: [
//         {
//         lists: [
//           {
//             l: 'Vlad'
//           },
//           {
//             "id": "af5721ad-3b33-435a-bc44-0895b2571ea5",
//           "category": "d",
//           "_name": "saddasadasdasd",
//           "done": false
//           },
//           {
//             "id": "af5721ad-3b33-435a-5b2571ea5",
//             "category": "d",
//             "_name": "saddasadasdasd",
//             "done": false
//           }
//         ]},
//         {
//           lists: [
//           {
//             l: 'Vlad'
//           },
//           {
//             "id": "af5721ad-3435a-bc44-0895b2571ea5",
//             "category": "d",
//             "_nameOf": "saddasadasdasd",
//             "done": false
//           },
//           {
//             "category": "d",
//             "_nameOf": "saddasadasdasd",
//             "done": false
//           }
//           ]
//         }
     
//   // {
//   //   "nameOf": "d",
//   //   "done": false,
//   //   "id": "f32c82a2-8268-4387-929f-10dbeb2aeee7",
//   //   "items": [
//   //     {
//   //       "category": "d",
//   //       "nameOf": "saddasadasdasd",
//   //       "done": false
//   //     },
//   //     {
//   //       "category": "d",
//   //       "nameOf": "saddasad",
//   //       "done": false
//   //     },
//   //     {
//   //       "category": "d",
//   //       "nameOf": "dasad",
//   //       "done": false
//   //     },
//   //     {
//   //       "category": "d",
//   //       "nameOf": "da",
//   //       "done": false
//   //     },
//   //     {
//   //       "category": "d",
//   //       "nameOf": "saddasadasd",
//   //       "done": false
//   //     }
//   //   ]
//   // }
// ]
//     }

//     const test2 = {
//       'root':[
//         {
//           "nameOfl": "Do",
//           "done": false,
//           "id": "c8b3ed95-5759-4b79-853c-b11fd98e88c0",
//           "itemsFor": [
//             {
//               "category": "Do",
//               "nameOfasd": "dddd",
//               "done": false
//             },
//             {
//               "category": "Do",
//               "nameOfasd": "asdsss",
//               "done": false
//             },
//             {
//               "category": "Do",
//               "nameOf": "asd",
//               "done": false
//             }
//           ]
//         }
//       ]
//     }

//     const variabila = jsontoxmlBuilder((test));
//     console.log('VARIABILA: ' ,variabila)
//     console.log('test2: ' ,jsontoxmlBuilder(test2))
  }
}

</script>

<style>

</style>