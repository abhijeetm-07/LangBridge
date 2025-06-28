import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api"; // or "../lib/api.js" if needed

const useAuthUser = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  return {
    authUser: data?.user,
    isLoading,
    error,
  };
};

export default useAuthUser;
