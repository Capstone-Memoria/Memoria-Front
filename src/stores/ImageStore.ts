import { createStore, useStore } from "zustand";

type ImageStoreKey = string;
type ImageData = Blob;

interface Image {
  imageURL: string;
  image: ImageData;
}

interface ImageStoreContext {
  map: Map<ImageStoreKey, Image>;

  add: (key: ImageStoreKey, image: Image) => void;
  get: (key: ImageStoreKey) => Image | undefined;
  remove: (key: ImageStoreKey) => void;
}

export const imageStore = createStore<ImageStoreContext>((set, get) => {
  return {
    map: new Map(),
    add: (key, image) => {
      set((state) => {
        state.map.set(key, image);
        return state;
      });
    },
    get: (key) => {
      return get().map.get(key);
    },
    remove: (key) => {
      set((state) => {
        state.map.delete(key);
        return state;
      });
    },
  };
});

export const useImageStore = () => {
  return useStore(imageStore);
};
