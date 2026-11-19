import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { BRAND } from "../config/brand";
import { getCache, setCache } from "../utils/memoryCache";

const SETTINGS_DOC = "settings";
const BUSINESS_DOC = "business";
const CACHE_KEY_SETTINGS = "business_settings";

export async function getBusinessSettings() {
  const cached = getCache(CACHE_KEY_SETTINGS);
  if (cached) return cached;

  try {
    const snap = await getDoc(doc(db, SETTINGS_DOC, BUSINESS_DOC));
    if (snap.exists()) {
      const data = snap.data();
      setCache(CACHE_KEY_SETTINGS, data);
      return data;
    }
  } catch {
    // Firestore read failed, fall through to defaults
  }
  const defaultSettings = {
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "",
    businessName: BRAND.name,
  };
  setCache(CACHE_KEY_SETTINGS, defaultSettings);
  return defaultSettings;
}

export async function getWhatsappNumber() {
  const settings = await getBusinessSettings();
  return settings.whatsappNumber || "";
}
