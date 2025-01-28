"use client";
import UploadComponent from "@/components/uploader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlay, Cog, Flame, Loader2 } from "lucide-react"
import { useState } from "react";
import { toast } from "@/hooks/use-toast"
import useStore from "@/store/image-store";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';



const bestResultsTips = ["Place photos on a plain, neutral-colored surface",
    "Lay photos completely flat and do not overlap or obstruct", "Position camera directly above photos",
    "Ensure even, natural lighting conditions", "Capture 2-4 photos in one batch for higher quality output"]


export default function TryItOutComponent() {

    const router = useRouter();

    const [files, setFiles] = useState<File[]>([]);

    const {setImageCount, setImageFiles, setSessionId} = useStore();

    function handleStartClick() {

        // If no files have been uploaded, show a toast error
        if (files.length === 0) {
            toast({ title: "No File(s) Uploaded", variant: "destructive", })
        }

        // Else store files in image store
        else {
            toast({ title: "Uploading", action: <Button><Loader2 className="animate-spin">Loading</Loader2></Button>});

            setImageCount(files.length);
            setImageFiles(files);
            setSessionId(uuidv4());
            
            router.push("/extraction")
        }
    }

    return (
        <div className="ml-10 mr-10 p-8 pt-16">
            <h2 className="text-4xl font-semibold  text-white">Try It Out</h2>
            <p className="text-lg w-full text-white  drop-shadow-lg">Upload an image and see the magic</p>

            <div className="flex flex-row mt-5 gap-10 flex-grow justify-between w-full">
                <UploadComponent onFileUpload={(files: File[]) => {

                    files.forEach((file) => {
                        console.log(file.name, file.size)
                    })

                    setFiles(files);

                }} />

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

            <div className="flex flex-row gap-2 mt-2 ">
                <Button onClick={handleStartClick} className={`${files?.length > 0 ? "bg-emerald-700" : ""}`}>
                    <ImagePlay />Start
                </Button>

                <Button className="">
                    <Flame />Blaze
                </Button>

                <Button >
                    <Cog />Options
                </Button>

            </div>

        </div>
    )

}