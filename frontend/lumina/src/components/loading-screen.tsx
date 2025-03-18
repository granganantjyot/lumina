import { Skeleton } from "./ui/skeleton";


interface LoadingScreenType{
    text: string,
    secondary?: string | null
}

export default function LoadingScreen({text, secondary=null} : LoadingScreenType) {
    return (
        <div className="flex align-middle justify-center mt-4">
            <div className="">
                <div className="flex items-center space-x-4">
                    <div className="space-y-2">
                        <Skeleton className="h-40 w-40 rounded-3xl bg-main-orange" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-44 w-44 rounded-3xl bg-main-teal" />
                        <Skeleton className="h-48 w-48 rounded-3xl bg-main-red" />
                    </div>
                </div>
                <p className="mt-12 font-medium text-2xl text-center text-black">{text}</p>
                {secondary && <p className="mt-2 text-md text-center text-black">{secondary}</p>}
            </div>

        </div>
    )
}