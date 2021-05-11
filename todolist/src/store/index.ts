import Vue from 'vue'
import Vuex from 'vuex'
import todoList from './modules/todoList'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    todoList
  }
})
export default store


// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)

// export default new Vuex.Store({
//   state: {
//     todos: [
//       {
//         id: 1,
//         name: 'Default 1',
//         category: 'Default Category 1'
//       },
//       {
//         id: 2,
//         name: 'Default 2',
//         category: 'Default Category 2'
//       },
//       {
//         id: 3,
//         name: 'Default 3',
//         category: 'Default Category 3'
//       },
//       {
//         id: 4,
//         name: 'Default 4',
//         category: 'Default Category 4'
//       }
//     ]
//   },
//   getters: {
//     allTodos: (state) => state.todos
//   },
//   mutations: {
//     addTodo(state, todo) {
//       state.todos.push(todo)
//     }
//   },
//   actions: {
//     addTodo({commit}, todo):void {
//       commit("addTodo", todo)
//     }
//   },
//   modules: {
//   }
// })
