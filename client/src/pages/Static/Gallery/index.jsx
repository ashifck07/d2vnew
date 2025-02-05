
// import React, { useEffect } from "react";
// import "./style.css";
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import {
//   galleryone,
//   bedroomone,
//   bedroomtwo,
//   bedroomthree,
//   lightone,
//   lighttwo,
//   lightthree,
//   lightfour,
//   // wardrobe,
//   wardrobetwo,
//   wardrobethree,
//   falseceilingone,
//   falseceilingtwo,
//   WardobeImage,
// } from "../../../assets/constant";
// const Gallery = () => {
//   useEffect(() => {
//     AOS.init();
//   }, [])
//   return (
//     <div className="gallery-container hide-scrollbar  mt-10">
//       <div id="gallery" className="py-10 hide-scrollbar Overflow-hidden z-[2px]">
        
//         <div className="mb-10">
//           <h2 className="text-xl font-semibold text-[#996830cc] leading-[20px] mb-2">
//             <span className="border-t border-[#996830cc] w-12 inline-block mr-2 mb-1"></span>GALLERY
//           </h2>
//           <h1 className="font-normal text-4xl md:text-4xl leading-[50px] md:leading-[50px] font-Playfair w-[290px]">
//             Some of our crafts   made with love
//           </h1>
         
//         </div>
//         <div className="gallerylapsize">
//           <div className="flex flex-col md:flex-row gap-3 justify-center">
//             <div className="flex-1 flex flex-col gap-4" data-aos="fade-up"
//               data-aos-anchor-placement="top-bottom" data-aos-duration="1000">
//               <div className="rounded-md overflow-hidden">
//                 <img src={galleryone} alt="Gallery One" className="w-full object-cover" />
//               </div>
//               <div className="rounded-md overflow-hidden " data-aos="fade-up" data-aos-duration="1000" >
//                 <img src={bedroomtwo} alt="Bedroom Two" className="w-full object-cover " />
//               </div>
//               <div className="rounded-md overflow-hidden text-center" data-aos="fade-up" data-aos-duration="1000" >
//                 <h2 className="text-3xl md:text-5xl font-Playfair font-medium text-[#996830] my-4 text-center">Lights</h2>
//                 <img src={lightone} alt="Light One" className="w-full object-cover " />
//               </div>
//               <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
//                 <img src={lightthree} alt="Light Three" className="w-full object-cover" />
//                 <h2 className="text-3xl md:text-5xl font-Playfair font-medium text-[#996830] text-center mt-10">
//                   Wardrobes
//                 </h2>
//               </div>
//             </div>
//             <div className="flex flex-1  flex-col gap-4">
//               <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-duration="1000">
//                 <img src={bedroomone} alt="Bedroom One" className="w-full object-cover " />
//               </div>
//               <div className="rounded-md overflow-hidden text-center" data-aos="fade-up" data-aos-duration="1000" >
//                 <h2 className="text-3xl md:text-5xl leading-[50px] md:leading-[72px] font-Playfair font-medium text-[#996830] mb-3">
//                   Bedrooms
//                 </h2>
//                 <img src={bedroomthree} alt="Bedroom Three" className="w-full object-cover" />
//               </div>
//               <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
//                 <img src={lighttwo} alt="Light Two" className="w-full object-cover" />
//               </div>
//               <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
//                 <img src={lightfour} alt="Light Four" className="w-full object-cover" />
//               </div>
//             </div>
//           </div>
//           {/* Wardrobe Section */}
//           <div className="flex justify-center my-3" data-aos="fade-up" data-aos-duration="1000" >
//             <img src={WardobeImage} alt="Wardrobe" className="object-cover max-w-md md:max-w-full" />
//           </div>
//           {/* Second Photo Gallery */}
//           <div className="flex flex-col md:flex-row gap-3 justify-center" data-aos="fade-up" data-aos-duration="1000" >
//             <div className="flex gap-2.5 flex-col">
//               <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
//                 <img src={wardrobetwo} alt="Wardrobe Two" className="w-full object-cover" />
//               </div>
//               <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
//                 <img src={falseceilingtwo} alt="False Ceiling Two" className="w-full object-cover" />
//               </div>
//             </div>
//             <div className="flex flex-col gap-5">
//               <div className="rounded-md overflow-hidden text-center" data-aos="fade-up" data-aos-duration="1000" >
//                 <img src={wardrobethree} alt="Wardrobe Three" className="w-full object-contain" />
//                 <h2 className="text-3xl md:text-5xl leading-[50px] md:leading-[76px] font-Playfair font-medium text-[#996830] mt-4 text-center">
//                   False Ceiling
//                 </h2>
//               </div>
//               <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
//                 <img src={falseceilingone} alt="False Ceiling One" className="w-full object-cover" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

// {/* mobile size */}
//       <div className="hide-scrollbar Overflow-hidden">
//       <div className="gallerymobilesize flex flex-col gap-24">
//         <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
//           <img src={galleryone} alt="Gallery One" className="w-full object-cover" />
//         </div>
//         <div>
//           <h2 className="text-3xl md:text-5xl leading-[50px] md:leading-[72px] font-Playfair font-medium text-[#996830] mb-3 text-center">
//             Bedrooms
//           </h2>
//         </div>
//         <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-duration="1000">
//           <img src={bedroomone} alt="Bedroom One" className="w-full object-cover" />
//         </div>
//         <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
//           <img src={bedroomtwo} alt="Bedroom Two" className="w-full object-cover mt-5" />
//         </div>
//         <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
//           <img src={bedroomthree} alt="Bedroom Three" className="w-full object-cover" />
//         </div>
//         <div data-aos="fade-up" data-aos-duration="1000" >
//           <h2 className="text-3xl md:text-5xl font-Playfair font-medium text-[#996830] my-4 text-center">Lights</h2>

//         </div>
//         <div className="mt-5"  data-aos="fade-up" data-aos-duration="1000" >
//           <img src={lightone} alt="Light One" className="w-full object-cover" />
//         </div>
//         <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
//           <img src={lighttwo} alt="Light Two" className="w-full object-cover" />
//         </div>

//         <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
//           <img src={lightthree} alt="Light Three" className="w-full object-cover" />
//         </div>
//         <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
//           <img src={lightfour} alt="Light Four" className="w-full object-cover" />
//         </div>
//         <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >

//           <h2 className="text-3xl md:text-5xl font-Playfair font-medium text-[#996830] text-center mt-10">
//             Wardrobes
//           </h2>
//         </div>
//         <div className="rounded-md overflow-hidden mt-5 " data-aos="fade-up" data-aos-duration="1000" >
//           <img src={WardobeImage} alt="Wardrobe" className="w-full object-contain" />
//         </div>
//         <div className="rounded-md overflow-hidden text-center mt-5" data-aos="fade-up" data-aos-duration="1000" >
//           <img src={wardrobethree} alt="Wardrobe Three" className="w-full object-contain" />
//         </div>
//         <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
//           <img src={wardrobetwo} alt="Wardrobe Two" className="w-full object-cover" />
//         </div>
//         <div className="rounded-md overflow-hidden text-center mt-5" data-aos="fade-up" data-aos-duration="1000" >

//           <h2 className="text-3xl md:text-5xl leading-[50px] md:leading-[76px] font-Playfair font-medium text-[#996830] mt-4">
//             False Ceiling
//           </h2>
//         </div>
//         <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
//           <img src={falseceilingone} alt="False Ceiling One" className="w-full object-cover" />
//         </div>
//         <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
//           <img src={falseceilingtwo} alt="False Ceiling Two" className="w-full object-cover" />
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };
// export default Gallery;

import React, { useEffect } from "react";
import "./style.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  galleryone,
  bedroomone,
  bedroomtwo,
  bedroomthree,
  lightone,
  lighttwo,
  lightthree,
  lightfour,
  wardrobetwo,
  wardrobethree,
  falseceilingone,
  falseceilingtwo,
  WardobeImage,
} from "../../../assets/constant";
const Gallery = () => {
  useEffect(() => {
    AOS.init();
  }, [])
  return (
    <div className="custom-container  hide-scrollbar overflow-hidden">
      <div id="gallery" className="py-5 ">
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-[#996830cc] leading-[20px] mb-2">
            <span className="border-t border-[#996830cc] w-12 inline-block mr-2 mb-1"></span>GALLERY
          </h2>
          <h1 className="font-normal text-4xl md:text-4xl leading-[50px] md:leading-[50px] font-Playfair w-[290px]">
            Some of our crafts   made with love
          </h1>
        </div>
        <div className="gallerylapsize">
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <div className="flex  flex-col gap-4 w-full" data-aos="fade-up"
              data-aos-anchor-placement="top-bottom" data-aos-duration="1000">
              <div className="rounded-md overflow-hidden">
                <img src={galleryone} alt="Gallery One" className="w-full object-cover" />
              </div>
              <div className="rounded-md overflow-hidden " data-aos="fade-up" data-aos-duration="1000" >
                <img src={bedroomtwo} alt="Bedroom Two" className="w-full object-cover " />
              </div>
              <div className="rounded-md overflow-hidden text-center" data-aos="fade-up" data-aos-duration="1000" >
                <h2 className="text-3xl md:text-5xl font-Playfair font-medium text-[#996830] my-4 text-center">Lights</h2>
                <img src={lightone} alt="Light One" className="w-full object-cover " />
              </div>
              <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
                <img src={lightthree} alt="Light Three" className="w-full object-cover" />
                <h2 className="text-3xl md:text-5xl font-Playfair font-medium text-[#996830] text-center mt-10">
                  Wardrobes
                </h2>
              </div>
            </div>
            <div className="flex   flex-col gap-4 w-full">
              <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-duration="1000">
                <img src={bedroomone} alt="Bedroom One" className="w-full object-cover " />
              </div>
              <div className="rounded-md overflow-hidden text-center" data-aos="fade-up" data-aos-duration="1000" >
                <h2 className="text-3xl md:text-5xl leading-[50px] md:leading-[72px] font-Playfair font-medium text-[#996830] mb-3">
                  Bedrooms
                </h2>
                <img src={bedroomthree} alt="Bedroom Three" className="w-full object-cover" />
              </div>
              <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
                <img src={lighttwo} alt="Light Two" className="w-full object-cover" />
              </div>
              <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
                <img src={lightfour} alt="Light Four" className="w-full object-cover" />
              </div>
            </div>
          </div>
          {/* Wardrobe Section */}
          <div className="flex justify-center my-3" data-aos="fade-up" data-aos-duration="1000" >
            <img src={WardobeImage} alt="Wardrobe" className="object-cover w-full" />
          </div>
          {/* Second Photo Gallery */}
          <div className="flex flex-col md:flex-row gap-3 justify-center w-full" data-aos="fade-up" data-aos-duration="1000" >
            <div className="flex gap-2.5 flex-col w-full">
              <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
                <img src={wardrobetwo} alt="Wardrobe Two" className="w-full  object-cover" />
              </div>
              <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
                <img src={falseceilingtwo} alt="False Ceiling Two" className="w-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col  w-full">
              <div className="rounded-md overflow-hidden text-center" data-aos="fade-up" data-aos-duration="1000" >
                <img src={wardrobethree} alt="Wardrobe Three" className="w-full rounded-xl h-[420px] object-cover" />
                <h2 className="text-3xl md:text-5xl leading-[50px] md:leading-[76px] font-Playfair font-medium text-[#996830]  text-center">
                  False Ceiling
                </h2>
              </div>
              <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
                <img src={falseceilingone} alt="False Ceiling One" className="w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
{/* mobile size */}
      <div className="hide-scrollbar Overflow-visible">
      <div className="gallerymobilesize flex flex-col gap-24">
        <div className="rounded-md overflow-hidden" data-aos="fade-up" data-aos-duration="1000" >
          <img src={galleryone} alt="Gallery One" className="w-full object-cover" />
        </div>
        <div>
          <h2 className="text-3xl md:text-5xl leading-[50px] md:leading-[72px] font-Playfair font-medium text-[#996830] mb-3 text-center">
            Bedrooms
          </h2>
        </div>
        <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-duration="1000">
          <img src={bedroomone} alt="Bedroom One" className="w-full object-cover" />
        </div>
        <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
          <img src={bedroomtwo} alt="Bedroom Two" className="w-full object-cover mt-5" />
        </div>
        <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
          <img src={bedroomthree} alt="Bedroom Three" className="w-full object-cover" />
        </div>
        <div data-aos="fade-up" data-aos-duration="1000" >
          <h2 className="text-3xl md:text-5xl font-Playfair font-medium text-[#996830] my-4 text-center">Lights</h2>
        </div>
        <div className="mt-5"  data-aos="fade-up" data-aos-duration="1000" >
          <img src={lightone} alt="Light One" className="w-full object-cover" />
        </div>
        <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
          <img src={lighttwo} alt="Light Two" className="w-full object-cover" />
        </div>
        <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
          <img src={lightthree} alt="Light Three" className="w-full object-cover" />
        </div>
        <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
          <img src={lightfour} alt="Light Four" className="w-full object-cover" />
        </div>
        <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
          <h2 className="text-3xl md:text-5xl font-Playfair font-medium text-[#996830] text-center mt-10">
            Wardrobes
          </h2>
        </div>
        <div className="rounded-md overflow-hidden mt-5 " data-aos="fade-up" data-aos-duration="1000" >
          <img src={WardobeImage} alt="Wardrobe" className="w-full object-contain" />
        </div>
        <div className="rounded-md overflow-hidden text-center mt-5" data-aos="fade-up" data-aos-duration="1000" >
          <img src={wardrobethree} alt="Wardrobe Three" className="w-full object-contain" />
        </div>
        <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
          <img src={wardrobetwo} alt="Wardrobe Two" className="w-full object-cover" />
        </div>
        <div className="rounded-md overflow-hidden text-center mt-5" data-aos="fade-up" data-aos-duration="1000" >
          <h2 className="text-3xl md:text-5xl leading-[50px] md:leading-[76px] font-Playfair font-medium text-[#996830] mt-4">
            False Ceiling
          </h2>
        </div>
        <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
          <img src={falseceilingone} alt="False Ceiling One" className="w-full object-cover" />
        </div>
        <div className="rounded-md overflow-hidden mt-5" data-aos="fade-up" data-aos-duration="1000" >
          <img src={falseceilingtwo} alt="False Ceiling Two" className="w-full object-cover" />
        </div>
      </div>
    </div>
    </div>
  );
};
export default Gallery;















