import React, { useEffect, useState } from "react";

const CommentLoadingIndicator: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={"flex items-center justify-center space-x-1"}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`size-1.5 rounded-full bg-white transition-opacity duration-300 ${activeIndex === index ? "opacity-100" : "opacity-50"}`}
        />
      ))}
    </div>
  );
};

export default CommentLoadingIndicator;
