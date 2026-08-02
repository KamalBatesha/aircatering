import "./Loading.css";
function Loading({ fullScreen = false, gif = true, blackText = false }) {
  //console.log("Loading...");
  return (
    <div
      className={
        fullScreen
          ? "full-screen-loading loading-container"
          : "loading-container"
      }
    >
      <div className="loading-logo">
        {(fullScreen || blackText) ?
          <img src="/images/logo.png" alt="Loading..." />
          :
          <img src="/images/logo-dark.png" alt="Loading..." />
        }
      </div>
    </div>
  );
}

export default Loading;
