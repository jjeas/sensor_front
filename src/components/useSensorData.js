import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useSensorData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    load();

    const channel = supabase
      .channel("sensor-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sensor_data" },
        (payload) => {
          setData((prev) => [...prev.slice(-50), payload.new]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function load() {
    const { data } = await supabase
      .from("sensor_data")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(50);

    setData(data || []);
  }

  return data;
}
