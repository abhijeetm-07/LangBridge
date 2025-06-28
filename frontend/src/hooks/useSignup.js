import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { signup } from "../lib/api";
import toast from "react-hot-toast"; 

const useSignup = () => {
  const queryClient = useQueryClient(); 
  const navigate = useNavigate();       

  const {
    mutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Account created successfully!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Signup failed. Try again.");
    },
  });

  return { error, isPending, signupMutation: mutate };
};

export default useSignup;
