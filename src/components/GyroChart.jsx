// src/components/GyroChart.jsx
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { supabase } from "../lib/supabase";

export default function GyroChart() {
  const [gyro, setGyro] = useState([]);

  useEffect(() => {
    // ✅ 초기 데이터 (sensor_data)
    supabase
      .from("sensor_data")
      .select("created_at, payload")
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }

        // 🔥 payload에서 gx/gy/gz 꺼내기
        const mapped = (data || []).map((row) => ({
          created_at: row.created_at,
          gx: row.payload?.gx,
          gy: row.payload?.gy,
          gz: row.payload?.gz,
        }));

        setGyro(mapped);
      });

    // ✅ 실시간도 sensor_data로 통일
    const channel = supabase
      .channel("gyro-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_data",
        },
        (payload) => {
          const row = payload.new;

          setGyro((prev) => [
            ...prev.slice(-49),
            {
              created_at: row.created_at,
              gx: row.payload?.gx,
              gy: row.payload?.gy,
              gz: row.payload?.gz,
            },
          ]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <LineChart width={600} height={300} data={gyro}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="created_at"
        tickFormatter={(v) => v?.slice(11, 19)}
      />
      <YAxis />
      <Tooltip />
      <Line dataKey="gx" stroke="#ff4d4f" dot={false} />
      <Line dataKey="gy" stroke="#40a9ff" dot={false} />
      <Line dataKey="gz" stroke="#73d13d" dot={false} />
    </LineChart>
  );
}
