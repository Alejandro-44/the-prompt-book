import { Spinner } from "@/components/ui/spinner";

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner className="size-20" />
    </div>
  );
}
