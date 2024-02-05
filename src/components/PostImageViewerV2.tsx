"use client";

import { InstaImage } from "@/schemas/instagram";
import Image from "next/image";
import { debounce } from "radash";
import { MouseEvent, useCallback, useMemo, useRef, useState } from "react";

type Props = {
  images: InstaImage[];
};

const PostImageViewerV2 = ({ images }: Props) => {
  const imageContainerRef = useRef<HTMLUListElement>(null);

  const [targetIndex, setTargetIndex] = useState(0);

  const handlePrev = useCallback(() => {
    const isLastIndex = targetIndex === 0;

    if (isLastIndex) {
      return;
    }

    setTargetIndex(prev => prev - 1);
  }, [targetIndex]);

  const handleNext = useCallback(() => {
    const isLastIndex = targetIndex === images.length - 1;

    if (isLastIndex) {
      return;
    }

    setTargetIndex(prev => prev + 1);
  }, [images.length, targetIndex]);

  // MouseDrag Scroll
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    console.log("handleMouseDown");
    const imageContainer = imageContainerRef.current;
    if (!imageContainer) {
      return;
    }

    setIsMouseDown(true);
    setStartX(e.pageX - imageContainer.offsetLeft);
    setScrollLeft(imageContainer.scrollLeft);
  }, []);

  const handleMouseLeave = useCallback(() => {
    console.log("handleMouseLeave");

    setIsMouseDown(false);
  }, []);

  const handleMouseUp = useCallback(() => {
    console.log("handleMouseUp");
    setIsMouseDown(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault(); // Prevent text selection

      const imageContainer = imageContainerRef.current;

      if (!isMouseDown || !imageContainer) {
        return;
      }
      // console.log("handleMouseMove");

      const endX = e.pageX - imageContainer.offsetLeft;
      const SCROLL_SPEED = 3;
      const distance = (endX - startX) * SCROLL_SPEED;

      imageContainer.scrollLeft = scrollLeft - distance;
      console.log(
        "scrollLeft",
        imageContainer.scrollLeft,
        scrollLeft,
        distance,
      );
    },
    [isMouseDown, scrollLeft, startX],
  );

  const debouncedHandleMouseMove = useMemo(
    () => debounce({ delay: 0 }, handleMouseMove),
    [handleMouseMove],
  );
  // MouseDrag Scroll

  return (
    <div className="relative">
      <div className="w-full" style={{ paddingBottom: "100%" }} />
      <div className="absolute inset-0">
        <div className="w-full h-full relative overflow-hidden">
          <ul
            className="flex bg-yellow-50 h-full w-full overflow-x-scroll snap-x snap-mandatory scroll-smooth no-scrollbar scrolling-touch"
            ref={imageContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {images.map(image => (
              <li
                key={image.id}
                className="relative flex-none h-full w-full snap-start"
              >
                <Image
                  src={image.url}
                  alt="이미지"
                  className="object-cover h-full w-full"
                  fill
                  sizes="573px"
                  draggable={true}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostImageViewerV2;
