import { useEffect, useState } from "react";

export default function useLongPoll(url: string) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  
  const [gen, setGen] = useState<number>(0);

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (res.ok) {
          setError(null);
          setData(res.json());
        } else {
          throw res.statusText;
        }
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setGen(gen + 1);
      });
  }, [url, gen]);

  return [data, error];
}
