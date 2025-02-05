import React, { useEffect, useRef } from 'react';
import { crockery, light ,tv,table,falseceiling,furniture,wallpaint,wallpaper,bathroom,wardrobe,bedroom} from "../../../assets/constant";

const SlidingSection = () => {
  const items = [
    { icon: crockery, label: 'Crockery Units' },
    { icon: light, label: 'Lights' },
    { icon: tv, label: 'TV units' },
    { icon: table, label: 'Study Table' },
    { icon: falseceiling, label: 'False Ceiling' },
    { icon: furniture, label: 'Space Saving Furniture' },
    { icon: wallpaint, label: 'Wall Paint' },
    { icon: wallpaper, label: 'Wallpaper' },
    { icon: bathroom, label: 'Bathroom' },
    { icon: wardrobe, label: 'Storage and Wardrobe' },
    { icon: bedroom, label: 'Kids Bedroom' }
  
  ];

  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const scrollInterval = setInterval(() => {
      if (scrollContainer) {
        scrollAmount += 1;
        scrollContainer.scrollLeft = scrollAmount;

      
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0; 
        }
      }
    }, 30); 
    return () => clearInterval(scrollInterval);
  }, []);

  return (

    <div ref={scrollRef} className=" w-full overflow-x-auto bg-[#2c2c2c] whitespace-nowrap hide-scrollbar">

      <div className="flex space-x-4 px-1  py-4">
        {items.concat(items).map((item, index) => (
         
          <div
            key={index}
            className="flex  items-center justify-center bg-[#2c2c2c] text-white rounded-2xl gap-4 p-4 min-w-[200px] border border-[#606060] hover:shadow-lg transition-transform duration-300 transform hover:scale-105"
          >
            <img src={item.icon} alt={item.label} className="h-8 w-6 object-contain" />
            <p className="text-sm font-semibold text-center break-words">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlidingSection;
