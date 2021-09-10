import store from './storeJS/store.js'
import todosAPI from './api/api.js'
import '../styles/styles.css'

import { createTaskAC,
         setIsConfirmedAll,
         setTodosAll } from './storeJS/reducers/todoReducer.js'


class EventEmitter {
    constructor() {
      this.events = {};
    }

    subscribe(eventName, fn) {
        if(!this.events[eventName]) {
          this.events[eventName] = [];
        }
          
        this.events[eventName].push(fn);
        
        return () => {
          this.events[eventName] = this.events[eventName].filter(eventFn => fn !== eventFn);
        }
      }

    emit(eventName, data) {
        const event = this.events[eventName];
        if( event ) {
          event.forEach(fn => {
             fn.call(null, data);
           });
         }
    }
}

class Main{

       constructor (tasksEnst, 
            todoAmountSelect, 
            tasksSelect, 
            createTaskInputSelector, 
            changeModeAllSelector, 
            changeModeActiveSelector, 
            changeModeCompletedSelector, 
            clearAllCompletedBtnSelector, 
            confirmeAllBtnSelector) {
           this.tasksEnst = tasksEnst,
           this.todoAmountSelector = document.querySelector(todoAmountSelect),
           this.tasks = document.querySelector(tasksSelect),
           this.createTaskInput= document.querySelector(createTaskInputSelector),
           this.changeModeAll = document.querySelector(changeModeAllSelector),
           this.changeModeActive = document.querySelector(changeModeActiveSelector),
           this.changeModeCompleted = document.querySelector(changeModeCompletedSelector),
           this.clearAllCompletedBtn = document.querySelector(clearAllCompletedBtnSelector),
           this.confirmeAllBtn = document.querySelector(confirmeAllBtnSelector),
           this.emitter = new EventEmitter()
           
       }

       changeTasksAmount(){
        if(store.getState().tasksData.todosAll.length){
            const todoAmount = store.getState().tasksData.todosAll.reduce((total, curent) => {
                if(!curent.isCompleted){
                    return total + 1
                } else {
                    return total
                }
            }, 0)
            this.todoAmountSelector.innerText = todoAmount
        } else{
            this.todoAmountSelector.innerText = '0'
        }
       }

       creatTask(event){
            const taskText = event.target.value
            store.dispatch(createTaskAC(taskText))
            this.displayTasks(store.getState().tasksData.todosAll)
            event.target.value=''
            this.tasksEnst.saveDataOnLocaleStorage()
       }

       clearParentNode(){
        const contentNode = document.querySelector('.content')
        contentNode.removeChild(this.tasks)
        this.tasks = document.createElement('div')
        this.tasks.classList.add('tasks')
        contentNode.appendChild(this.tasks)
        this.tasks = document.querySelector('.tasks')
       }
       
    displayTasks(selectedArray){
              
        this.clearParentNode()

        if (selectedArray.length > 0) {
            selectedArray.forEach(item => {

                const itemTask = new TaskRender(item, this.tasks)
                itemTask.render()

                //binding buttons for change task status

                const changeStatusBtns = document.querySelectorAll('.task__status')

                changeStatusBtns.forEach(changeStatusBtn => {
                    if (!changeStatusBtn.classList.contains('controled')){
                    changeStatusBtn.addEventListener('click', (event) => {
                        this.emitter.emit('event:change-status', event)
                    })
                    changeStatusBtn.classList.add('controled')
                }
            })

                //binding buttons for delete task

                const deleteTaskBtns = document.querySelectorAll('.task__delete')

                deleteTaskBtns.forEach(deleteBtn => {
                    if (!deleteBtn.classList.contains('controled')){
                        deleteBtn.addEventListener('click', (event) => {
                            this.emitter.emit('event:delete-task', event)
                        })

                        deleteBtn.classList.add('controled')
                    }
        })
        
                this.changeTasksAmount()
                })
        }
       }

       addEmitters(){
        this.emitter.subscribe('event:create-task', (event) => {
            this.creatTask(event)
            this.tasksEnst.saveDataOnLocaleStorage()
        })

        this.emitter.subscribe('event:mode-all', () => {
            this.displayTasks(store.getState().tasksData.todosAll)
        })

        this.emitter.subscribe('event:mode-active', () => {
            const todosActive = this.tasksEnst.getTodosInProgress()
            this.displayTasks(todosActive)
        })

        this.emitter.subscribe('event:mode-completed', () => {
            const todosCompleted = this.tasksEnst.getTodosDone()
            this.displayTasks(todosCompleted)
        })

        this.emitter.subscribe('event:clear-all-completed', () => {
            this.tasksEnst.clearAllCompletedTasks()
            this.displayTasks(store.getState().tasksData.todosAll)
        })

        this.emitter.subscribe('event:confirm-all', () => {
            this.tasksEnst.confirmeAllTasks()
            this.displayTasks(store.getState().tasksData.todosAll)
            this.tasksEnst.saveDataOnLocaleStorage()
        })

        this.emitter.subscribe('event:change-status', (event) => {
            const newArray = this.tasksEnst.createChangedStatusArray(event)
            store.dispatch(setTodosAll(newArray))
            this.displayTasks(store.getState().tasksData.todosAll)
            this.changeTasksAmount()
            this.tasksEnst.saveDataOnLocaleStorage()
        })

        this.emitter.subscribe('event:delete-task', (event) => {
            const newArray = this.tasksEnst.createAfterDeletingArray(event)
            store.dispatch(setTodosAll(newArray))
            this.changeTasksAmount()
            this.displayTasks(store.getState().tasksData.todosAll)
            this.tasksEnst.saveDataOnLocaleStorage()
        })

       }

        bindAllButtons(){
            this.changeTasksAmount()
            this.addEmitters()

            this.createTaskInput.addEventListener('keydown', (event) => {
                if(event.code === 'Enter'){
                    if(event.target.value !== '') {
                        this.emitter.emit('event:create-task', event)
                    }
                }
            })
        
            this.changeModeAll.addEventListener('click', () => {
                this.emitter.emit('event:mode-all')
            })
            
            this.changeModeActive.addEventListener('click', () => {
                this.emitter.emit('event:mode-active')
            })
        
            this.changeModeCompleted.addEventListener('click', () => {
                this.emitter.emit('event:mode-completed')
            })
        
            this.clearAllCompletedBtn.addEventListener('click', () => {
                this.emitter.emit('event:clear-all-completed')
            })
        
            this.confirmeAllBtn.addEventListener('click', () => {
                this.emitter.emit('event:confirm-all')
            })
        }

        firstLoad(){
            this.tasksEnst.getDataFromLocaleStorage()
            this.displayTasks(store.getState().tasksData.todosAll)
            this.bindAllButtons()
        }
}

class Tasks{
    getDataFromLocaleStorage(){
        if(localStorage.getItem('todosAll') && localStorage.getItem('confirmeAllStatus')){
            const rawArray = localStorage.getItem('todosAll'),
                  newArray = JSON.parse(rawArray),
                  newIsConfirmedAll = localStorage.getItem('confirmeAllStatus')
            store.dispatch(setTodosAll(newArray))
            store.dispatch(setIsConfirmedAll(newIsConfirmedAll))
        }
        const response = todosAPI.getTodosData()
    }

    saveDataOnLocaleStorage(){
        const ModedArray = JSON.stringify(store.getState().tasksData.todosAll)
        localStorage.setItem('todosAll', ModedArray)
        localStorage.setItem('confirmeAllStatus', store.getState().tasksData.confirmeAllStatus)
    }

    // addToTasks(taskText){
    //     this.todosAll.push({
    //         id: Date.now(),
    //         isCompleted: false,
    //         title: taskText
    //     })
    // }

    createChangedStatusArray(event){
        const newArray = store.getState().tasksData.todosAll.map(todo => {
            const searchedId = Number(event.target.parentNode.getAttribute('data'))
            if(todo.id === searchedId) {
                return {
                    ...todo,
                    isCompleted: !todo.isCompleted
                }
            } else {
                return {...todo}
            }
        })
        return newArray
    }

    createAfterDeletingArray(event){
        const newArray = store.getState().tasksData.todosAll.filter(todo => todo.id !== Number(event.target.parentNode.getAttribute('data')))
        return newArray
    }

    getTodosInProgress(){
        
        const todosActive = store.getState().tasksData.todosAll.filter((todo) => todo.isCompleted === false)
        return todosActive
    }

    getTodosDone(){
        const todosCompleted = store.getState().tasksData.todosAll.filter((todo) => todo.isCompleted === true)
        return todosCompleted
    }

    clearAllCompletedTasks(){
        const newArray = store.getState().tasksData.todosAll.filter(todo => todo.isCompleted !== true)
        store.dispatch(setTodosAll(newArray))
        this.saveDataOnLocaleStorage()
    }

    confirmeAllTasks(){
        if(store.getState().tasksData.isConfirmedAll){
             const newArray = store.getState().tasksData.todosAll.map(todo => ({
                ...todo,
                isCompleted: false
            }))
            store.dispatch(setTodosAll(newArray))
        } else {
            const newArray = store.getState().tasksData.todosAll.map(todo => ({
                ...todo,
                isCompleted: true
            }))
        store.dispatch(setTodosAll(newArray))
        }
        store.dispatch(setIsConfirmedAll(!store.getState().tasksData.isConfirmedAll))
        this.saveDataOnLocaleStorage()
    }
}

class TaskRender{
       constructor(item, tasks){
        this.id = item.id,
        this.title = item.title,
        this.isCompleted = item.isCompleted,
        this.tasks = tasks
       }

       render(){
            const task = document.createElement('div'),
            taskStatus = document.createElement('button'),
            taskTitle = document.createElement('p'),
            taskDelete = document.createElement('button')

            task.classList.add('task')
            taskStatus.classList.add('task__status')
            taskTitle.classList.add('task__title')
            taskDelete.classList.add('task__delete')
            if (this.isCompleted) {
                taskTitle.classList.add('task__completed')
            }

            taskStatus.innerText = this.isCompleted?'Done':'In progress'
            taskTitle.innerText = this.title
            taskDelete.innerText = 'Delete'

            task.setAttribute('data', this.id)
            
            task.append(taskStatus, taskTitle, taskDelete)
            this.tasks.appendChild(task)
       }
}

window.addEventListener('DOMContentLoaded', () => {
        const tasksEnst = new Tasks(),
          mainPage = new Main(
              tasksEnst, 
              '.task__amount__data', 
              '.tasks', 
              '.create__task__input', 
              '.mode__all', 
              '.mode__active',
              '.mode__completed',
              '.clear__completed',
              '.confirme__all'
              )
        
        mainPage.firstLoad()
    
})
