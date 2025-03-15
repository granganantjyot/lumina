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
        "color": "#4cacaf",
        "icon" :  <Images size={iconSize}/>
    },
    { 
        "name": "Auto Image Enhancing", 
        "description": "Extracted photos are enhanced for improved quality and clarity", 
        "color": "#e96443",
        "icon" :  <Sparkles size={iconSize}/>
    },
    { 
        "name": "AI Upscaling", 
        "description": "Upscale photos by 2x for higher resolution using deep learning", 
        "color": "#c94b4b",
        "icon" :  <ImageUpscale size={iconSize}/>
    },
    { 
        "name": "Metadata Integration", 
        "description": "Keep your photos chronologically organized with editable metadata", 
        "color": "#31454e",
        "icon" :  <FolderCog size={iconSize}/>
    },

]

export default function FeaturesComponent({ className }: FeaturesComponentProps) {
    return (
        <div className={clsx("grid lg:grid-cols-4 md:grid-cols-2 gap-6 w-full justify-center", className)}>


            {features.map((f, index) => (
                <Card key={index} className="flex-1 min-w-[200px] max-w-[1/5] shadow-lg">


                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center ">
                        <div className="mb-5" style={{color: f.color}}>
                            {f.icon}
                        </div>
                        <p className="text-2xl font-semibold" style={{ color: f.color }}>{f.name}</p>
                        <p className="mt-1">{f.description}</p>
                    </CardContent>
                </Card>
            ))}


        </div>
    )
}
