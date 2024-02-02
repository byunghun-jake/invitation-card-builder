import { debounce } from "radash";
import { useEffect } from "react";

type Props = {
  divRef: React.RefObject<HTMLDivElement>;
};

const useFullHeight = ({ divRef }: Props) => {
  useEffect(() => {
    const div = divRef.current;

    if (!div) {
      return;
    }

    const setHeight = debounce({ delay: 100 }, () => {
      div.style.height = `${window.innerHeight}px`;
      console.log("setHeight");
    });

    setHeight();
    window.addEventListener("resize", setHeight);

    return () => {
      window.removeEventListener("resize", setHeight);
    };
  }, []);
};

export default useFullHeight;
