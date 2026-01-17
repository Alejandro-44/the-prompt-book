import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/services";

type UserCardProps = {
  user: User;
};

export function UserCard({ user }: UserCardProps) {
  return (
    <article className="border-b px-4 py-6">
      <div className="flex items-start gap-4">
        <Avatar className="size-20">
          <AvatarFallback className="text-2xl">
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-muted-foreground">@{user.handle}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
