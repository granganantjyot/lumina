"use client";

import { Line } from "react-konva";
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Circle } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import ImageFrameEditor from "./ImageFrameEditor";
import { Button } from "./ui/button";
import { ImagePlus, RotateCcw } from "lucide-react";


export interface ImageFrame { // contains all 4 corners of the extracted image
    tl: number[],
    tr: number[],
    br: number[],
    bl: number[]
}

interface PhotoCropComponentType {
    parentImage: File,
    imageFrames: ImageFrame[]
}




export default function PhotoCropComponent({ parentImage, imageFrames }: PhotoCropComponentType) {

    const [konvasImage, setKonvasImage] = useState<HTMLImageElement | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
    const [scaledFrames, setScaledFrames] = useState<ImageFrame[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);

    const hasRun = useRef<boolean>(false);


    // Handle initial image load
    useEffect(() => {
        if (hasRun.current) return; // Prevent double execution // TODO: remove ref check (put in place right now to prevent double useEffect execution)
        hasRun.current = true;

        console.log("useeffect")
        const url = URL.createObjectURL(parentImage);
        setImageUrl(url);


        const img = new window.Image();
        img.src = url;

        img.onload = () => {

            // Resize Konvas stage based on available space
            const maxWidth = containerRef.current?.offsetWidth || 900;
            const aspectRatio = img.height / img.width;

            const konvasStageWidth = maxWidth;
            const konvasStageHeight = maxWidth * aspectRatio;
            setStageSize({ width: konvasStageWidth, height: konvasStageHeight });
            setKonvasImage(img);


            // Scale by comparing the parent image width and height to the konvas stage width and height
            const parentImageWidth = img.width
            const parentImageHeight = img.height

            let xScale = konvasStageWidth / parentImageWidth;
            let yScale = konvasStageHeight / parentImageHeight;

            console.log("xscale: " + xScale)
            console.log("yscale: " + yScale)


            const updatedFrames: ImageFrame[] = []

            imageFrames.forEach((frame: ImageFrame) => {
                const tempFrame = frame;

                for (const corner of Object.keys(tempFrame) as (keyof ImageFrame)[]) {
                    tempFrame[corner] = [tempFrame[corner][0] * xScale, tempFrame[corner][1] * yScale]
                }

                console.log(tempFrame)
                updatedFrames.push(tempFrame)
            });

            setScaledFrames(updatedFrames);
        };


        // Cleanup

        return () => {
            URL.revokeObjectURL(imageUrl ?? "");
        };

    }, [parentImage])



    function handleAddFrame(){
        // Add a 100 x 100 frame in the middle. First compute the coordinates of the top-left (tl) corner
        const x = (stageSize.width - 100) / 2
        const y = (stageSize.height - 100) / 2

        const newFrame : ImageFrame = {
            tl: [x, y],
            tr: [x + 100, y],
            br: [x + 100, y + 100],
            bl: [x, y + 100]
        }

        const updatedFrames = [...scaledFrames, newFrame];
        setScaledFrames(updatedFrames);
    }

    function handleResetFrames(){
        setScaledFrames(imageFrames);
    }

    return (

        <div className="bg-slate-200 my-4 p-4 rounded-lg">
            <div ref={containerRef} className="w-1/2">

                <h2 className="text-lg font-semibold">{parentImage.name}</h2>
                <p>{scaledFrames.length} Frame(s) Identified</p>

                <div className="mt-2 flex gap-2">
                <Button className="" onClick={handleAddFrame}>
                    <ImagePlus />Add Frame
                </Button>

                <Button className="" onClick={handleResetFrames}>
                    <RotateCcw />Reset Frames
                </Button>
                </div>


                <Stage width={stageSize.width + 20} height={stageSize.height + 20} className="mt-5">
                    <Layer>
                        {konvasImage && <Image image={konvasImage} width={stageSize.width} height={stageSize.height} />}

                        {scaledFrames.map((frame, index) => {
                            return (
                                <ImageFrameEditor
                                    imageFrame={frame}
                                    index={index}
                                    key={index}
                                    onDrag={(corner: keyof ImageFrame, updatedCornerCoordinate: number[]) => {
                                        const updatedFrames = [...scaledFrames];
                                        updatedFrames[index] = { ...updatedFrames[index], [corner]: updatedCornerCoordinate } // Update correct frame using index
                                        setScaledFrames(updatedFrames)
                                    }}
                                    stageSize={stageSize} />
                            )

                        })}


                    </Layer>
                </Stage>

                




            </div>
        </div>



    )

}


