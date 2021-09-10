import todosAPI from "../../api/api"

const SET_TODOS = 'SET_TODOS',
      CHANGE_IS_CONFIRMED_ALL_STATUS = 'CHANGE_IS_CONFIRMED_ALL_STATUS',
      CREATE_TASK = 'CREATE_TASK'

const todoReducer = (action, state) => {
    switch (action.type){
         case CHANGE_IS_CONFIRMED_ALL_STATUS:
                return {
                    ...state,
                    isConfirmedAll: action.isConfirmedAll
                }
         case SET_TODOS:
                return {
                    ...state,
                    todosAll : action.newArray
                }
         case CREATE_TASK:
                const newTask = {
                    id: Date.now(),
                    isCompleted: false,
                    title: action.taskText
                }
                const response = todosAPI.addTodo(newTask)
                return {
                    ...state,
                    todosAll : [...state.todosAll, newTask]
                }
            
            default:
                return state
        }
}

export const createTaskAC = (taskText) => ({type: CREATE_TASK, taskText})
export const setIsConfirmedAll = (isConfirmedAll) => ({type: CHANGE_IS_CONFIRMED_ALL_STATUS, isConfirmedAll})
export const setTodosAll = (newArray) => ({type: SET_TODOS, newArray})

export default todoReducer