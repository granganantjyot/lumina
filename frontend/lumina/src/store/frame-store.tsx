import { ImageFrame } from '@/components/photo-crop'
import { create } from 'zustand'


interface FrameState{
    imageCount : number,
    setImageCount : (newCount : number) => void

    imageFiles : File[]
    setImageFiles : (files : File[]) => void

    sessionId? : string | null,
    setSessionId : (id : string) => void

    parentImgToFrames : {[parentImgID: string] : ImageFrame[]} | null // Maps parent image ids to the list of corresponding image frames that need to be cropped out
    setParentImgToFrames : (mappings : {[parentImgID: string] : ImageFrame[]} ) => void;

    updateImageFrame : (parent_img_id : string, index : number, newFrame : ImageFrame, stageScale: {xScale: number, yScale: number}) => void;

    addImageFrame : (parent_img_id : string, newFrame : ImageFrame, stageScale: {xScale: number, yScale: number}) => void;

    deleteImageFrame : (parent_img_id : string, index : number) => void;

    getTotalFramesCount : () => number;

    clearFrameStore: () => void;
}   



const useFrameStore = create<FrameState>((set, get) => ({
    imageCount : 0,
    setImageCount : (newCount : number) => set(() => ({imageCount : newCount})),


    imageFiles : [],
    setImageFiles : (files : File[]) => set(() => ({imageFiles : files})),

    sessionId : null,
    setSessionId : (id : string) => set(() => ({sessionId : id})),


    parentImgToFrames : null,
    setParentImgToFrames: (mappings : {[parentImgID: string] : ImageFrame[]}) => set(() => ({parentImgToFrames : mappings})),

    updateImageFrame: (parent_img_id : string, index : number, newFrame : ImageFrame, stageScale: {xScale: number, yScale: number}) => set((state) => {
        

        const rescaledFrame: ImageFrame = {
            tl: [...newFrame.tl],
            tr: [...newFrame.tr],
            br: [...newFrame.br],
            bl: [...newFrame.bl]
        };

        rescaleFrame(rescaledFrame, stageScale.xScale, stageScale.yScale);

        const parentFrames = [...((state.parentImgToFrames && state.parentImgToFrames[parent_img_id]) || [])]; 
        parentFrames[index] = rescaledFrame;

        return {parentImgToFrames : {...state.parentImgToFrames, [parent_img_id] : parentFrames}}
    }),

    addImageFrame: (parent_img_id : string, newFrame : ImageFrame, stageScale: {xScale: number, yScale: number}) => set((state) => {
        const currFrames = (state.parentImgToFrames && state.parentImgToFrames[parent_img_id]) || [];
        
        const rescaledFrame: ImageFrame = {
            tl: [...newFrame.tl],
            tr: [...newFrame.tr],
            br: [...newFrame.br],
            bl: [...newFrame.bl]
        };
        rescaleFrame(rescaledFrame, stageScale.xScale, stageScale.yScale);

        return {
            parentImgToFrames : {...state.parentImgToFrames, [parent_img_id] : [...currFrames, rescaledFrame]}
        }
    }),

    deleteImageFrame: (parent_img_id : string, index : number) => set((state) => {
        const currFrames = state.parentImgToFrames ? [...state.parentImgToFrames[parent_img_id]] : [];
        currFrames.splice(index, 1);

        return {
            parentImgToFrames: {...state.parentImgToFrames, [parent_img_id] : currFrames}
        }
    }),


    getTotalFramesCount: () => {

        let count = 0;

        Object.entries(get().parentImgToFrames ?? {}).forEach(([, imageFrames]) => {
            count = count + imageFrames.length;
        });
        
        return count;
    },


    clearFrameStore: () => set(() => ({
        imageCount : 0,
        imageFiles : [],
        sessionId : null,
        parentImgToFrames : null,
    }))


  }))


function rescaleFrame(frame: ImageFrame, xScale: number, yScale: number){
    Object.keys(frame).forEach((key) => {
        const [x, y] = frame[key as keyof ImageFrame];
        frame[key as keyof ImageFrame] = [x / xScale, y / yScale]
    })
}

export default useFrameStore;