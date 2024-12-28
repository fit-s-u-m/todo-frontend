"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"
import { useState } from "react"

import axios from "axios"

import { ITodo } from "@/types/todo"

import { format, parse } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"



const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(0).max(200),
  deadline: z.date({ required_error: "every task has a deadline" })
})

const editTodo = async (todo: ITodo): Promise<ITodo> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const { data } = await axios.put(`http://localhost:8080/todos/${todo.id}`, todo, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log("data", data)
  return data;
};



export default function EditTodoComponent(todo: ITodo, setTodo: Function) {
  const [loading, setLoading] = useState<boolean>(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: todo.name,
      description: todo.description,
      deadline: parse(todo.deadline, "PPP", new Date()),
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const todo = {
      name: values.name,
      description: values.description,
      deadline: format(values.deadline, "PPP"),
      is_done: false,
      created_time: format(new Date(), "PPP")
    }
    setLoading(true)
    await editTodo(todo)
    setLoading(false)
    toast({
      title: `Task created ${values.name}`,
      description: `Do it before ${format(values.deadline, "PP")}`
    })
    setTodo(todo)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Todo</FormLabel>
                <FormControl>
                  <Input placeholder="task name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name your going to acces the task
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="task description" {...field} />
                </FormControl>
                <FormDescription>
                  This is where you add details about the task
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {loading ? <p className="text-red-900 font-bold text-3xl"> loading ...</p> : null}
    </>
  )
}
