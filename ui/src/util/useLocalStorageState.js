import { useState, useEffect } from "react";

function useLocalStorageState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const itemValue = localStorage.getItem(key);

    return itemValue !== null ? JSON.parse(itemValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue]
}

export default useLocalStorageState;
