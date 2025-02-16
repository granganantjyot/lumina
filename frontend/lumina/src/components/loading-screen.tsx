import { Skeleton } from "./ui/skeleton";


interface LoadingScreenType{
    text: string
}

export default function LoadingScreen({text} : LoadingScreenType) {
    return (
        <div className="flex align-middle justify-center mt-4">
            <div className="">
                <div className="flex items-center space-x-4">
                    <div className="space-y-2">
                        <Skeleton className="h-40 w-40 rounded-3xl bg-[#e96443]" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-44 w-44 rounded-3xl bg-[#4cacaf]" />
                        <Skeleton className="h-48 w-48 rounded-3xl bg-[#c94b4b]" />
                    </div>
                </div>
                <p className="mt-12 font-medium text-2xl text-center text-black">{text}</p>
            </div>

        </div>
    )
}