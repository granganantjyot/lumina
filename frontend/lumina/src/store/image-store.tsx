import { ImageFrame } from '@/components/photo-crop'
import { create } from 'zustand'


interface ImageState{
    imageCount : number,
    setImageCount : (newCount : number) => void

    imageFiles : File[]
    setImageFiles : (files : File[]) => void

    sessionId? : string | null,
    setSessionId : (id : string) => void

    parentImgToFrames : {[parentImgID: string] : ImageFrame[]} // Maps parent image ids to the list of corresponding image frames that need to be cropped out
    setParentImgToFrames : (mappings : {[parentImgID: string] : ImageFrame[]} ) => void;

    updateImageFrame : (parent_img_id : string, index : number, newFrame : ImageFrame) => void;
}   



const useStore = create<ImageState>((set) => ({
    imageCount : 0,
    setImageCount : (newCount : number) => set((state) => ({imageCount : newCount})),


    imageFiles : [],
    setImageFiles : (files : File[]) => set((state) => ({imageFiles : files})),
    
    sessionId : null,
    setSessionId : (id : string) => set((state) => ({sessionId : id})),


    parentImgToFrames : {},
    setParentImgToFrames: (mappings : {[parentImgID: string] : ImageFrame[]}) => set((state) => ({parentImgToFrames : mappings})),

    updateImageFrame: (parent_img_id : string, index : number, newFrame : ImageFrame) => set((state) => {
        

        const rescaledFrame: ImageFrame = {
            tl: [...newFrame.tl],
            tr: [...newFrame.tr],
            br: [...newFrame.br],
            bl: [...newFrame.bl]
        };

        const parentFrames = [...(state.parentImgToFrames[parent_img_id] || [])]; 
        parentFrames[index] = rescaledFrame;

        return {parentImgToFrames : {...state.parentImgToFrames, [parent_img_id] : parentFrames}}
    })

  }))

  export default useStore;