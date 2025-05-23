"use client";

import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Rect, Group, Circle } from "react-konva";
import ImageFrameEditor from "./image-frame-editor";
import { Button } from "./ui/button";
import { ImagePlus, RotateCcw, X } from "lucide-react";
import useFrameStore from "@/store/frame-store";
import { usePreviewStore } from "@/store/preview-store";
import { useShallow } from 'zustand/react/shallow'
import LoadingSpinner from "./loading-spinner";
import { toast } from "@/hooks/use-toast";
import Konva from "konva";


export interface ImageFrame { // contains all 4 corners of the extracted image
    tl: number[],
    tr: number[],
    br: number[],
    bl: number[]
}

interface PhotoCropComponentType {
    parentImageFile: File,
    parentImageID: string,
    imageFrames: ImageFrame[],
}




export default function PhotoCropComponent({ parentImageFile, parentImageID, imageFrames }: PhotoCropComponentType) {

    const stageRef = useRef<Konva.Stage>(null)

    const [konvasImage, setKonvasImage] = useState<HTMLImageElement | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
    const [stageScale, setStageScale] = useState({ xScale: 1, yScale: 1 });
    const [scaledFrames, setScaledFrames] = useState<ImageFrame[]>([]); // Store the frame states for all images


    const containerRef = useRef<HTMLDivElement>(null);
    const [expectedPreviewsCount, setExpectedPreviewsCount] = useState<number>(0);
    const [isPreviewLoading, setIsPreviewsLoading] = useState(false);


    // Frame store
    const updateImageFrame = useFrameStore(useShallow((state) => state.updateImageFrame)); // To update image frames state in Zustand store
    const addImageFrame = useFrameStore((state) => state.addImageFrame);
    const deleteImageFrame = useFrameStore((state) => state.deleteImageFrame);

    // Preview store
    const [storedPreviewImages, setStoredPreviewImages] = useState<string[]>([]); // Store the base64 image for all previews
    const requestPreviewUpdate = usePreviewStore((state) => state.requestPreviewUpdate) // Request update for preview image via websocket
    const resetPreviews = usePreviewStore((state) => state.resetPreviews)
    const deletePreview = usePreviewStore((state) => state.deletePreview)


    // Magnification helper
    const [magnifierImage, setMagnifierImage] = useState<HTMLImageElement | null>(null);
    const [magnifierPos, setMagnifierPos] = useState<[number, number] | null>(null);
    const magnifierSize = 100;
    const magnification = 2;


    // Handle initial canvas load
    useEffect(() => {

        const url = URL.createObjectURL(parentImageFile);
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
            console.log("height: " + konvasStageHeight)
            console.log("width: " + konvasStageWidth)
            setKonvasImage(img);


            // Scale by comparing the parent image width and height to the konvas stage width and height
            const parentImageWidth = img.width
            const parentImageHeight = img.height

            const xScale = konvasStageWidth / parentImageWidth;
            const yScale = konvasStageHeight / parentImageHeight;
            setStageScale({ xScale: xScale, yScale: yScale }); // Set local state stage scale





            const updatedFrames: ImageFrame[] = []

            console.log("INITIAL IMAGEFRAMES")
            console.log(imageFrames);

            // This will modify imageFrames as well, to store the original scaled frames (this will be useful when resetting the frames since the values from imageFrames can be reused)
            imageFrames.forEach((frame: ImageFrame) => {
                const tempFrame = { ...frame };

                for (const corner of Object.keys(tempFrame) as (keyof ImageFrame)[]) {
                    tempFrame[corner] = [tempFrame[corner][0] * xScale, tempFrame[corner][1] * yScale]
                }

                updatedFrames.push(tempFrame)
            });

            setScaledFrames(updatedFrames);
            setExpectedPreviewsCount(updatedFrames.length);
        };


        // Cleanup
        return () => {
            URL.revokeObjectURL(imageUrl ?? "");
        };

    }, [parentImageFile])



    // Retrieve initial previews
    useEffect(() => {
        const initialFrames = [...scaledFrames]

        for (let i = 0; i < initialFrames.length; i++) {
            const frame = initialFrames.at(i);
            if (frame) {
                requestPreviewUpdate(parentImageID, i, frame, stageScale);
            }
        }



    }, [scaledFrames.length])


    // Subscribe to preview changes
    useEffect(() => {
        const unsubscribe = usePreviewStore.subscribe(
            (state) => state.activePreviews[parentImageID],
            (newImages) => {
                setStoredPreviewImages(newImages);
                setIsPreviewsLoading(false); // When a preview loads in, stop loading
            }
        )
        return unsubscribe;
    }, [])

    function handleAddFrame() {
        // Only allow maximum 4 frames per image
        if (scaledFrames.length === 4) {
            toast({ title: "Maximum 4 Frames Per Image File", variant: "destructive", })
            return;
        }

        // Add a 100 x 100 frame in the middle. First compute the coordinates of the top-left (tl) corner
        const x = (stageSize.width - 100) / 2
        const y = (stageSize.height - 100) / 2

        const newFrame: ImageFrame = {
            tl: [x, y],
            tr: [x + 100, y],
            br: [x + 100, y + 100],
            bl: [x, y + 100]
        }

        const updatedFrames = [...scaledFrames, newFrame];
        setScaledFrames(updatedFrames);

        // Update store with new coordinates
        addImageFrame(parentImageID, newFrame, stageScale)

        setExpectedPreviewsCount((current) => current + 1)
    }

    function handleRemoveFrame(index: number) {

        const updatedFrames = [...scaledFrames];
        updatedFrames.splice(index, 1);
        setScaledFrames(updatedFrames)


        // Update store
        deleteImageFrame(parentImageID, index);

        // previews
        deletePreview(parentImageID, index)


        // Update expectedPreviewsCount
        if (updatedFrames.length === 0) {
            // If no more frames left, immediately set to 0
            setExpectedPreviewsCount(0);
        }
        else {
            // Else subscribe to changes in preview store, and update expectedPreviewsCount only after store is updated (to avoid race condition)
            const unsubscribe = usePreviewStore.subscribe(() => {
                setExpectedPreviewsCount((current) => current - 1) // Decrement
                unsubscribe();
            });
        }
    }

    function handleResetFrames() {

        // Update expected count of previews
        setExpectedPreviewsCount(imageFrames.length) // Set it to length of the original imageFrames array

        // Update frame store
        useFrameStore.setState((state) => (
            { parentImgToFrames: { ...state.parentImgToFrames, [parentImageID]: imageFrames } } // Pass in full-size (original resolution) imageFrames
        ))


        // Rescale a copy imageFrames, to fit onto the stage
        const originalFrames = []

        for (const frame of imageFrames) {

            const rescaledFrame: ImageFrame = {
                tl: [...frame.tl],
                tr: [...frame.tr],
                br: [...frame.br],
                bl: [...frame.bl]
            };

            Object.keys(rescaledFrame).forEach((key) => {
                const [x, y] = rescaledFrame[key as keyof ImageFrame];
                rescaledFrame[key as keyof ImageFrame] = [x * stageScale.xScale, y * stageScale.yScale]
            })

            originalFrames.push(rescaledFrame);
        }

        // Update local state, to display reset frames
        setScaledFrames(originalFrames);

        // Create deep copy
        const resetFrames = originalFrames.map(frame => ({
            tl: [...frame.tl],
            tr: [...frame.tr],
            br: [...frame.br],
            bl: [...frame.bl],
        }));

        // Update previews
        resetPreviews(parentImageID, stageScale, resetFrames);
    }

    return (

        <div className="bg-slate-200 my-4 p-4 rounded-lg flex flex-col lg:flex-row min-w-fit">
            <div ref={containerRef} className="flex-1">

                <h2 className="text-lg font-semibold">{parentImageFile.name}</h2>
                <p>{scaledFrames.length} {scaledFrames.length === 1 ? "Frame" : "Frames"}</p>

                <div className="mt-2 flex gap-2">
                    <Button className="" onClick={handleAddFrame}>
                        <ImagePlus />Add Frame
                    </Button>

                    <Button className="" onClick={handleResetFrames}>
                        <RotateCcw />Reset Frames
                    </Button>
                </div>


                <Stage
                    width={stageSize.width + 20}
                    height={stageSize.height + 20}
                    className={`mt-5 ${isPreviewLoading ? "pointer-events-none" : ""}`}
                    ref={stageRef}
                >
                    <Layer>
                        {konvasImage && <Image image={konvasImage} width={stageSize.width} height={stageSize.height} />}

                        {scaledFrames.map((frame, index) => {
                            return (
                                <ImageFrameEditor
                                    imageFrame={frame}
                                    frameNumber={index}
                                    key={index}
                                    onDrag={(corner: keyof ImageFrame, updatedCornerCoordinate: number[]) => {
                                        // Update frames
                                        const updatedFrames = [...scaledFrames];
                                        updatedFrames[index] = { ...updatedFrames[index], [corner]: updatedCornerCoordinate } // Update correct frame using index
                                        setScaledFrames(updatedFrames)


                                        // Update magnification helper
                                        updateMagnifier(updatedCornerCoordinate[0], updatedCornerCoordinate[1])
                                        
                                    }}

                                    onDragFinished={() => {
                                        setIsPreviewsLoading(true);


                                        // onDrag will already update the state of scaledFrames to their final position, so when the dragging ends we can just reuse those values to update the Zustand image store
                                        updateImageFrame(parentImageID, index, { ...scaledFrames[index] }, stageScale) // update the frame of the specific image that has been modified

                                        // Update the preview images
                                        requestPreviewUpdate(parentImageID, index, { ...scaledFrames[index] }, stageScale)

                                        // Hide magnifier
                                        setMagnifierImage(null);
                                        setMagnifierPos(null);

                                    }}

                                    stageSize={stageSize} />
                            )
                        })}



                        {/* Display magnifier */}
                        {magnifierImage && magnifierPos && (

                            <>
                                <Group

                                    // Clip magnifier into circular shape
                                    clipFunc={(ctx) => {
                                        ctx.beginPath();
                                        ctx.arc(
                                            magnifierPos[0] + magnifierSize / 2, // center x
                                            magnifierPos[1] + magnifierSize / 2, // center y
                                            magnifierSize / 2, // radius
                                            0,
                                            Math.PI * 2,
                                            false
                                        );
                                        ctx.closePath();
                                    }}
                                >
                                    {/* Plain white rectangle for background (display instead of transparent background) */}
                                    <Rect
                                        x={magnifierPos[0]}
                                        y={magnifierPos[1]}
                                        width={magnifierSize}
                                        height={magnifierSize}
                                        fill="white"
                                        strokeWidth={1}
                                    />

                                    {/* Actual magnified image */}
                                    <Image
                                        image={magnifierImage}
                                        x={magnifierPos[0]}
                                        y={magnifierPos[1]}
                                        width={magnifierSize}
                                        height={magnifierSize}
                                    />
                                </Group>

                                {/* Magnifier Outline circular */}
                                <Circle
                                    x={magnifierPos[0] + magnifierSize / 2}
                                    y={magnifierPos[1] + magnifierSize / 2}
                                    radius={magnifierSize / 2}
                                    stroke="#0f172a"
                                    strokeWidth={1}
                                />
                            </>

                        )}


                    </Layer>
                </Stage>

            </div>


            <div className="px-5 flex-1">
                <h2 className="text-lg font-semibold">Previews</h2>
                <p className="text-sm">Note: Previews do not reflect final image quality</p>

                <div className="flex flex-wrap gap-3 mt-5">

                    {/* For previews to be rendered, the expectedPreviewsCount must be met, and no preview should still be loading in */}
                    {(storedPreviewImages.length === expectedPreviewsCount && !isPreviewLoading) ? storedPreviewImages.map((previewImage: string, index: number) => (
                        <div className="relative inline-block" key={index}>
                            <img src={previewImage} className="max-h-48 aspect-auto"></img>
                            <button
                                className="absolute -top-2 -right-2 bg-white opacity-80 rounded-full p-1 shadow-md hover:opacity-100"
                                onClick={() => { handleRemoveFrame(index) }}
                            >
                                <X className="w-3 h-3 text-red-500" />
                            </button>
                        </div>
                    ))
                        : <LoadingSpinner width={10} height={10} />}

                </div>
            </div>
        </div>

    )


    // Update magnifier image, given the dragged position
    function updateMagnifier(x: number, y: number){
        if (stageRef.current) {
            
            
            const cropSize = magnifierSize / magnification;

            // Get the magnified image
            const dataURL = stageRef.current.toDataURL({
                x: x - cropSize / 2,
                y: y - cropSize / 2,
                width: cropSize,
                height: cropSize,
                pixelRatio: 4,
            });

            const img = new window.Image();
            img.src = dataURL;
            img.onload = () => setMagnifierImage(img);

            
            // Update magnifier position
            const pointerPosition = stageRef.current.getPointerPosition()
            if (pointerPosition) {

                // If pointer/cursor position ever goes out of bound, limit its bounds
                if (pointerPosition.x > stageSize.width){
                    pointerPosition.x = stageSize.width
                }
                else if (pointerPosition.x < 0){
                    pointerPosition.x = 0
                }

                if (pointerPosition.y > stageSize.height){
                    pointerPosition.y = stageSize.height
                }
                else if (pointerPosition.y < 0){
                    pointerPosition.y = 0
                }

                // Magnifier thresholds for positioning
                const thresholdX = stageSize.width * 0.75;
                const thresholdY = stageSize.height * 0.75;
                const minThresholdX = stageSize.width * 0.25;
                const minThresholdY = stageSize.height * 0.25;
                const offset = 20; // Extra margin
              
                // By default show the magnifier to the left and above the pointer/cursor
                let newX = pointerPosition.x - magnifierSize - offset;
                let newY = pointerPosition.y - magnifierSize -  offset; 
              
                // If pointer goes beyond 75% of the stage's width, then show magnifer on the left
                if (pointerPosition.x > thresholdX) {
                  newX = pointerPosition.x - magnifierSize - offset; 
                } 
                // If pointer goes under the 25% stage width threshold, show on right
                else if (pointerPosition.x < minThresholdX) {
                  newX = pointerPosition.x + offset; 
                }
              
                // Show above if above 75% of stage height
                if (pointerPosition.y > thresholdY) {
                  newY = pointerPosition.y - magnifierSize - offset;
                } 
                // Show below if under 25% of stage height
                else if (pointerPosition.y < minThresholdY) {
                  newY = pointerPosition.y + offset;
                }
              
                setMagnifierPos([newX, newY]);
            }
        }
    }
}