import type { FormData } from "../types/store";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.arreglio.com";

export const storeConfigService = {
  // Save store configuration
  async saveStoreConfig(storeId: string, config: any) {
    localStorage.setItem(`storeConfig_${storeId}`, JSON.stringify(config));
    return { success: true };
  },

  // Get store configuration
  async getStoreConfig(storeId: string) {
    const data = localStorage.getItem(`storeConfig_${storeId}`);
    if (!data) throw new Error("No config found");
    return JSON.parse(data);
  },

  // Upload store assets (images, etc.)
  async uploadStoreAsset(storeId: string, file: File, type: "background" | "about" | "profile") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch(`${API_BASE_URL}/stores/${storeId}/assets`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload store asset");
    }

    return response.json();
  },
};
