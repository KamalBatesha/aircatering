import { useMutation } from "@tanstack/react-query";
import { Review, Reviewed } from "./ReviewApi";

function useReviewMutation() {
    
    const ReviewMutation= useMutation({
        mutationKey:["Review"],
        mutationFn:(data)=>Review(data)
        
    });

    const ReviewedMutation= useMutation({
        mutationKey:["Reviewed"],
        mutationFn:(data)=>Reviewed(data)
        
    });

return {ReviewMutation,ReviewedMutation};
    
}

export default useReviewMutation