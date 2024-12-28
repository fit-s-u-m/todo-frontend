import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogClose,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { JSX, ReactNode } from "react"

type Ipram = {
	title: string,
	trigger: ReactNode,
	description: string,
	body: JSX.Element,
}

export function Modal({ title, trigger, body, description }: Ipram) {
	return (
		<Dialog >
			<DialogTrigger asChild>
				{trigger}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					{description}
				</DialogDescription>
				<DialogClose />
				{body}
			</DialogContent>
		</Dialog>
	)
}
