import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

type CabinMutationInput = Parameters<typeof createEditCabin>[0];

export function useCreateCabin() {
  const queryClient = useQueryClient();
  const { mutate: createCabin, isLoading: isCreating } = useMutation<
    Awaited<ReturnType<typeof createEditCabin>>,
    Error,
    CabinMutationInput
  >({
    mutationFn: (newCabin) => createEditCabin(newCabin),
    onSuccess: () => {
      toast.success("New cabin successfully created");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createCabin, isCreating };
}
