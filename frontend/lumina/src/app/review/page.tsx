"use client";
import useFrameStore from "@/store/frame-store";
import LoadingScreen from "@/components/loading-screen";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarCog, Check, RotateCw } from "lucide-react";

import { format } from "date-fns"

import DatePicker from "@/components/date-picker";

import useConfirmedImageStore from "@/store/confirmed-image-store";
import { ConfirmedImage } from "@/store/confirmed-image-store";
import { toast } from "@/hooks/use-toast";



interface ProcessedImage {
    angle: number,
    image: string,
    dimensions: number[],
    date: string,
    parentImageID: string
    imageID: string
}

export default function Review() {

    const router = useRouter();
    const sessionId = useFrameStore((state) => state.sessionId);
    const imageCount = useFrameStore((state) => state.imageCount);
    const parentImgToFrames = useFrameStore((state) => state.parentImgToFrames);

    const setImages = useConfirmedImageStore((state) => state.setConfirmedImages)

    const [isLoading, setIsLoading] = useState(true);

    const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([])

    useEffect(() => {

        // If invalid session id, return to home page
        if (!sessionId) {
            router.push("/");
            return;
        }

        // Backend query
        async function getProcessedImages() {
            try {
                const response = await fetch(`/api/process/${sessionId}`, {
                    method: "POST",
                    body: JSON.stringify({ parentImgToFrames }),
                });

                // Handle errors
                if (!response.ok) {
                    throw new Error(`An Error Occurred (Status ${response.status})`);
                }

                // Get json data
                const data = await response.json()

                setProcessedImages(data.images)
                setIsLoading(false)

            } catch (error) {
                console.log(error);
                toast({ title: "An Error Occurred. Please Try Again Later.", variant: "destructive", })
                router.push("/");
            }
        }

        getProcessedImages();


        // Add unload listener to warn user before leaving page
        const handleUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        }
        window.addEventListener('beforeunload', handleUnload)

        // Cleanup
        return () => {
            window.removeEventListener('beforeunload', handleUnload) // Remove unload listener
        }

    }, [])


    return (

        <div className=" font-[family-name:var(--font-geist-sans)]">

            <main className="flex flex-col mx-12 mt-12">


                {/* Title + Page Name */}
                <div>
                    <h2 className="font-medium text-xl text-main-red">Lumina</h2>
                    <h1 className="text-4xl font-semibold text-start mt-2">Review</h1>
                    <p className="text-base">Adjust rotation and metadata</p>
                </div>

                <div className="flex align-middle justify-center mt-4">

                    {isLoading ? <LoadingScreen text="Generating..." secondary="This can take a few minutes" />
                        :
                        <div className=" w-full">


                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-sm">
                                        {imageCount} {imageCount === 1 ? "Image" : "Images"} Processed</p>

                                    <p className="font-semibold">{processedImages.length} {processedImages.length == 1 ? "Frame" : "Frames"} Generated</p>
                                </div>

                                <Button className="bg-main-red p-4 text-base" onClick={() => {
                                    const images: ConfirmedImage[] = []

                                    processedImages.forEach((image) => {
                                        images.push({ imageID: image.imageID, angle: image.angle, date: image.date, parentImageID: image.parentImageID })
                                    })


                                    setImages(processedImages)
                                    router.push("/download")

                                }}>
                                    Looks Good <Check />
                                </Button>

                            </div>




                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-4">
                                {processedImages.map(({ image, angle, dimensions, date }, index) => {

                                    return (
                                        <div className="bg-slate-200 p-4 rounded-lg w-full" key={index}>


                                            <div className=" flex flex-row items-center">

                                                <div className="h-60 w-60 overflow-hidden flex items-center justify-center">
                                                    <img
                                                        src={image}
                                                        className="max-h-full max-w-full object-contain transition-transform duration-200"
                                                        style={{ transform: `rotate(${angle}deg)` }}
                                                    />
                                                </div>





                                                <div className="ml-7 space-y-3">

                                                    <div>
                                                        <p className="text-sm font-medium">Rotated</p>
                                                        <p className="">{(`${angle}°`)}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-medium">Upscaled To</p>
                                                        <p className="">{(`${dimensions[1]} x ${dimensions[0]}`)}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-medium">Metadata Date</p>
                                                        <p className="">{date}</p>
                                                    </div>

                                                </div>


                                            </div>

                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <Button className="" onClick={() => {
                                                    const copy = [...processedImages];
                                                    const updated = { ...copy[index], angle: (angle === 270 ? 0 : (angle + 90)) }
                                                    copy[index] = updated;
                                                    setProcessedImages(copy)

                                                }}>
                                                    <RotateCw />Rotate
                                                </Button>


                                                <DatePicker
                                                    triggerChild={
                                                        <Button className="">
                                                            <CalendarCog />Edit Date
                                                        </Button>
                                                    }
                                                    onDateSelect={
                                                        (selected) => {


                                                            // Update date of image
                                                            const copy = [...processedImages];
                                                            const updated = { ...copy[index], date: format(selected, "yyyy-MM-dd") }


                                                            copy[index] = updated;
                                                            setProcessedImages(copy)

                                                        }} />

                                            </div>

                                        </div>



                                    )

                                })}
                            </div>


                        </div>


                    }

                </div>

            </main>


        </div>
    );

}


