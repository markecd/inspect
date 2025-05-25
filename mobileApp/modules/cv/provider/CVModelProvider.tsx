import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { loadCVModel } from "../services/loadModel";

interface CVModelContextType {
  model: any | null;
  loading: boolean;
  error: Error | null;
}

const CVModelContext = createContext<CVModelContextType>({
  model: null,
  loading: true,
  error: null,
});

export const CVModelProvider = ({ children }: { children: ReactNode }) => {
  const [model, setModel] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadCVModel()
      .then((m) => {
        if (isMounted) {
          setModel(m);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (isMounted) {
          setError(e);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <CVModelContext.Provider value={{ model, loading, error }}>
      {children}
    </CVModelContext.Provider>
  );
};

export const useCVModel = () => useContext(CVModelContext);
