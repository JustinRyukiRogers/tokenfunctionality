// src/useTokenTableData.js
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export function useTokenTableData(csvUrl) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(csvUrl)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const nestedData = results.data.map((row, index) => ({
              id: index.toString(),
              name: row.name,
              token: row.token,
              pinned: false,
              payments: {
                endogenous: row["payments.endogenous"],
                exogenous: row["payments.exogenous"],
              },
              collateral: {
                endogenous: row["collateral.endogenous"],
                exogenous: row["collateral.exogenous"],
              },
              contribution: {
                endogenous: row["contribution.endogenous"],
                exogenous: row["contribution.exogenous"],
              },
              membership: {
                endogenous: row["membership.endogenous"],
                exogenous: row["membership.exogenous"],
              },
              governance: {
                endogenous: row["governance.endogenous"],
                exogenous: row["governance.exogenous"],
              },
              valueredistribution: {
                endogenous: row["valueredistribution.endogenous"],
                exogenous: row["valueredistribution.exogenous"],
              },
              assetownership: {
                endogenous: row["assetownership.endogenous"],
                exogenous: row["assetownership.exogenous"],
              },
            }));
            setData(nestedData);
            setLoading(false);
          },
          error: (err) => {
            setError(err);
            setLoading(false);
          }
        });
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [csvUrl]);

  return { data, loading, error, setData };
}
