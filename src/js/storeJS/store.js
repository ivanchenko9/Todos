import todoReducer from './reducers/todoReducer.js'

class Store {
     constructor(){
         this._state = {
            tasksData:{
                todosAll : [],
                isConfirmedAll: false
            }
         }
     }

     getState(){
         return this._state
     }

     dispatch(action){
        this._state.tasksData = todoReducer(action, this._state.tasksData)
      }
}

const store = new Store()

export default store
