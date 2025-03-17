import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, Download, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import StartDemoComponent from "./start-demo";

const steps = [
    {
        title: "Upload Files",
        description: "Upload image files containing multiple physical prints.",
        icon: <Upload size={24} className="text-main-teal" />,
        image: "upload.png",
    },
    {
        title: "Confirm Frames",
        description: "Adjust and confirm detected photos with live previews.",
        icon: <ImageIcon size={24} className="text-main-orange" />,
        image: "crop.png",
    },
    {
        title: "Download",
        description: "Review metadata and download your processed photos.",
        icon: <Download size={24} className="text-main-red" />,
        image: "review.png",
    },
];

export default function HowItWorks() {
    return (
        <>

            <div className=" mx-auto text-center">
                <p className="text-gray-600 mb-5">
                    Digitize your memories in just three simple steps, completely free.
                </p>
            </div>


            <div className="mx-auto grid sm:grid-cols-1 lg:grid-cols-3 place-items-center justify-center bg-gray-200 bg-opacity-75 p-10 rounded-lg shadow-md gap-4">
                {steps.map((step, index) => (

                    <div key={index} className="flex items-center flex-wrap">
                        <Card className="w-80 p-8 shadow-md rounded-lg bg-gray-50 text-center flex flex-col items-center mx-2">
                            <div className="mb-2">{step.icon}</div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-1">{step.title}</h3>
                            <p className="text-base text-gray-600 mb-2">{step.description}</p>
                            <img
                                src={step.image}
                                alt={step.title}
                                className="w-full rounded-md mt-2"
                            />
                        </Card>

                    </div>
                ))}
            </div>

            <StartDemoComponent
                trigger={
                    <div className="flex justify-center mt-10">
                        <Button className="px-6 py-3 text-lg font-semibold bg-gradient-to-r from-main-teal to-main-orange text-white rounded-lg shadow-lg transition-all ease-in-out transform hover:scale-105 hover:shadow-xl animate-pulse hover:animate-none"
                        >
                            Try With Sample
                            <ChevronRight className="ml-2 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                        </Button>
                    </div>
                }
            />
        </>
    );

}
