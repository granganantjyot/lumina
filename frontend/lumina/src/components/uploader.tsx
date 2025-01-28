"use client";
import Dropzone, { DropzoneState } from 'shadcn-dropzone';
import { toast, useToast } from "@/hooks/use-toast"
import clsx from "clsx";


interface UploadComponentProps {
    className?: string;
    onFileUpload : Function;
}

export default function UploadComponent({ className, onFileUpload }: UploadComponentProps) {
    return (
        <Dropzone
            dropZoneClassName="flex justify-center items-center w-full h-full bg-white border-dashed border-[1.5px] border-[#31454e] rounded-lg hover:bg-transparent hover:text-white hover:border-white transition-all select-none cursor-pointer"
            containerClassName={clsx("w-1/2 min-h-56", className)}
            onDrop={(acceptedFiles: File[]) => {
                onFileUpload(acceptedFiles)
            }}

            onDropRejected={(fileRejections) => {
                toast({title : "Unsupported File(s)", variant: "destructive",})
            }}

            maxSize={50 * 1024 * 1024} // 50mb max upload size
            accept={{ "image/png": [], "image/jpeg": [], "image/jpg": [] }}
        >
            {(dropzone: DropzoneState) => (
                <>
                    {

                        dropzone.isDragActive ? (<p>Ready!</p>)
                            : (
                                <div className='flex items-center flex-col gap-1.5'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload mr-2 h-4 w-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
                                    <p className="text-sm font-medium text-center">Drop files or click to browse</p>
                                    <p className="text-xs font-medium text-center">.png, .jpg, .jpg (50 MB max)</p>
                                    <p className="text-xs text-center">{dropzone.acceptedFiles.length} file(s) uploaded</p>
                                </div>
                            )

                    }
                    
                </>
            )}
        </Dropzone>
    )

}