import * as axios from 'axios'


const instance = axios.create({
    baseURL: 'http://localhost:3000'
})

 const todosAPI = {
    getTodosData () {
        try {
            return instance.get().then(response => response.data)
        }
        catch (error){
            alert('Ошибка при получении данных!')
            console.error(error)
        }
    },
    addTodo (rawTodo) {
        try {
            const stringifyTodo = JSON.stringify(rawTodo)
            return instance.post('/todos', stringifyTodo).then( response => console.log(response.data))
        }
        catch (error){
            alert('Ошибка при отправке данных!')
            console.error(error)
        }
    },
    updateTodo(event){
        const selectedId = Number(event.target.parentNode.getAttribute('data'))
        try {
            const rawQuerySetting = {
                id : selectedId
            }
            const parsedQuerySetting = JSON.stringify(rawQuerySetting)
            return instance.post('/todos/update', parsedQuerySetting).then( response => console.log(response.data))
        }
        catch (error){
            alert('Ошибка при обновлении данных!')
            console.error(error)
        } 
    },
    deleteTodo(event){
        const selectedId = Number(event.target.parentNode.getAttribute('data'))
        try {
            const rawQuerySetting = {
                id : selectedId
            }
            const parsedQuerySetting = JSON.stringify(rawQuerySetting)
            return instance.post('/todos/delete', parsedQuerySetting).then( response => console.log(response.data))
        }
        catch (error){
            alert('Ошибка при удалении данных!')
            console.error(error)
        }  
    },
    clearDone(){
        try {
            return instance.post('/todos/cleardone').then( response => console.log(response.data))
        }
        catch (error){
            alert('Ошибка при удалении выполненых заданий!')
            console.error(error)
        }  
    },
    completeAll(){
        try {
            return instance.post('/todos/completeall').then( response => console.log(response.data))
        }
        catch (error){
            alert('Ошибка при выполнении заданий!')
            console.error(error)
        } 
    }

}

export default todosAPI