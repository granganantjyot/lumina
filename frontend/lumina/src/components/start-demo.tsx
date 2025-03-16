"use client";

import useFrameStore from "@/store/frame-store";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import { ReactNode } from "react";


interface StartDemoComponentProps {
    trigger: ReactNode
}

export default function StartDemoComponent({ trigger }: StartDemoComponentProps) {
    const { setImageCount, setImageFiles, setSessionId, clearFrameStore } = useFrameStore();
    const router = useRouter();

    const demoFile: string = "demo.jpg"

    return (
        <div onClick={startDemo}>
            {trigger}
        </div>
    )

    async function startDemo() {
        const response = await fetch(`/${demoFile}`);
        const blob = await response.blob();
        const file = new File([blob], demoFile, { type: blob.type });

        // Clear the frame store before beginning a new session 
        clearFrameStore();

        // Set new data in frame store
        setImageCount(1);
        setImageFiles([file]);
        setSessionId(uuidv4());
        router.push("/crop")
    }

}