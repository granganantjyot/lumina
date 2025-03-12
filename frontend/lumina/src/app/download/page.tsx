"use client";
import useFrameStore from "@/store/frame-store";
import LoadingScreen from "@/components/loading-screen";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import Image from "next/image";

import useConfirmedImageStore from "@/store/confirmed-image-store";








export default function Download() {

    const router = useRouter();
    const sessionId = useFrameStore((state) => state.sessionId);
    const [isLoading, setIsLoading] = useState(true);

    const confirmedImages = useConfirmedImageStore((state) => state.confirmedImages)

    const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

    const [analytics, setAnalytics] = useState<number[]>([])




    useEffect(() => {
        // If invalid session id, return to home page
        if (!sessionId) {
            router.push("/");
            return
        }


        async function getDownloadLink() {
            const response = await fetch(`/api/confirm/${sessionId}`, {
                method: "POST",
                body: JSON.stringify({ finalImages: confirmedImages }),
            });
            const data = await response.json()
            


            setDownloadUrl(data.download);
            setAnalytics(data.analytics)

            setIsLoading(false)
            window.location.href = data.download
        }
        getDownloadLink()

    }, [])


    return (

        <div className=" font-[family-name:var(--font-geist-sans)]">

            <main className="flex flex-col mx-12 mt-12">


                {/* Title + Page Name */}
                <div>
                    <h2 className="font-medium text-xl text-[#4cacaf]">Lumina</h2>
                    <h1 className="text-4xl font-semibold text-start mt-2">Download</h1>
                    <p className="text-base">The final step...</p>
                </div>

                <div className="flex align-middle justify-center mt-4">

                    {isLoading ? <LoadingScreen text="Almost There..." />
                        :
                        <div className=" w-full">

                            <div className="text-center space-y-6">

                                <Image src="/logo.svg" height={200} width={200} className="inline-block mt-5" alt="logo" priority />
                                <p className="font-medium text-3xl">
                                    Thank you for using Lumina!</p>

                                <p className="">Your download should begin automatically. If it doesn't, click below</p>

                                <Button className="bg-[#4cacaf] p-4 text-base" onClick={() => {
                                    downloadUrl && (window.location.href = downloadUrl);
                                }}>
                                    Download <DownloadIcon />
                                </Button>

                                {/* 0 contains total images processed before, and 1 contains number of images processed in current session */}
                                <p className="font-medium text-xl">{analytics[0]} <span className="text-[#4cacaf] font-semibold"> +{analytics[1]} </span> Images Processed, And Counting...</p>
                            </div>
                        </div>
                    }
                </div>
            </main>
        </div>
    );
}


