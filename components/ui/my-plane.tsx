import Image from "next/image";

export function MyPlane() {
  return (
    <div className="w-full relative min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px]">
      {/* Background Blob */}
      <Image
        src="/airplaneblob.svg"
        alt="Airplane background"
        width={300}
        height={300}
        className="absolute top-1/2 left-1/2 w-[40%] sm:w-[35%] md:w-[30%] lg:w-[25%] xl:w-[20%] max-w-[300px] -translate-x-1/2 -translate-y-1/2 opacity-80"
      />

      {/* Plane Image */}
      <Image
        src="/plane.svg"
        alt="Plane"
        width={200}
        height={200}
        priority
        className="absolute top-1/2 left-1/2 w-[25%] sm:w-[22%] md:w-[18%] lg:w-[16%] xl:w-[12%] max-w-[240px] -translate-x-1/2 -translate-y-1/2 z-10"
      />
    </div>
  );
}
