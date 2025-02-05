import { useEffect } from "react";
const TawkTo = () => {
  useEffect(() => {
    if (!document.getElementById("tawkToScript")) {
      const script = document.createElement("script");
      script.id = "tawkToScript";
      script.async = true;
      script.src = "https://embed.tawk.to/677c0c80af5bfec1dbe769e7/1igu91m30";
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      document.body.appendChild(script);
    }
  }, []);
  return null;
};
export default TawkTo;