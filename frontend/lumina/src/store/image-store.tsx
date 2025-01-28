import { create } from 'zustand'


interface ImageState{
    imageCount : number,
    setImageCount : (newCount : number) => void

    imageFiles : File[]
    setImageFiles : (files : File[]) => void

    sessionId? : string | null,
    setSessionId : (id : string) => void
}

const useStore = create<ImageState>((set) => ({
    imageCount : 0,
    setImageCount : (newCount : number) => set((state) => ({imageCount : newCount})),


    imageFiles : [],
    setImageFiles : (files : File[]) => set((state) => ({imageFiles : files})),
    
    sessionId : null,
    setSessionId : (id : string) => set((state) => ({sessionId : id}))

  }))

  export default useStore;