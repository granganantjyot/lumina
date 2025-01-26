import FeaturesComponent from "@/components/features";
import UploadComponent from "@/components/uploader";
import { MeshGradient } from "@blur-ui/mesh-gradient";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" font-[family-name:var(--font-geist-sans)]">

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
        <section id="features" className="mt-10">

          <div
            className="relative w-screen bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: "url('/wave.svg')" }}>

            <div className="w-full flex flex-col items-center p-8">
              <h2 className="text-4xl font-semibold text-center">Features</h2>
              <FeaturesComponent />
            </div>

          </div>
        </section>








        {/* Try It Out */}

        <section id="try-it-out" className="-mt-0.5">

          <div
            className="relative w-screen bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: "url('/untitled2.svg')" }}>

            <div className="w-full flex flex-col items-end p-8 pt-16">
              <h2 className="text-4xl font-semibold text-right text-white mr-10">Try It Out</h2>
              <p className="text-lg w-full text-white text-right drop-shadow-lg mr-10">Upload an image and see the magic</p>

              <UploadComponent/>

              


              {/* {Array.from({ length: 1 }, (_, index) => index + 1).map((num) => (
                <Card key={num} className="flex-1 w-1/2 h-1/5 shadow-lg">
                  <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center ">
                        <img src={"/file.svg"} className="aspect-square w-10 mb-5" alt="React Logo" />

                        
                    </CardContent>
                </Card>
              ))} */}
            </div>

          </div>



        </section>




        <section>
          <h2 className="text-2xl font-semibold text-right text-black mr-10">For Best Results</h2>

        </section>











      </main>


      {/* FOOTER BEGINS HERE */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-cente mt-10">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
