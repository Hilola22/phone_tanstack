import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "..";

export interface IPhone {
  id: string;
  title: string;
  price: number;
  memories: string[];
  hasDelivery: boolean;
}

export const usePhone = () => {
  const client = useQueryClient();

  const getPhones = () =>
    useQuery<any, any>({
      queryKey: ["phoneKey"],
      queryFn: () => api.get("phone").then((res) => res.data),
    });

  const createPhone = () =>
    useMutation<any, any, any>({
      mutationFn: (body) => api.post("phone", body).then((res) => res.data),
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["phoneKey"] });
      },
    });

  const updatePhone = () =>
    useMutation<any, any, any>({
      mutationFn: (body) =>
        api.put(`phone/${body.id}`, body).then((res) => res.data),
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["phoneKey"] });
      },
    });

  const deletePhone = () =>
    useMutation<any, any, string>({
      mutationFn: (id) => api.delete(`phone/${id}`).then((res) => res.data),
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["phoneKey"] });
      },
    });

  return { getPhones, createPhone, updatePhone, deletePhone };
};
