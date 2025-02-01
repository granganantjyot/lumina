import { KonvaEventObject } from "konva/lib/Node";
import { ImageFrame } from "./photo-crop";
import { Circle, Line } from "react-konva";


const FRAME_COLORS = ["#4cacaf", "#5233b8", "#89c91a", "#c94b4b"]; 

interface ImageFrameEditorType {
    imageFrame: ImageFrame,
    frameNumber: number,
    onDrag: Function,
    onDragFinished: Function,
    stageSize : {width : number, height : number} // [width, height]
}

export default function ImageFrameEditor({ imageFrame, frameNumber, onDrag, onDragFinished, stageSize }: ImageFrameEditorType) {

    function handleDragMovement(event: KonvaEventObject<DragEvent>, corner: keyof ImageFrame) {

        // Get new dragged position
        const { x, y } = event.target.position(); 

        // Constrain movement within bounds
        const contrainedX = Math.max(0, Math.min(x, stageSize.width)) 
        const constrainedY = Math.max(0, Math.min(y, stageSize.height))

        // Update the stae position
        onDrag(corner, [contrainedX, constrainedY]);

        // Update Konva position
        event.target.x(contrainedX);
        event.target.y(constrainedY);
    }


    return (
        <>

            {/* Draw out corner circles */}
            {
                Object.keys(imageFrame).map((corner) => {
                    const key = corner as keyof ImageFrame; // tr, tl, br, or bl

                    return (
                        <Circle
                            key={key}
                            x={imageFrame[key][0]}
                            y={imageFrame[key][1]}
                            radius={7}
                            fill={FRAME_COLORS.at(frameNumber % 4)}
                            opacity={0.6}
                            dragDistance={1}
                            draggable
                            onDragMove={(event) => handleDragMovement(event, key)}
                            onDragEnd={(event) => {onDragFinished()}}
                        />
                    )
                })
            }


            {/* Draw box bounded by corners */}
            <Line
                points={
                    [imageFrame.tl[0], imageFrame.tl[1], 
                    imageFrame.tr[0], imageFrame.tr[1], 
                    imageFrame.br[0], imageFrame.br[1], 
                    imageFrame.bl[0], imageFrame.bl[1]]}
                fill={FRAME_COLORS.at(frameNumber % 4)}
                opacity={0.5}
                stroke={FRAME_COLORS.at(frameNumber % 4)}
                strokeWidth={2}
                closed={true}
                listening={false}
                pointerEvents="none"
            />


        </>
    )





}