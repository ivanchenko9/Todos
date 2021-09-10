import * as axios from 'axios'


const instance = axios.create({
    baseURL: 'http://localhost:3000'
})

 const todosAPI = {
    getTodosData () {
        try {
            return instance.get('/dudos').then(response => console.log(response.data))
        }
        catch (error){
            alert('Ошибка при получении данных!')
            console.error(error)
        }
    },
    addTodo (rawTodo) {
        try {
            const stringifyTodo = JSON.stringify(rawTodo)
            return instance.post(stringifyTodo).then( response => console.log(response.data))
        }
        catch (error){
            alert('Ошибка при отправке данных!')
            console.error(error)
        }
    }
}

export default todosAPI