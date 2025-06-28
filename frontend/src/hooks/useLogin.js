import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom'; // You also missed this!
import { login } from "../lib/api"; // Or correct path

const useLogin = () => {
  const queryClient = useQueryClient(); // ✅ CORRECT
  const navigate = useNavigate();       // ✅ NEEDED for redirection

  const {
    mutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: login, // ✅ Make sure 'login' is imported
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });

      const user = await queryClient.fetchQuery({ queryKey: ["authUser"] });

      if (user?.isOnboarded) {
        navigate("/");
      } else {
        navigate("/onboarding");
      }
    },
  });

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;
