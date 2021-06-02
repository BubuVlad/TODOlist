import Vue from "vue";
import Vuex from "vuex";
import todoList from "./modules/todoList";
import listOfLists from "./modules/listsOfTodos";
import listsAndItemsStates from "./modules/historyStates";
import VueLodash from "vue-lodash";
import _ from "lodash";
Vue.use(Vuex, VueLodash, _);
const store = new Vuex.Store({
  modules: {
    todoList,
    listOfLists,
    listsAndItemsStates,
  },
});
export default store;
