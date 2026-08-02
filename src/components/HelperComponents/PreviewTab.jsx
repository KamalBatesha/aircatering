import { Avatar } from "antd";
import zasImage from "/images/login-logo.png";
import { useNavigate } from "react-router-dom";

function PreviewTab({ PreviewTabConfig, statusColors = {} }) {
	const navigate = useNavigate();
  return (
    <div
      className="btns emp-preview-tab"
      style={{
        width: "fit-content",
        display: "flex",
        gap: "10px",
        alignItems: "center",
        fontWeight: "700",
        objectFit: "contain",
      }}
    >
      <Avatar
        alt={"zasImage"}
        src={zasImage}
        variant="square"
        sx={{
          cursor: "pointer",
          width: "40px",
          height: "40px",
          "& img": {
            objectFit: "contain",
          },
        }}
      >
        {/* {flight?.personalName?.charAt(0)?.toUpperCase()} */}
      </Avatar>
      <p id="deleteInSmallScreens" className="hide-on-small">
        <span style={{ color: "var(--primary-btn-color)" }}>
          {PreviewTabConfig[0]?.label}
        </span>{" "}
        : {PreviewTabConfig[0]?.value}
      </p>
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          backgroundColor: "var(--text-color)",
          borderRadius: "50%",
          marginInline: 3,
        }}
      />
      <p id="deleteInSmallScreens">
        <span style={{ color: "var(--primary-btn-color)" }}>
          {PreviewTabConfig[1]?.label}
        </span>{" "}
        : {PreviewTabConfig[1]?.value}
      </p>
      {PreviewTabConfig?.[3] && (
        <p
          id="deleteInSmallScreens"
          style={{
						cursor: PreviewTabConfig?.[3]?.link ? "pointer" : "default",
						textDecoration: PreviewTabConfig?.[3]?.link ? "underline" : "default",
          }}
          onClick={() => {
            if (PreviewTabConfig?.[3]?.link) {
              navigate(PreviewTabConfig?.[3]?.link);
            }
          }}
        >
          <span style={{ color: "var(--primary-btn-color)" }}>
            {PreviewTabConfig[3]?.label}
          </span>{" "}
          : {PreviewTabConfig[3]?.value}
        </p>
      )}
      {PreviewTabConfig?.[4] && (
        <p
					id="deleteInSmallScreens"
					style={{
						cursor: PreviewTabConfig?.[4]?.link ? "pointer" : "default",
						textDecoration: PreviewTabConfig?.[4]?.link ? "underline" : "default",
						
					}}
          onClick={() => {
            if (PreviewTabConfig?.[4]?.link) {
              navigate(PreviewTabConfig?.[4]?.link);
            }
          }}
        >
          <span style={{ color: "var(--primary-btn-color)" }}>
            {PreviewTabConfig[4]?.label}
          </span>{" "}
          : {PreviewTabConfig[4]?.value}
        </p>
      )}
      {PreviewTabConfig[2]?.value && (
        <div className="status-capsule hide-on-small">
          <span
            className="circle"
            style={{
              backgroundColor:
                statusColors[PreviewTabConfig[2]?.value] ||
                "var(--status-neutral)",
            }}
          ></span>
          <p style={{ display: "block" }}>{PreviewTabConfig[2]?.value}</p>
        </div>
      )}
    </div>
  );
}

export default PreviewTab;
