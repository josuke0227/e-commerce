import { useState, useEffect } from "react";
import { getCategories } from "../services/categoryServices";

export default function useCategory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();

    async function fetchCategories() {
      setLoading(true);
      try {
        const { data } = await getCategories();
        setData(data);
      } catch (error) {
        console.log("category fetching error", error);
      }

      setLoading(false);
    }
  }, []);

  function setCategory(categories) {
    setData(categories);
  }

  return [data, loading, setCategory];
}
