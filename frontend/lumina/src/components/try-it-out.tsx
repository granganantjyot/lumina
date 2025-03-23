"use client";
import UploadComponent from "@/components/uploader";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image";
import { ImagePlay, Rocket, ShieldCheck } from "lucide-react"
import { useState } from "react";
import { toast } from "@/hooks/use-toast"
import useFrameStore from "@/store/frame-store";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import StartDemoComponent from "./start-demo";



const bestResultsTips = ["Place photos on a plain, light-colored surface",
    "Spread out photos (do not overlap or obstruct)", "Position camera directly above photos",
    "Ensure even, natural lighting conditions", "Capture 2-4 photos in one batch"]


export default function TryItOutComponent() {

    const router = useRouter();

    const [files, setFiles] = useState<File[]>([]);

    const { setImageCount, setImageFiles, setSessionId, clearFrameStore } = useFrameStore();

    function handleStartClick() {

        // If no files have been uploaded, show a toast error
        if (files.length === 0) {
            toast({ title: "No File(s) Uploaded", variant: "destructive", })
        }

        // Else store files in image store
        else {
            // Clear the frame store before beginning a new session 
            clearFrameStore();

            // Set new data in frame store
            setImageCount(files.length);
            setImageFiles(files);
            setSessionId(uuidv4());

            router.push("/crop")
        }
    }

    return (
        <div className="ml-10 mr-10 p-8 py-16">
            <h2 className="text-4xl font-semibold  text-white">Try It Out</h2>
            <p className="text-lg w-full text-white  drop-shadow-lg">Upload an image and see the magic</p>




            <div className="flex flex-col lg:flex-row mt-5 gap-10 w-full">

                <div className="sm:w-full lg:w-1/2 flex flex-col">
                    <UploadComponent onFileUpload={(files: File[]) => {

                        files.forEach((file) => {
                            console.log(file.name, file.size)
                        })

                        setFiles(files);

                    }} />



                    <div className="flex flex-wrap gap-2 mt-2 items-center">
                        <Button onClick={handleStartClick} className={`${files?.length > 0 ? "bg-emerald-700" : ""}`}>
                            <ImagePlay />Start
                        </Button>

                        {files?.length === 0 &&
                            <StartDemoComponent
                                trigger={
                                    <Button>
                                        <Rocket />Try Demo
                                    </Button>} />

                        }


                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <ShieldCheck className="text-white cursor-pointer" />
                                </TooltipTrigger>

                                <TooltipContent side="right" className="bg-white">
                                    <p className="text-black font-medium">Uploaded files are not retained.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>



                    </div>



                </div>


                <div className="flex flex-1 flex-col ">
                    <h3 className="text-2xl font-semibold text-white">For Best Results:</h3>
                    <ul className="space-y-1 mt-1">

                        {bestResultsTips.map((tip, index) => (

                            <li className="flex items-center" key={index}>

                                <Image src={"/check.svg"} height={20} width={20} alt="check" className="text-white mr-1"></Image>

                                <div>
                                    <p className="font-medium text-base text-white">{tip}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>





        </div>
    )

}