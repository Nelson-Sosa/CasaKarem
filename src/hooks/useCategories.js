import { useState, useEffect, useRef, useCallback } from "react";
import * as categoryService from "../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [categoriesGrouped, setCategoriesGrouped] = useState([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => { mountedRef.current = false; };
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [flat, grouped] = await Promise.all([
        categoryService.getCategories(),
        categoryService.getCategoriesGrouped(),
      ]);
      if (mountedRef.current) {
        setCategories(flat);
        setCategoriesGrouped(grouped);
      }
    } catch {
      // handled by page
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }

  const reload = useCallback(() => load(), []);

  return { categories, categoriesGrouped, loading, reload };
}
