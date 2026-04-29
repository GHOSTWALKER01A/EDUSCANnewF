import React from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { Activity } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function AttendanceChart() {
  const chartData = {
    labels: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
    datasets: [
      {
        label: "Attendance Rate (%)",
        data: [85, 90, 88, 95, 92, 96],
        borderColor: "#8b5cf6", // var(--accent) representation in hex
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(139, 92, 246, 0.4)");
          gradient.addColorStop(1, "rgba(139, 92, 246, 0.0)");
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#8b5cf6",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4, 
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: true,
        labels: { color: "rgba(255, 255, 255, 0.7)" }
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)", // slate-900
        titleColor: "#fff",
        bodyColor: "rgba(255, 255, 255, 0.8)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
             return context.parsed.y + "%";
          }
        }
      }
    },
    scales: { 
      x: { 
        grid: { color: "rgba(255, 255, 255, 0.05)", drawBorder: false },
        ticks: { color: "rgba(255, 255, 255, 0.6)" }
      },
      y: { 
        beginAtZero: true, 
        max: 100,
        grid: { color: "rgba(255, 255, 255, 0.05)", drawBorder: false },
        ticks: { color: "rgba(255, 255, 255, 0.6)" }
      } 
    },
  };

  return (
    <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
          <Activity size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Attendance Overview</h2>
      </div>
      <div className="bg-[var(--card-bg)]/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-black/5 border border-[var(--border-color)]/30 h-[450px] relative overflow-hidden">
        <Line data={chartData} options={chartOptions} />
      </div>
    </motion.section>
  );
}
