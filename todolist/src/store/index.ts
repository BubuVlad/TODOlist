import Vue from 'vue'
import Vuex from 'vuex'
import todoList from './modules/todoList'
import listOfLists from './modules/listsOfTodos'
import listsAndItemsStates from './modules/historyStates'
// import FileList from './modules/filesList'
import VueLodash from 'vue-lodash'
import _ from 'lodash'
Vue.use(Vuex, VueLodash, _ )
const store = new Vuex.Store({
  modules: {
    todoList,
    listOfLists,
    listsAndItemsStates,
    // FileList
  }
})
export default store
