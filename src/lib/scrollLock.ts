let activeLocks = 0;
let previousOverflow = "";

// Modals may unmount in either order, including during route changes.
export function lockPageScroll() {
  if (activeLocks === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  activeLocks += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    activeLocks -= 1;
    if (activeLocks === 0) document.body.style.overflow = previousOverflow;
  };
}
