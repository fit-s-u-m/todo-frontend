'use client';

import { ITodo } from '@/types/todo';
import { BadgePlus } from 'lucide-react';
import { useEffect, useState } from 'react';

import axios from 'axios';

import TodoComponet from '@/components/TodoComponet'
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ModalComponet';
import CreateTodoComponet from '@/components/CreateTodoComponet';

const fetchTodo = async (): Promise<ITodo[]> => {
  const { data } = await axios.get('http://localhost:8080/todos/');
  return data
}


const Todo = () => {
  const [todos, setTodos] = useState<ITodo[]>()
  const [changed, setChanged] = useState<boolean>()

  useEffect(() => {
    fetchTodo().then((todos: ITodo[]) => {
      setTodos(todos);
    })
  }, [changed])

  return (
    <div className='w-[50%] m-auto'>
      <h1 className='text-4xl font-bold text-center mb-20 mt-5'>
        Todo List
      </h1>
      <ul className="flex flex-col gap-5 justfiy-center items-start mt-8 ">
        {
          (todos == undefined || todos.length == 0) ?
            <p className="text-red-500 font-bold ">no todos</p> :
            (todos.map((todo: ITodo) => (
              <li key={todo.id} className='block w-[100%]'>
                <TodoComponet todo={todo} todoChanged={setChanged} />
              </li>
            )
            ))
        }
      </ul >
      <div className="flex flex-col gap-5 items-center mt-8 ">
        <Modal
          body={CreateTodoComponet({ setChanged })}
          title="New todo"
          trigger={<Button > <BadgePlus /> </Button >}
          description="create new todo"
        />
      </div>
    </div>
  )
}
export default Todo;
