import { Tabs } from "antd";
import { CgClose } from "react-icons/cg";
import { GrSelect } from "react-icons/gr";
import useUIStore from "../../assets/store/UI/UIState";
import "./QuotationReightbar.css";
const RightBar = ({
  selectedItem,
  rightBarHeaderConfig,
  rightBarFooterConfig,
  tabs,
  headerTheme,
  statusColors,
}) => {
  let isRightBarOpen = useUIStore((state) => state.isRightBarOpen);
  const ToggleRightBar = useUIStore((state) => state.toggleRightBar);
  const isMobileView = useUIStore((state) => state.isMobileView);
  return (
    <div
      className={`${isRightBarOpen ? "rightbar-conatiner" : "closed-rightbar"} main-rightbar`}
      style={{ paddingTop: isMobileView ? "40px" : "" }}
    >
      {selectedItem ? (
        <>
          {isMobileView && <span className="close-icon" onClick={ToggleRightBar}>
            <CgClose />
          </span>}
          <div className="rightbar-header">
            <div className="rightbar-title">
              <h4 style={{ width: "100%" }}>
                {selectedItem ? (
                  <RightBarHeader
                    selectedItem={selectedItem}
                    rightBarHeaderConfig={rightBarHeaderConfig}
                    headerTheme={headerTheme}
                    statusColors={statusColors}
                  />
                ) : (
                  "Select an Item"
                )}
              </h4>
            </div>
          </div>

          <Tabs defaultActiveKey="1" items={tabs} centered />

          <div className="footer-RightBar" style={{ display: "flex", flexDirection: "column", alignItems: "end", height: "92px", paddingBlock: "5px" }}>
            <div style={{ height: "100%", overflowY: "auto", width: "60%" }}>
              {rightBarFooterConfig?.length > 0 ? (
                rightBarFooterConfig?.map((config, index) => (
                  <div className="footer-rightbar-info" key={index}>
                    <div className="footer-rightbar-title">{config?.title}</div>
                    <div className="footer-rightbar-value">: {config?.value}</div>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="select-item">
            <h4>Select an Item</h4>
            <GrSelect style={{ height: "50px", width: "50px" }} />
          </div>
          <span className="close-icon" onClick={ToggleRightBar}>
            <CgClose />
          </span>
        </>
      )}
    </div>
  );
};

function RightBarHeader({
  selectedItem,
  rightBarHeaderConfig = [],
  headerTheme = 1,
  statusColors = {},
}) {
  if (!selectedItem) return null;

  return (
    <>
      {headerTheme === 1 ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1.4fr",
              gap: "10px 30px",
              alignItems: "start",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                paddingLeft: "10px",
                paddingTop: "2px",
              }}
            >
              <div
                style={{
                  marginBottom: "3px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "200px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h2
                  style={{
                    color: "var(--text-color)",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {rightBarHeaderConfig[0]?.title}
                </h2>
                <div
                  style={{
                    color: "var(--text-color)",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "inline-block",
                    maxWidth: "100%",
                    verticalAlign: "bottom",
                    marginBottom: "1px",
                  }}
                >
                  {rightBarHeaderConfig[0]?.value}
                </div>
                <div
                  style={{
                    color: "var(--text-color)",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "inline-block",
                    maxWidth: "100%",
                    verticalAlign: "bottom",
                    marginBottom: "1px",
                  }}
                >
                  {rightBarHeaderConfig[1]?.value}
                </div>
              </div>
            </div>
            <div className="data-box">
              <div
                style={{
                  marginInline: "auto",
                  color: "#3e47fa",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: "7px", fontSize: "12px" }}>
                  {rightBarHeaderConfig[2]?.title}
                </div>
                <div style={{ fontSize: "12px" }}>
                  {rightBarHeaderConfig[2]?.value}
                </div>
              </div>
            </div>
            <div
              className="data-box"
            // style={{
            //   paddingBlock: "7px !important",
            // }}
            >
              <div
                style={{
                  marginInline: "auto",
                  color: "#3e47fa",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: "0px", fontSize: "12px" }}>
                  {rightBarHeaderConfig[3]?.title}
                </div>
                <div
                  className="header-ridebar"
                  style={{
                    backgroundColor: "white",
                    fontSize: "16px",
                    borderRadius: "10px",
                    marginBlock: "0",
                    paddingBlock: "0",
                    alignItems: "center",
                  }}
                >
                  {rightBarHeaderConfig[3]?.value && (
                    <div className="status-capsule">
                      <span
                        className="circle"
                        style={{
                          backgroundColor:
                            statusColors[rightBarHeaderConfig[3]?.value] ||
                            "var(--status-neutral)",
                          width: "10px",
                        }}
                      ></span>
                      <p style={{ display: "block", color: "#202124" }}>
                        {rightBarHeaderConfig[3]?.value}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="data-box">
              <div
                className="box"
                style={{
                  marginInline: "auto",
                  color: "#3e47fa",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: "7px", fontSize: "12px" }}>
                  {rightBarHeaderConfig[4]?.title}
                </div>
                <div style={{ fontSize: "12px" }}>
                  {rightBarHeaderConfig[4]?.value}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1.4fr",
            gap: "10px 30px",
            alignItems: "start",
            width: "100%",
          }}
        >
          <div className="data-box">
            <div
              className="box"
              style={{
                marginInline: "auto",
                color: "#3e47fa",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "7px", fontSize: "12px" }}>
                {rightBarHeaderConfig[0]?.title}
              </div>
              <div style={{ fontSize: "12px" }}>
                {rightBarHeaderConfig[0]?.value}
              </div>
            </div>
          </div>
          <div className="data-box">
            <div
              className="box"
              style={{
                marginInline: "auto",
                color: "#3e47fa",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "7px", fontSize: "12px" }}>
                {rightBarHeaderConfig[1]?.title}
              </div>
              <div style={{ fontSize: "12px" }}>
                {rightBarHeaderConfig[1]?.value}
              </div>
            </div>
          </div>
          <div className="data-box">
            <div
              className="box"
              style={{
                marginInline: "auto",
                color: "#3e47fa",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "7px", fontSize: "12px" }}>
                {rightBarHeaderConfig[2]?.title}
              </div>
              <div style={{ fontSize: "12px" }}>
                {rightBarHeaderConfig[2]?.value}
              </div>
            </div>
          </div>
          <div className="data-box">
            <div
              className="box"
              style={{
                marginInline: "auto",
                color: "#3e47fa",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "7px", fontSize: "12px" }}>
                {rightBarHeaderConfig[3]?.title}
              </div>
              <div style={{ fontSize: "12px" }}>
                {rightBarHeaderConfig[3]?.value}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RightBar;
