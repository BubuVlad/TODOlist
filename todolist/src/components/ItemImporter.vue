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

  listOfLists: ListOfLists = getModule(ListOfLists, this.$store)
  todoItems: TodoListModule = getModule(TodoListModule, this.$store);
  
  data(): Record<string, unknown> {
    return {
      importedItem_TextValue: '',
      loadingData: false,
      dialog: false,
      fileType: String
    }
  }

  resetData():void {
    this.$data.importedItem_TextValue = ''
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

  async createItems(data:ItemInterface): Promise<void> {
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
    })
  }
  

  async checkImporterValue(): Promise<void> {

    this.$data.loadingData = true;
   
    const text = this.$data.importedItem_TextValue;
    const adapter = new DataAdapter()

    const response = await adapter.builderTypeToObject({ data: text })

    if (response.type === AcceptedDataTypes.JSON) {
      response.data.forEach((element:ListInterface|ItemInterface|ItemInterface[]): void => {

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

          this.populateLists([item])

        } else if (this.isArrayOfItem(element)) {
          const items = (element as ItemInterface[])!
          this.populateLists(items)
        }
      })
    } else if ( response.type === AcceptedDataTypes.XML ) {
      console.log('Handdle xml')
      console.log('XML DATA: ', response.data)
      // for (let key in response.data) {
      //   console.log(key)
      // }
      const newResponseBuild = [{}];
      // for(let key in response.data) {
      //   const data = {
      //     key: response.data.key
      //   }
      //   console.log('DAta:', data)
      // }
      // let obj = [{

      // }]
      for( let [key, value] of Object.entries(response.data)) {
        // obj[key] = value
        console.log("Array: ", value)
        // for (let i = 0; i < value.length; i++) {
        //   console.log(value[i])
        //   obj[i][key] = value[i]
        //   // newResponseBuild.push({prop: value[i]})
          
        // }
      }

      console.log(newResponseBuild)
      // console.log('newResponseBuild', newResponseBuild)
      // response.data.forEach((dataSet:any, index:number) => {
      //   const done:boolean  = dataSet[index];
      //   const id:string = dataSet[index];
      //   const nameOf:string = dataSet[index];
      //   const items:ItemInterface[]= dataSet[index];
        
      // })
  // console.log('Response.data: ', response.data)

     
    }

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