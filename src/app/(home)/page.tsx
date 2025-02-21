import { Button } from "@/components/ui/button";

export default function Home() {
  return (
   <div>
    <p className="font-bold text-rose-500">
      Hello World
      <Button variant="destructive" size="sm">
        Click me
      </Button>
    </p>
   </div>
  );
}
