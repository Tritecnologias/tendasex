import { useQuery } from "@tanstack/react-query";
import { getStoreInfo, type StoreInfoSettings } from "@/fns/settings";

export const STORE = {
  name: "Secret Desire",
  tagline: "Prazer com discrição. Entrega sigilosa.",
  description:
    "Produtos eróticos selecionados para casais e solo. Embalagem 100% discreta garantida.",
  shipping: { freeFrom: 199, flatRate: 19.9 },
};

export function useStore() {
  const { data } = useQuery<StoreInfoSettings>({
    queryKey: ["store-info"],
    queryFn: () => getStoreInfo(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    name: data?.name || STORE.name,
    tagline: data?.tagline || STORE.tagline,
    description: data?.description || STORE.description,
    logoUrl: data?.logo_url || "",
    shipping: STORE.shipping,
  };
}

