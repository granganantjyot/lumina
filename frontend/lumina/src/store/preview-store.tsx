import { ImageFrame } from "@/components/photo-crop";
import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware'


interface PreviewState {
    socket: WebSocket | null // Websocket

    activePreviews: {[parentImageID: string] : string[]} // Map parent img ID, to array of base64 string images

    connect: () => void // Used to make initial websocket connection

    requestPreviewUpdate: (parentImageID: string, index: number, newFrame: ImageFrame, stageScale: {xScale: number, yScale: number}) => void // Send message to socket

    resetPreviews: (parentImageID: string, stageScale: {xScale: number, yScale: number}, oldFrames: ImageFrame[]) => void 

    deletePreview: (parentImageID: string, index: number) => void;

    disconnect: () => void

}

export const usePreviewStore = create<PreviewState>()(subscribeWithSelector((set, get) => ({

    socket: null,

    activePreviews: {},

    connect: () => {
        console.log("Connecting to socket...")
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
        if (!wsUrl) {
            throw new Error("WebSocket URL is not defined");
        }
        const imageSocket = new WebSocket(wsUrl);
        

        imageSocket.onmessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data);

            set((state) => {
                // Get current previews for the specific parentImageID
                const currentPreviews = state.activePreviews[response.parentImageID] || [];
                

                // Create copy of these previews, and update at the relevant index
                const updatedPreviews = [...currentPreviews]; 
                updatedPreviews[response.index] = response.image; 

                // Update store state for active previews
                return {activePreviews: {...state.activePreviews, [response.parentImageID] : updatedPreviews}}
            })
        }

        set({socket : imageSocket});
    },

    requestPreviewUpdate: (parentImageID: string, index: number, newFrame: ImageFrame, stageScale) => {
        // Create deep copy of updatedFrame 
        const rescaledFrame: ImageFrame = {
            tl: [...newFrame.tl],
            tr: [...newFrame.tr],
            br: [...newFrame.br],
            bl: [...newFrame.bl]
        };

        // Divide by x and y scale factors for each corner in the ImageFrame (to get it into original pixel-scale of the image)
        Object.keys(rescaledFrame).forEach((key) => {
            const [x, y] = rescaledFrame[key as keyof ImageFrame];
            rescaledFrame[key as keyof ImageFrame] = [x / stageScale.xScale, y / stageScale.yScale]
        })

        const body = {
            parentImageID: parentImageID,
            index: index,
            frame: rescaledFrame
        }

        get().socket?.send(JSON.stringify(body));
    },

    resetPreviews: (parentImageID: string, stageScale: {xScale: number, yScale: number}, oldFrames: ImageFrame[]) => {

        set((state) => ({activePreviews: {...state.activePreviews, [parentImageID] : []}}))

        const requestPreviewUpdate = get().requestPreviewUpdate;

        for (let i = 0; i < oldFrames.length; i++){
            requestPreviewUpdate(parentImageID, i, oldFrames[i], stageScale)
        }
    },
        
    
    deletePreview: (parentImageID: string, index: number) => {
        const currentPreviews = get().activePreviews[parentImageID];
        currentPreviews.splice(index, 1);
        set((state) => ({activePreviews : {...state.activePreviews, [parentImageID]: currentPreviews}}))
    },

    disconnect: () => {
        get().socket?.close();

        set({socket: null});
    }

})))