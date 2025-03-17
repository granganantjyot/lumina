"use client";
import useFrameStore from "@/store/frame-store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PhotoCropComponent from "@/components/photo-crop";
import { ImageFrame } from "@/components/photo-crop";
import { Check } from "lucide-react";
import { usePreviewStore } from "@/store/preview-store";
import { toast } from "@/hooks/use-toast";
import LoadingScreen from "@/components/loading-screen";

// Refers to the set of images (cropped photos) that have been detected from a given parent image
interface DetectedImageSet {
    parentImgID: string,
    imageFrames: ImageFrame[]
}

export default function Crop() {

    const router = useRouter();
    const { imageFiles, sessionId, parentImgToFrames, setParentImgToFrames, getTotalFramesCount } = useFrameStore();

    const [loading, setLoading] = useState<boolean>(true);

    const [detectedImageSets, setDetectedImageSets] = useState<DetectedImageSet[]>();



    const connectSocket = usePreviewStore((state) => state.connect)
    const disconnectSocket = usePreviewStore((state) => state.disconnect)


    useEffect(() => {
        // If invalid session ID, redirect to home page
        if (sessionId == null) {
            router.push("/");
        }

        // Else if existing frames, repopulate state (the user has returned from another page)
        else if (parentImgToFrames) {

            const reuse = []

            for (const [parentImageID, imageFrames] of Object.entries(parentImgToFrames)) {
                reuse.push({ parentImgID: parentImageID, imageFrames: imageFrames })
            }

            connectSocket() // Reconnect to websocket
            setDetectedImageSets(reuse)
            setLoading(false);
        }

        // Else brand new session, initialize
        else {
            async function extractImageCrops() {
                try {
                    const formData = new FormData();
                    imageFiles.forEach((file) => { formData.append("files", file) })


                    const response = await fetch(`/api/upload/${sessionId}`, {
                        method: "POST",
                        body: formData,
                    });
                    const data = await response.json()


                    populateImageStore(data.processedResult);
                    setDetectedImageSets(data.processedResult);
                    setLoading(false);

                } catch (error) {
                    console.log(error);
                    toast({ title: "An Error Occurred", variant: "destructive", })
                    router.push("/");
                }

            }

            extractImageCrops();

            // Connect to websocket
            connectSocket()
        }


        // Add unload listener to warn user before leaving page
        const handleUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        }
        window.addEventListener('beforeunload', handleUnload)
        

        // Cleanup
        return () => {
            disconnectSocket(); // Disconnect for clean up
            window.removeEventListener('beforeunload', handleUnload) // Remove unload listener
        }
    }, [])

    return (


        <div className=" font-[family-name:var(--font-geist-sans)]">

            <main className="flex flex-col mx-12 mt-12">


                {/* Title + Page Name */}
                <div>
                    <h2 className="font-medium text-xl text-main-teal">Lumina</h2>
                    <h1 className="text-4xl font-semibold text-start mt-2">Image Cropping</h1>
                    <p className="text-base">Adjust corners of each detected image</p>
                </div>

                <div className="flex align-middle justify-center mt-4">
                    {loading ?

                        <LoadingScreen text="Loading..." />

                        :

                        <div className="w-full">

                            <div className="flex justify-between items-center">
                                <p className="font-semibold">{detectedImageSets?.length} {detectedImageSets?.length === 1 ? "File" : "Files"} Uploaded</p>

                                <Button className="bg-main-teal p-4 text-base" onClick={handleConfirmation}>
                                    Looks Good <Check />
                                </Button>

                            </div>

                            {detectedImageSets?.map((image, index) => {
                                return <PhotoCropComponent parentImageFile={imageFiles[index]} parentImageID={image.parentImgID} imageFrames={image.imageFrames} key={index} />
                            })}



                        </div>

                    }

                </div>

            </main>


        </div>
    );

    // Takes the API response and populates the Zustand Image Store using it
    function populateImageStore(imageSets: DetectedImageSet[]) {

        const parentImgToFrames: { [parentImgID: string]: ImageFrame[] } = {}



        // Ensure that the Image Store holds independent objects instead of referencing imageSets
        // Create deep copy of every imageFrames to prevent unintended mutations
        imageSets.forEach((imageSet: DetectedImageSet) => {
            parentImgToFrames[imageSet.parentImgID] = imageSet.imageFrames.map((frame) => ({
                tl: [...frame.tl],
                tr: [...frame.tr],
                br: [...frame.br],
                bl: [...frame.bl],
            }));
        });

        setParentImgToFrames(parentImgToFrames);
    }

    function handleConfirmation() {

        if (getTotalFramesCount() > 0){
            router.push("/review")
        }
        else{
            toast({ title: "Add At Least 1 Frame", variant: "destructive" })
        }
        
    }
}


