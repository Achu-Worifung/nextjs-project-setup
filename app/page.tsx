import Image from "next/image";
import { ModeToggle } from "@/components/mode-to-toggle";
import {updateMenuItem} from "@/test-db"

export default function Home() {

  updateMenuItem();
  return (
    <div className="flex items-center justify-between px-8 py-4 bg-gradient-to-r ">
      
    
    </div>
  );
}
