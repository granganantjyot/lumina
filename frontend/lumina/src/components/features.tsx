import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"


const features = [
    { "name": "Multi-Photo Extraction", "description": "Quickly extract multiple photos from a single scan or snapshot", "color": "#4cacaf" },
    { "name": "Auto Image Enhancing",   "description": "Extracted photos are enhanced for improved quality and clarity", "color": "#e96443"},
    { "name": "Timestamp Detection",    "description": "Detect and preserve original timestamps from your photos",       "color": "#c94b4b"},
    { "name": "Metadata Integration",   "description": "Keep your photos chronologically organized with EXIF metadata",  "color": "#31454e" },

]

export default function FeaturesComponent() {
    return (
        <div className="flex flex-wrap gap-6 w-full px-10 justify-center mt-5">
            {features.map((f, index) => (
                <Card key={index} className="flex-1 min-w-[200px] max-w-[1/5] shadow-lg">
                    
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center ">
                        <img src={"/file.svg"} className="aspect-square w-10 mb-5" alt="React Logo" />

                        <p className="text-2xl font-semibold" style={{color : f.color}}>{f.name}</p>
                        <p className="mt-1">{f.description}</p>
                    </CardContent>
                </Card>
            ))}


        </div>
    )
}
