import { useQuery } from "@tanstack/react-query";
import api from "../api/apiClient";
import { User } from "../types";

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>("/users");
  return data;
};

export const useApiUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};
