import { create } from 'zustand'


export interface ConfirmedImage {
    imageID: string,
    angle: number,
    date: string,
    parentImageID: string
}


interface ConfirmedImageState {
    confirmedImages: ConfirmedImage[] | null,

    setConfirmedImages : (newImages : ConfirmedImage[]) => void;
}


const useConfirmedImageStore = create<ConfirmedImageState>((set) => ({

    confirmedImages: null,

    setConfirmedImages: (newImages : ConfirmedImage[]) => set(() => ({confirmedImages: newImages}))

}))

export default useConfirmedImageStore;