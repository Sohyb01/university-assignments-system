"use client";

import { Badge } from "@/components/ui/badge";
import { TriangleAlert } from "lucide-react";
import React, { useState, useEffect } from "react";

interface CountdownProps {
  endDate: Date;
}

const TimeLeftBadge: React.FC<CountdownProps> = ({ endDate }) => {
  // Calculate the initial remaining time in milliseconds
  const getRemainingTime = () => endDate.getTime() - Date.now();
  const [remainingTime, setRemainingTime] = useState<number>(
    getRemainingTime()
  );

  useEffect(() => {
    // Update the remaining time every second.
    const intervalId = setInterval(() => {
      setRemainingTime(getRemainingTime());
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate]);

  // If the remaining time is less than or equal to zero, the timestamp is in the past.
  if (remainingTime <= 0) {
    return null;
  }

  const oneDay = 24 * 60 * 60 * 1000;

  // If more than or equal to 24 hours remain, show days left.
  if (remainingTime >= oneDay) {
    const daysLeft = Math.floor(remainingTime / oneDay);
    return (
      <Badge variant="secondary" className="gap-2 w-fit">
        <TriangleAlert size={16} />
        {daysLeft} {daysLeft === 1 ? "day" : "days"} left
      </Badge>
    );
  } else {
    // Otherwise, display hours, minutes, and seconds.
    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    // A helper function to pad numbers with a leading zero if necessary.
    const pad = (num: number) => num.toString().padStart(2, "0");

    return (
      <Badge variant="secondary" className="gap-2 w-fit">
        <TriangleAlert size={16} />
        {pad(hours)}:{pad(minutes)}:{pad(seconds)} left
      </Badge>
    );
  }
};

export default TimeLeftBadge;
