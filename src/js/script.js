window.addEventListener('DOMContentLoaded', () => {
    let todosAll = [],
        confirmAllStatus = false

    const createTaskInput= document.querySelector('.create__task__input'),
          todoAmountSelector = document.querySelector('.task__amount__data'),
          changeModeAll = document.querySelector('.mode__all'),
          changeModeActive = document.querySelector('.mode__active'),
          changeModeCompleted = document.querySelector('.mode__completed'),
          clearAllCompletedBtn = document.querySelector('.clear__completed'),
          confirmeAllBtn = document.querySelector('.confirme__all')
    let changeStatusBtns = document.querySelectorAll('.task__status'),
        tasks = document.querySelector('.tasks')

    changeTasksAmount()
          
    function changeTasksAmount () {
        if(todosAll.length){
            const todoAmount = todosAll.reduce((total, curent) => {
                console.log('curent: ', curent)
                if(!curent.isCompleted){
                    return total + 1
                } else {
                    return total
                }
            }, 0)
            todoAmountSelector.innerText = todoAmount
            console.log('Calc: ', todoAmount)
        } else{
            todoAmountSelector.innerText = '0'
        }
    }

    function clearParentNode () {
        const contentNode = document.querySelector('.content')
              contentNode.removeChild(tasks)
              tasks = document.createElement('div')
              tasks.classList.add('tasks')
              contentNode.appendChild(tasks)
              tasks = document.querySelector('.tasks')
    }

    function displayTasks (selectedArray) {
        
        clearParentNode()

        if (selectedArray.length > 0) {
            console.log(selectedArray)
            selectedArray.forEach(item => {
                const task = document.createElement('div'),
                      taskStatus = document.createElement('button'),
                      taskTitle = document.createElement('p'),
                      taskDelete = document.createElement('button')
        
                task.classList.add('task')
                taskStatus.classList.add('task__status')
                taskTitle.classList.add('task__title')
                taskDelete.classList.add('task__delete')
                if (item.isCompleted) {
                    taskTitle.classList.add('task__completed')
                }
        
                taskStatus.innerText = item.isCompleted?'Done':'In progress'
                taskTitle.innerText = item.title
                taskDelete.innerText = 'Delete'

                task.setAttribute('data', item.id)
                 
                task.append(taskStatus, taskTitle, taskDelete)
                tasks.appendChild(task)

                //binding buttons for change task status

                changeStatusBtns = document.querySelectorAll('.task__status')

                changeStatusBtns.forEach(changeStatusBtn => {
                    if (!changeStatusBtn.classList.contains('controled')){
                    changeStatusBtn.addEventListener('click', (event) => {
                        //const eventRepleced = event
                        todosAll = createChangedStatusArray(event)
                        displayTasks(todosAll)
                        changeTasksAmount()
                    })
                    changeStatusBtn.classList.add('controled')
                }
            })

                //binding buttons for delete task

                let deleteTaskBtns = document.querySelectorAll('.task__delete')

                deleteTaskBtns.forEach(deleteBtn => {
                    if (!deleteBtn.classList.contains('controled')){
                        deleteBtn.addEventListener('click', (event) => {
                            //const eventRepleced = event
                            todosAll = createAfterDeletingArray(event)
                            changeTasksAmount()
                            displayTasks(todosAll)
                        })

                        deleteBtn.classList.add('controled')
                    }
        })
        
                changeTasksAmount()
                })
        }
    }
    

    function addToTasks( event) {
        todosAll.push({
            id: Date.now(),
            isCompleted: false,
            title: event.target.value
        })
    }

    function creatTask (event) {
        addToTasks(event)
        displayTasks(todosAll)
        event.target.value=''
    }

    function createChangedStatusArray (event) {
        const newArray = todosAll.map(todo => {
            const searchedId = Number(event.target.parentNode.getAttribute('data'))
            if(todo.id === searchedId) {
                return {
                    ...todo,
                    isCompleted: !todo.isCompleted
                }
            } else { console.log('log')
            return {...todo}}
        })
        return newArray
    }

    function createAfterDeletingArray (event) {
        const newArray = todosAll.filter(todo => todo.id !== Number(event.target.parentNode.getAttribute('data')))
        return newArray
    }


    createTaskInput.addEventListener('keydown', (event) => {
        if(event.code === 'Enter'){
            if(event.target.value !== '') {
                creatTask(event)
            }
        }
    })

    changeModeAll.addEventListener('click', () => {
        displayTasks(todosAll)
    })
    
    changeModeActive.addEventListener('click', () => {
        const todosActive = todosAll.filter((todo) => todo.isCompleted === false)
        displayTasks(todosActive)
    })

    changeModeCompleted.addEventListener('click', () => {
        const todosCompleted = todosAll.filter((todo) => todo.isCompleted === true)
        displayTasks(todosCompleted)
    })

    clearAllCompletedBtn.addEventListener('click', () => {
        todosAll = todosAll.filter(todo => todo.isCompleted !== true)
        displayTasks(todosAll)
    })

    confirmeAllBtn.addEventListener('click', () => {
        if(confirmAllStatus){
            todosAll = todosAll.map(todo => ({
                ...todo,
                isCompleted: false
            }))
        } else {
            todosAll = todosAll.map(todo => ({
                ...todo,
                isCompleted: true
        }))
        }
        confirmAllStatus = !confirmAllStatus
        displayTasks(todosAll)
    })
    
})
