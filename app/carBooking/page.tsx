'use client';
import Header from "@/components/ui/Header";
import VehicleGroupSelector from "@/components/ui/VehicleGroupSelector";
import VehicleCard from "@/components/ui/VehicleCard";

export default function HomePage() {
  return (
    <main className="bg-blue-100 min-h-screen px-6 py-10">
      <Header onSearchResults={() => {}} />

      <h2 className="text-3xl font-bold text-center my-10 text-black">
        Select a vehicle group
      </h2>

      <VehicleGroupSelector />

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <VehicleCard name="Mercedes" type="Sedan" price={25} transmission="Automat" />
        <VehicleCard name="Mercedes" type="Sport" price={50} transmission="Manual" />
        <VehicleCard name="Mercedes" type="Sedan" price={45} transmission="Automat" />
      </div>
    </main>
  );
}
