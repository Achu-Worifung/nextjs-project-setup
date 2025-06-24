import * as React from "react";

// import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
} from "@/components/ui/carousel";
import { SelectVehicle } from "@/components/ui/select-vehicle";
import { SelectHotel } from "@/components/ui/select-hotel";
import { FlightSelection } from "@/components/ui/flight-selection";

export function CarouselDemo() {
  return (
    <Carousel className="w-full  pt-5">
      <CarouselContent>
      <CarouselItem id="Flights">
        <FlightSelection />
      </CarouselItem>
        <CarouselItem id="Vehicles">
          <SelectVehicle />
        </CarouselItem>
        <CarouselItem id="Hotels">
          <SelectHotel />
        </CarouselItem>
      </CarouselContent>
      {/* <CarouselPrevious /> */}
      {/* <CarouselNext /> */}
    </Carousel>
  );
}
