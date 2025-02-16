import { Skeleton } from "./ui/skeleton";

interface LoadingComponentType{
    loadingText: string;
    size: "large" | "small"
}

export default function LoadingComponent({loadingText, size} : LoadingComponentType)  {

    const skeletonSize = (size === "large" ? 
        {first: "h-44 w-44 rounded-3xl", second: "h-44 w-44 rounded-3xl", third: "h-48 w-48 rounded-3xl", text: "text-2xl", textMargin: "mt-12"} :
        {first: "h-20 w-20 rounded-2xl", second: "h-20 w-20 rounded-2xl", third: "h-20 w-20 rounded-2xl", text: "text-lg", textMargin: "mt-4"}
    )



    return (
        <div className="">
            <div className="flex items-center space-x-4">
                <div className="space-y-2">
                    <Skeleton className={`${skeletonSize.first} bg-[#e96443]`} />
                </div>
                <div className="space-y-2">
                    <Skeleton className={`${skeletonSize.second} bg-[#4cacaf]`} />
                    <Skeleton className={`${skeletonSize.third} bg-[#c94b4b]`} />
                </div>
            </div>
            <p className={`${skeletonSize.textMargin} font-medium ${skeletonSize.text} text-center text-black`}>{loadingText}</p>
        </div>
    )
}