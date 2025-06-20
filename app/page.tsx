import Image from "next/image";
// import {ModeToggle} from "@/components/mode-to-toggle";
import {MyPlane} from "@/components/ui/my-plane";
import { FlightSelection } from "@/components/ui/flight-selection";
import {TopDestinations} from "@/components/ui/top-destinations";
import { TopHotels } from "@/components/ui/top-hotels";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import { TravelPoint } from "@/components/ui/travel-point";
import { Footer } from "@/components/ui/footer";
export default function Home() {
  return (
   <div className="flex flex-col items-center ">
       {/* <MyPlane /> */}
       <FlightSelection />
       <TopDestinations />
       <TopHotels />
       <InfiniteScroll />
       <TravelPoint />
       <Footer />
   </div>
  );
}
