import { useEffect, useState } from "react";
import useMenuAuth from "../../Pages/Mutations/MenuMutations/MenuAuth";

const RightBarPreview = ({selectedItem, rightBarPreviewConfig, print = true}) => {
  const [isPrint, setIsPrint] = useState(false);

  const { menuItemActions3auth } = useMenuAuth();
  useEffect(() => {
    if (menuItemActions3auth) {
      if (menuItemActions3auth?.length > 0) {
        menuItemActions3auth.forEach((action) => {
          if (action?.actionName?.toLowerCase().includes("print")) {
            setIsPrint(true);
          }
        });
      }
    }
  }, [menuItemActions3auth]);

  const Field = (label, value) => (
    <div className="previewcontent">
      <h5 style={{ width: "100%", fontWeight: "400" }}>{label}</h5>
      <p style={{ fontWeight: "400", minWidth: "100%" }}>: {value ?? "N/A"}</p>
    </div>
  );

  const Section = (title, content) => (
    <div class="content-body" style={{ marginLeft: "16px" }}>
      <div
        style={{
          marginBlock: "15px",
          marginBottom: "2px",
          fontWeight: 500,
          fontSize: "12px",
          fontStyle: "italic",
          color: "var(--text-color)",
        }}
      >
        {title}
      </div>
      {content}
    </div>
  );
    if (!selectedItem) return null;

  return (
    <div className="tab-preview">
      {selectedItem ? (
        <div className="rightbar-preview" style={{ justifyContent: "start" }}>
          <div className="preview-body" id={isPrint && print && "printable-rightbar"}>
            {
              rightBarPreviewConfig?.map((section, index) => (
                <>
                {Section(
                  section?.title,
                  <>
                    {section?.fields?.map((field, idx) => (
                      <>
                        {Field(field?.label, field?.value)}
                      </>
                    ))}
                  </>
                )}
                </>
              ))
              
            }
          </div>
        </div>
      ) : (
        <div className="logs-empty no-content">No Data available.</div>
      )}
    </div>
  );
};

export default RightBarPreview;
