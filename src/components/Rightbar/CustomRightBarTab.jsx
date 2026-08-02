import Loading from "../Loading/Loading";

const CustomRightBarTab = ({
  data,
  isLoading,
  selectedItem,
  customRightBarConfig,
}) => {
  
  return (
    <div className="tab-preview">
      {selectedItem ? (
        <div className="">
          {isLoading ? (
            <Loading />
          ) : data?.length > 0 ? (
            <div className="items-preview-container">
              {/* Header */}
              <div className="items-preview" style={{marginBottom: "5px", borderBottom: "1px dashed #ccc", padding: "8px 0px"}}>
                {customRightBarConfig.map((col, index) => (
                  <h5
                    key={index}
                    style={{
                      textAlign: "left",
                      flex: index === 0 ? 2 : 1,
                      fontSize: "13px",
                    }}
                  >
                    {col.label}
                  </h5>
                ))}
              </div>

              {/* Rows */}
              {data.map((item, rowIndex) => (
                <div key={rowIndex} className="items-preview">
                  {customRightBarConfig.map((col, colIndex) => (
                    <p
                      key={colIndex}
                      style={{
                        textAlign: "left",
                        flex: colIndex === 0 ? 2 : 1,
                        fontSize: "12px",
                      }}
                    >
                      {col.render ? col.render(item) : item[col.value]}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="logs-empty no-content">No Data available.</div>
          )}
        </div>
      ) : (
        <div className="logs-empty no-content">Please Select an item.</div>
      )}
    </div>
  );
};

export default CustomRightBarTab;
