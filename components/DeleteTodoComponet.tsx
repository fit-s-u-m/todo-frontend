'use client'
import { toast } from "@/hooks/use-toast"
import { ITodo } from "@/types/todo";
import axios from "axios";
import { ReactNode, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const deleteTodo = async (todo: ITodo): Promise<ITodo> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "*/*");

  const { data } = await axios.delete(`http://localhost:8080/todos/${todo.id}`);
  console.log("data", data)
  return data;
};



export default function DeleteTodoComponent({ todo, trigger, changed }: { todo: ITodo, trigger: ReactNode, changed: Function }) {
  const [loading, setLoading] = useState<boolean>()
  async function onDelete() {
    setLoading(true)
    await deleteTodo(todo)
    setLoading(false)
    toast({
      title: `Task deleted ${todo.name}`,
      description: `No going back`
    })
    changed((prev: boolean) => !prev)
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {trigger}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your task
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {loading ? <p className="text-red-900 font-bold text-3xl"> loading ...</p> : null}
    </>
  )
}
