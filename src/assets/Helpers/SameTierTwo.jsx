function useIsSameTierTwo(path1, path2) {
  const normalize = (path) => path.replace(/\/+$/, "").trim(); // remove trailing slashes

  const splitPath = (path) => normalize(path).split("/");

  const segments1 = splitPath(path1);
  const segments2 = splitPath(path2);

  // If both paths are exactly the same
  if (normalize(path1) === normalize(path2)) return true;

  // If all segments match except the last
  if (
    segments1.length === segments2.length &&
    segments1.slice(0, -1).every((seg, i) => seg === segments2[i])
  ) {
    return true;
  }

  return false;
}

export default useIsSameTierTwo;
