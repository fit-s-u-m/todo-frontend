'use client'
import { BadgeX, FilePenLine } from "lucide-react"
import { ITodo } from "@/types/todo"
import { Checkbox } from "./ui/checkbox"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Modal } from "./ModalComponet"
import EditTodoComponet from "@/components/EditTodoComponet"
import DeleteTodoComponet from "@/components/DeleteTodoComponet"



const updateTodo = async (todo: ITodo): Promise<ITodo> => {
	const { data } = await axios.put(`http://localhost:8080/todos/${todo.id}`, todo, {
		headers: {
			'Content-Type': 'application/json',
		},
	});
	return data
}

export default function TodoComponet({ todo: input_todo, todoChanged }: { todo: ITodo, todoChanged: Function }) {
	const [loading, setLoading] = useState<boolean>()
	const [todo, setTodo] = useState<ITodo>(input_todo)
	const [changed, setChanged] = useState<boolean>()
	useEffect(() => {
		setLoading(true)
		updateTodo(todo).then((_newTodo) => setLoading(false))
		todoChanged((prev: boolean) => !prev)
	}, [todo, changed])

	return (
		<div className="flex gap-2 ">
			<Checkbox
				checked={todo.is_done}
				onCheckedChange={() =>
					setTodo((prev) => ({ ...prev, is_done: !prev.is_done }))
				}
				className="w-8 h-8 flex-none" />
			<div className="flex flex-grow items-start">
				<div className="flex  flex-col gap-2">
					<p className={`b-5 text-xl text-gray-900 font-bold ${todo.is_done ? 'line-through' : ''}`} > {todo.name} </p>
					<p className={`b-5 text-gray-400 ${todo.is_done ? 'line-through' : ''}`} > {todo.description} </p>
					<p className={`b-5 text-gray-600 font-bold ${todo.is_done ? 'line-through' : ''}`} > {todo.deadline} </p>
				</div>
			</div>
			<div className="flex-none flex gap-5">
			</div>
			<Modal
				body={EditTodoComponet(todo, setTodo)}
				title="Edit todo"
				trigger={<Button > <FilePenLine /> </Button >}
				description="edit prev todo"
			/>

			<DeleteTodoComponet
				todo={todo}
				changed={setChanged}
				trigger={<Button> <BadgeX /> </Button>}
			/>

			{loading ? <p>loading ...</p> : null}
		</div >
	)
}

// <Button onClick={() => }  > <BadgeX /> </Button >
