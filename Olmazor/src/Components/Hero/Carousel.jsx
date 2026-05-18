import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const images = [
  "https://i7.photo.2gis.com/main/branch/208/70000001080014335/common",
  "https://i7.photo.2gis.com/main/branch/208/70000001080014335/common",
  "https://i7.photo.2gis.com/main/branch/208/70000001080014335/common",
  "https://i7.photo.2gis.com/main/branch/208/70000001080014335/common",
  "https://i7.photo.2gis.com/main/branch/208/70000001080014335/common",
  "https://i7.photo.2gis.com/main/branch/208/70000001080014335/common",
  "https://i7.photo.2gis.com/main/branch/208/70000001080014335/common",
  "https://i7.photo.2gis.com/main/branch/208/70000001080014335/common",
  "https://i7.photo.2gis.com/main/branch/208/70000001080014335/common",
];

const Carousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setIndex((p) => (p + 1) % images.length);
    }, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="w-full h-[420px] sm:h-[520px] lg:h-[600px] object-cover"
        />
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-6 rounded-full ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
