import React, { useEffect, useState } from "react";

function Accordion({
  children,
  allowMultiple = false,
  activeIndex = null,
  activeIndices = null,
  noAutoScroll = false,
}) {
  const [openSet, setOpenSet] = useState(new Set());

  useEffect(() => {
    // activeIndices takes priority — opens multiple panels at once
    if (activeIndices !== null) {
      setOpenSet(new Set(activeIndices));
      return;
    }
    if (activeIndex === null) return;
    const next = new Set();
    next.add(activeIndex);
    setOpenSet(next);
  }, [activeIndex, activeIndices]);

  const toggle = (index) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return React.Children.map(children, (child, idx) =>
    React.cloneElement(child, {
      isOpen: openSet.has(idx),
      onToggle: () => toggle(idx),
      index: idx,
      noAutoScroll,
    })
  );
}

export default Accordion;
