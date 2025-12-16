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
    // 초기 데이터
    supabase
      .from("gyro_data")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data }) => setGyro(data || []));

    // 실시간
    const channel = supabase
      .channel("gyro-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "gyro_data" },
        (payload) => {
          setGyro((prev) => [...prev.slice(-49), payload.new]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <LineChart width={600} height={300} data={gyro}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="created_at" tickFormatter={(v) => v.slice(11, 19)} />
      <YAxis />
      <Tooltip />
      <Line dataKey="gx" stroke="#ff4d4f" dot={false} />
      <Line dataKey="gy" stroke="#40a9ff" dot={false} />
      <Line dataKey="gz" stroke="#73d13d" dot={false} />
    </LineChart>
  );
}
