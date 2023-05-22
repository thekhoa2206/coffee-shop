import { useEffect, useState } from "react";

function useAPI(request: Function) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setData(await request());
    } catch (e) {
      // setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return [data, isLoading, error, fetchData];
}

export default useAPI;
