import FeaturesComponent from "@/components/features";
import { MeshGradient } from "@blur-ui/mesh-gradient";
import TryItOutComponent from "@/components/try-it-out";
import NavBar from "@/components/navbar";
import HowItWorks from "@/components/how-it-works";
import Image from "next/image";




export default function Home() {
  return (
    <div className=" font-[family-name:var(--font-geist-sans)]">
      <NavBar></NavBar>

      <main className="flex flex-col row-start-2 items-center sm:items-start">

        {/* Gradient and landing */}
        <div className="relative w-full h-screen flex items-center justify-center bg-[#c94b4b]">
          <MeshGradient className="absolute top-0 left-0 w-full h-full z-0" theme="twilight"></MeshGradient>
          <div className="z-10 flex flex-col">
            <h1 className="text-5xl font-bold w-full text-center text-white drop-shadow-lg px-10 pt-20">Revive, Relive, Restore</h1>
            <p className="text-lg w-full text-white text-center drop-shadow-lg mt-5 px-16">Digitize physical photographs and prints in a matter of seconds with Lumina</p>

          </div>
        </div>

        {/* Features */}
        <section id="features" className="mt-10 scroll-mt-20">

          <div
            className="relative w-screen bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: "url('/wave.svg')" }}>

            <div className="w-full flex flex-col items-center p-8">
              <h2 className="text-4xl font-semibold text-center">Features</h2>
              <FeaturesComponent className="mt-5 px-10 " />
            </div>

          </div>
        </section>


        {/* Try It Out */}
        <section id="try-it-out" className="-mt-0.5 scroll-mt-12">
          <div
            className="relative w-screen bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: "url('/bg-wave.svg')" }}>


            <TryItOutComponent />
          </div>
        </section>


        {/* How It Works */}
        <section id="how-it-works" className="mt-10 scroll-mt-20">

          <div
            className="relative w-screen bg-white"
          >

            <div className="w-full flex flex-col items-center p-8 mb-5">
              <h2 className="text-4xl font-semibold text-center text-black">How It Works</h2>
              <HowItWorks />
            </div>

          </div>
        </section>
      </main>



      <footer className="w-full bg-[#31454e] text-white py-4 text-center text-sm">
        <p className="flex items-center justify-center gap-2">
          <Image src={"/logo.svg"} alt="Logo" width={20} height={20} />
          <strong>Lumina</strong> | Helping you relive your memories | Made with ❤️
        </p>
      </footer>


    </div>
  );
}
