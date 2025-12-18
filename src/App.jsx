import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import mqtt from "mqtt";

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // HiveMQ Cloud WebSocket 연결
    const client = mqtt.connect(
      "wss://7cdb35e14e60495380d130e6982607e1.s1.eu.hivemq.cloud:8000/mqtt",
      {
        username: "jjeas",
        password: "green1234A",
      }
    );

    client.on("connect", () => {
      console.log("MQTT connected");
      client.subscribe("jaeseok"); // Arduino에서 publish하는 토픽
    });

    client.on("message", (topic, message) => {
      try {
        const msg = JSON.parse(message.toString()); // Arduino에서 JSON 문자열로 보내는 경우
        msg.created_at = new Date().toLocaleTimeString();
        setData((prev) => [...prev.slice(-49), msg]); // 최신 50개만 유지
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    });

    return () => client.end();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📡 MPU6050 Realtime Chart</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="created_at" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ax" stroke="#ff0000" dot={false} />
          <Line type="monotone" dataKey="ay" stroke="#00ff00" dot={false} />
          <Line type="monotone" dataKey="az" stroke="#0000ff" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
