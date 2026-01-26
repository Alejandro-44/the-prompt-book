import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PenLine } from "lucide-react";
import { UserForm } from "./UserForm";


export function UserEditDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="absolute right-0 top-0">
          <PenLine className="size-4 mr-2" />
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <UserForm />
      </DialogContent>
    </Dialog>
  );
}
