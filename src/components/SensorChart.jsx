import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useSensorData } from "../hooks/useSensorData";

export default function SensorChart() {
  const data = useSensorData();

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="created_at" hide />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ax" stroke="#ff0000" dot={false} />
        <Line type="monotone" dataKey="ay" stroke="#00ff00" dot={false} />
        <Line type="monotone" dataKey="az" stroke="#0000ff" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
