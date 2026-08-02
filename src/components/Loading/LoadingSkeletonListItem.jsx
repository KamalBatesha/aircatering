import "react-loading-skeleton/dist/skeleton.css";

import Skeleton from "react-loading-skeleton";

function LoadingSkeletonListItem() {
  return (
    <li className="nav-item">
      <Skeleton circle={true} height={30} width={30} baseColor="lightgray" />
      <h6>
        <Skeleton width={100} height={30} baseColor="lightgray" />
      </h6>
    </li>
  );
}

export default LoadingSkeletonListItem;
