import { useEffect, useState } from "react";

const Countdown = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, Number(expiryDate) - Date.now()),
  );

  useEffect(() => {
  const updateCountdown = () => {
    setTimeLeft(Math.max(0, Number(expiryDate) - Date.now()));
  };

  updateCountdown();

  if (Number(expiryDate) <= Date.now()) return;

  const interval = setInterval(() => {
    updateCountdown();

    if (Number(expiryDate) <= Date.now()) {
      clearInterval(interval);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [expiryDate]);

  const totalSeconds = Math.floor(timeLeft / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="de_countdown">
      {timeLeft === 0 ? "Auction Ended" : `${hours}h ${minutes}m ${seconds}s`}
    </div>
  );
};

export default Countdown;
