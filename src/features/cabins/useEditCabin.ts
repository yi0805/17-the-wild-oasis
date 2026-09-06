import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

type EditCabinVariables = {
  newCabinData: Parameters<typeof createEditCabin>[0];
  id: NonNullable<Parameters<typeof createEditCabin>[1]>;
};

export function useEditCabin() {
  const queryClient = useQueryClient();

  const { mutate: editCabin, isLoading: isEditing } = useMutation<
    Awaited<ReturnType<typeof createEditCabin>>,
    Error,
    EditCabinVariables
  >({
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin successfully edited");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { editCabin, isEditing };
}
