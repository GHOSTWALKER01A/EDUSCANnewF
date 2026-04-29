import { useState, useEffect } from 'react';

export function useSchedule<
  TSlot extends { time: string; recess?: boolean; subjects?: TSubject[] },
  TSubject extends { day: string; status: string }
>(initialData?: TSlot[], delayMs: number = 600) {
  const [selectedDay, setSelectedDay] = useState<string>("monday");
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState<TSlot[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<(TSubject & { time: string }) | null>(null);

  // Floating Tooltip State
  const [hoveredData, setHoveredData] = useState<(TSubject & { time: string }) | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!initialData) return; // Skip mock loading if no initial data provided
    
    let isMounted = true;
    setLoading(true);
    
    const timer = setTimeout(() => {
      if (isMounted) {
        setScheduleData(initialData);
        setLoading(false);
      }
    }, delayMs);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [initialData, delayMs]);

  const handleMouseMove = (e: React.MouseEvent, subject: TSubject, time: string) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setHoveredData({ ...subject, time });
  };

  const handlePeriodClick = (subject: TSubject, time: string) => {
    setSelectedPeriod({ ...subject, time });
    setIsModalOpen(true);
    setHoveredData(null);
  };

  const closeTooltip = () => setHoveredData(null);
  const closeModal = () => setIsModalOpen(false);

  return {
    selectedDay, setSelectedDay,
    loading, setLoading,
    scheduleData, setScheduleData,
    isModalOpen, setIsModalOpen, closeModal,
    selectedPeriod, setSelectedPeriod,
    hoveredData, setHoveredData, closeTooltip,
    mousePos,
    handleMouseMove,
    handlePeriodClick
  };
}
