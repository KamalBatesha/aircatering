import { useEffect, useRef } from "react";

/**
 * A hook that enables horizontal scroll via mouse dragging.
 * It also prevents accidental clicks when a significant drag has occurred.
 *
 * @param {React.RefObject} ref - The ref of the scrollable container.
 * @returns {void}
 */
export default function useDraggableScroll(ref) {
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const slider = ref.current;
    if (!slider) return;

    const handleMouseDown = (e) => {
      isDown.current = true;
      slider.classList.add("active");
      startX.current = e.pageX - slider.offsetLeft;
      scrollLeft.current = slider.scrollLeft;
      isDragging.current = false;
    };

    const handleMouseLeave = () => {
      isDown.current = false;
      slider.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDown.current = false;
      slider.classList.remove("active");
    };

    const handleMouseMove = (e) => {
      if (!isDown.current) return;
      
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX.current);
      
      if (Math.abs(walk) > 5) {
        isDragging.current = true;
      }
      
      if (isDragging.current) {
        e.preventDefault();
        slider.scrollLeft = scrollLeft.current - walk;
      }
    };

    // Capture-phase listener to block clicks if we just finished a drag
    const handleCaptureClick = (e) => {
      if (isDragging.current) {
        e.preventDefault();
        e.stopPropagation();
        isDragging.current = false; // Reset for next interaction
      }
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);
    slider.addEventListener("click", handleCaptureClick, true); // true = capture phase

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
      slider.removeEventListener("click", handleCaptureClick, true);
    };
  }, [ref]);
}
