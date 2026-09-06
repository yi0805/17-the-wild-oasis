import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { login as loginApi } from "../../services/apiAuth";

type LoginVariables = Parameters<typeof loginApi>[0];

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation<
    Awaited<ReturnType<typeof loginApi>>,
    Error,
    LoginVariables
  >({
    mutationFn: loginApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      navigate("/dashboard", { replace: true });
    },
    onError: () => {
      toast.error("Provided email or password is incorrect");
    },
  });

  return { login, isLoading };
}
