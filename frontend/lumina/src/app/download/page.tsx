"use client";
import useFrameStore from "@/store/frame-store";
import LoadingScreen from "@/components/loading-screen";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, DownloadIcon } from "lucide-react";
import Image from "next/image";
import useConfirmedImageStore from "@/store/confirmed-image-store";



export default function Download() {

    const router = useRouter();
    const sessionId = useFrameStore((state) => state.sessionId);
    const [isLoading, setIsLoading] = useState(true);

    const confirmedImages = useConfirmedImageStore((state) => state.confirmedImages)
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null)



    useEffect(() => {
        // If invalid session id, return to home page
        if (!sessionId) {
            router.push("/");
            return
        }


        // Get download file
        async function getDownloadFile() {
            const response = await fetch(`/api/confirm/${sessionId}`, {
                method: "POST",
                body: JSON.stringify({ finalImages: confirmedImages }),
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);

            // Trigger download
            triggerDownload(url)

            setIsLoading(false)

        }
        getDownloadFile()

    }, [])


    return (

        <div className=" font-[family-name:var(--font-geist-sans)]">

            <main className="flex flex-col mx-12 mt-12">


                {/* Title + Page Name */}
                <div>
                    <h2 className="font-medium text-xl text-main-teal">Lumina</h2>
                    <h1 className="text-4xl font-semibold text-start mt-2">Download</h1>
                    <p className="text-base">The easiest part</p>
                </div>

                <div className="flex align-middle justify-center mt-4">

                    {isLoading ? <LoadingScreen text="Almost There..." />
                        :
                        <div className=" w-full">

                            <div className="text-center space-y-6 flex flex-col items-center">

                                <Image src="/logo.svg" height={200} width={200} className="inline-block mt-5" alt="logo" priority />
                                <p className="font-medium text-3xl">
                                    Thank you for using Lumina!</p>

                                <p className="">Your download should begin automatically. If it doesn't, click below</p>

                                <Button className="bg-main-teal p-4 text-base" onClick={() => {
                                    downloadUrl && (triggerDownload(downloadUrl));
                                }}>
                                    Download <DownloadIcon />
                                </Button>


                                <Button className="p-4 text-base" onClick={() => {
                                    // Clear history, navigate to home page, try it out section
                                    window.location.replace("/#try-it-out")
                                }}>
                                    Start New Session <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    }
                </div>
            </main>
        </div>
    );


    function triggerDownload(url: string) {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `lumina_${sessionId}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}


