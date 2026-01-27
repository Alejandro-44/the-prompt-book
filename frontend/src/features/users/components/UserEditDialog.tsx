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
import { useDeleteUser, useUpdateUser } from "../hooks";
import { useUserStore } from "../contexts";
import type { UserFormValues } from "../schema";

export function UserEditDialog() {
  const [open, setOpen] = useState(false);
  const { user } = useUserStore();
  const { mutate, isPending, error } = useUpdateUser({
    user: user!,
  });
  const { mutate: deleteMe } = useDeleteUser();

  const onUpdateUser = (data: UserFormValues) => {
    mutate(data);
    setOpen(false);
  };

  const onDeleteUser = () => {
    setOpen(false);
    deleteMe();
  }

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="absolute right-4 top-6"
        >
          <PenLine className="size-4" /><span className="hidden sm:inline ml-2">Edit profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          user={user!}
          handleSubmit={onUpdateUser}
          onCancel={() => setOpen(false)}
          onDelete={onDeleteUser}
          isPending={isPending}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
}
