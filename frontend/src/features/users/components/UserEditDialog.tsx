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
import { useState } from "react";
import { useUpdateUser } from "../hooks";
import { useUserStore } from "../contexts";
import type { UserFormValues } from "../schema";

export function UserEditDialog() {
  const [open, setOpen] = useState(false);
  const { user } = useUserStore();
  const { mutate, isPending, error } = useUpdateUser({ 
    user: user!
  });
  const onUpdateUser = (data: UserFormValues) => {
    mutate(data);
    setOpen(false);
  }
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="outline" className="absolute right-0 top-0">
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
        <UserForm user={user!} handleSubmit={onUpdateUser} isPending={isPending} error={error} />
      </DialogContent>
    </Dialog>
  );
}
