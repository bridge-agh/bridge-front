import { useEffect, useState } from "react";

export default function useLongPoll(initialUrl: string, pollUrl: string) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  
  const [gen, setGen] = useState<number>(0);

  useEffect(() => {
    fetch(gen === 0 ? initialUrl : pollUrl)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText;
        }
      })
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setGen(gen + 1);
      });
  }, [gen, initialUrl, pollUrl]);

  return [data, error];
}
