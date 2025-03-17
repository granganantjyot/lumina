import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import clsx from "clsx";
import { FolderCog, Images, ImageUpscale, Sparkles } from "lucide-react";


interface FeaturesComponentProps {
    className?: string;
}


const iconSize = 48
const features = [
    { 
        "name": "Multi-Photo Extraction", 
        "description": "Quickly extract multiple photos from a single scan or snapshot", 
        "color": "main-teal",
        "icon" :  <Images size={iconSize}/>
    },
    { 
        "name": "Auto Image Enhancing", 
        "description": "Extracted photos are enhanced for improved quality and clarity", 
        "color": "main-orange",
        "icon" :  <Sparkles size={iconSize}/>
    },
    { 
        "name": "AI Upscaling", 
        "description": "Upscale photos by 2x for higher resolution using deep learning", 
        "color": "main-red",
        "icon" :  <ImageUpscale size={iconSize}/>
    },
    { 
        "name": "Metadata Integration", 
        "description": "Keep your photos chronologically organized with editable metadata", 
        "color": "main-dark",
        "icon" :  <FolderCog size={iconSize}/>
    },

]

export default function FeaturesComponent({ className }: FeaturesComponentProps) {
    return (
        <div className={clsx(
            "grid lg:grid-cols-4 md:grid-cols-2 gap-6 w-full justify-center auto-rows-fr place-items-stretch",
            className
        )}>
            {features.map((f, index) => (
                <Card key={index} className="flex flex-col flex-1 min-w-[200px] lg:min-h-[300px] shadow-lg">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                        <div className={`mb-5 text-${f.color}`}>
                            {f.icon}
                        </div>
                        <p className={`text-2xl font-semibold text-${f.color}`}>{f.name}</p>
                        <p className="mt-1">{f.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

