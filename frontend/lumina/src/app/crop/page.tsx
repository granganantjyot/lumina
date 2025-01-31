"use client";
import useStore from "@/store/image-store";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import PhotoCropComponent from "@/components/photo-crop";
import { ImageFrame } from "@/components/photo-crop";


interface ExtractedImage {
    parentImg: string,
    imageFrames: ImageFrame[]
}

export default function Crop() {

    const router = useRouter();
    const { imageCount, imageFiles, sessionId } = useStore();

    const [loading, setLoading] = useState<boolean>(true);

    const [extractedImages, setExtractedImages] = useState<ExtractedImage[]>();

    const hasRun = useRef<boolean>(false);


    useEffect(() => {
        // If invalid session ID, redirect to home page
        if (sessionId == null) {
            router.push("/");
        }
        else {
            async function extractImageCrops() {
                try {
                    console.log("making request...")
                    const formData = new FormData();
                    imageFiles.forEach((file) => { formData.append("files", file) })
                    formData.append("session_id", sessionId ?? "")

                    const response = await axios.post("http://127.0.0.1:8000/api/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
                    console.log(response.data)
                    setExtractedImages(response.data.processedResult);
                    setLoading(false);

                } catch (error) {
                    console.log(error);
                    router.push("/");
                }

            }

            // TODO: REMOVE THE IF- FOR PRODUCTION. BECAUSE OF REACTSTRICTMODE, USEEFFECT IS EXECUTED TWICE, BUT WE CAN DO USEREF TO KEEP TRACK IF ITS ALREADY BEEN EXECUTED
            if (!hasRun.current) {
                hasRun.current = true;
                extractImageCrops();
            }
        }
    }, [])

    return (


        <div className=" font-[family-name:var(--font-geist-sans)]">

            <main className="flex flex-col mx-12 mt-12">


                {/* Title + Page Name */}
                <div className="">
                    <h2 className="font-medium text-xl text-[#4cacaf]">Lumina</h2>
                    <h1 className="text-4xl font-semibold text-start mt-2">Image Cropping</h1>
                    <p className="text-base">Adjust corners of each detected image</p>
                </div>

                <div className="flex align-middle justify-center mt-4">
                    {loading ?

                        <div className="">
                            <div className="flex items-center space-x-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-40 w-40 rounded-3xl bg-[#e96443]" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-44 w-44 rounded-3xl bg-[#4cacaf]" />
                                    <Skeleton className="h-48 w-48 rounded-3xl bg-[#c94b4b]" />
                                </div>
                            </div>
                            <p className="mt-12 font-medium text-2xl text-center text-black">Cropping...</p>
                        </div>

                        :

                        <div className="w-full">

                            {extractedImages?.map((image, index) => {
                                return <PhotoCropComponent parentImage={imageFiles[index]} imageFrames={image.imageFrames} key={index}/>
                            })}

                            
                            
                        </div>
                        


                        
                    }

                </div>


























            </main>


        </div>
    );
}


