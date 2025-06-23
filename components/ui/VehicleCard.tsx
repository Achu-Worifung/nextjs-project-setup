'use client';

interface VehicleCardProps {
  name: string;
  type: string;
  price: number;
  transmission: "Automat" | "Manual";
  photo?: string;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ name, type, price, transmission, photo }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col">
      {photo ? (
        <img src={photo} alt={name} className="h-32 object-cover rounded mb-4" />
      ) : (
        <div className="bg-gray-200 h-32 mb-4 rounded" />
      )}
      <h3 className="font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">{type}</p>
      <p className="text-purple-600 font-bold mt-2">
        ${price} <span className="text-sm font-normal text-gray-600">per day</span>
      </p>
      <div className="flex items-center gap-2 text-sm mt-2 text-gray-600">
        <span>{transmission}</span>
        <span>🅿️ PB 95</span>
        <span>❄️ Air Conditioner</span>
      </div>
      <button className="mt-auto bg-purple-600 text-white rounded py-2 mt-4">
        View Details
      </button>
    </div>
  );
};


export default VehicleCard;