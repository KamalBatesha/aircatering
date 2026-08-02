export function CheckTierTwoActive(tierTwoPath) {
  const tierTwoRoot = tierTwoPath.split("/").slice(0, 3).join("/");
  const currentRoot = window.location.pathname.split("/").slice(0, 3).join("/");
  return tierTwoRoot === currentRoot;
}
