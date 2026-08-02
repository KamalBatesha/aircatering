import "./Logs.css";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router-dom";

import { GetLogs } from "../../assets/Api/Layout/LayoutAPI";
import useMenuStore from "../../assets/Zustand/MenuIems/MenuItems";
import LoadingSkeletonListItem from "../Loading/LoadingSkeletonListItem";
import useUIStore from "../../assets/Zustand/UI/UIState";
import useDateTime from "../../assets/Helpers/GetDateTime";

function Logs({ id, menuId, HR }) {
  const {
    data: logs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["logs", id, menuId],
    queryFn: () => GetLogs(menuId, id),
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });
  const { getDateOnly, getTimeOnly } = useDateTime();

  const [sortedLogs, setSortedLogs] = useState([]);
  useEffect(() => {
    if (logs && logs?.length > 0) {
      const sorted = logs.sort((a, b) => {
        return (
          new Date(b.programUserLogDateTime) -
          new Date(a.programUserLogDateTime)
        );
      });
      setSortedLogs(sorted);
    }
  }, [logs]);
  const selectedEmployee = useUIStore((state) => state.selectedEmployee);

  if (HR) {
    return (
      <div className="tab-preview">
        <div className="rightbar-preview">
          <div className="preview-body">
            {selectedEmployee?._IPersonalLogs?.length > 0 ? (
              selectedEmployee?._IPersonalLogs?.map((log, index) => (
                <div key={index}>
                  {Section(
                    `Log Information ${index + 1}`,
                    <>
                      {Field(
                        "Action By",
                        log.personalsLogCreatedBy
                      )}
                      {Field(
                        "Action Date",
                        `${getDateOnly(log.personalsLogDate)} ${getTimeOnly(
                          log.personalsLogDate
                        )}`,
                      )}
                      {Field(
                        "Department",
                        log.personalsLogDepartment
                      )}
                      {Field("Changes", log.personalsLogNote)}
                    </>,
                  )}
                </div>
              ))
            ) : (
              <div className="logs-empty no-content">No Activity in this Employee.</div>
            )}
          </div>
        </div>

      </div>
    )
  }
  if (!id || !menuId) {
    return <div className="logs-empty no-content">No logs available.</div>;
  }
  if (isLoading) {
    return (
      <>
        <span className="date">
          <Skeleton width={100} height={20} />
        </span>
        <div className="log-data">
          <span className="text-content">
            <Skeleton width={200} height={40} />
          </span>
        </div>
        <span className="date">
          <Skeleton width={100} height={20} />
        </span>
        <div className="log-data">
          <span className="text-content">
            <Skeleton width={200} height={40} />
          </span>
        </div>
        <span className="date">
          <Skeleton width={100} height={20} />
        </span>
        <div className="log-data">
          <span className="text-content">
            <Skeleton width={200} height={40} />
          </span>
        </div>
      </>
    );
  }

  if (!id || !menuId) {
    return <div className="logs-empty no-content">No logs available.</div>;
  }
  if (error) {
    return <div className="logs-error no-content">Failed to load logs.</div>;
  }

  if (!logs || logs?.length === 0) {
    return <div className="logs-empty no-content">No logs available.</div>;
  }
  return (
    <>
      <div className="logs-container">
        {sortedLogs?.map((log) => (
          <li className=" log-item" key={log.programUserLogId}>
            <div className="log-data">
              <span className="text-title">
                <b>{log.programUserLogUserName?.split("@")[0]} </b>
                {log.programUserLogText}
              </span>
              <span className="date">
                {dayjs(log.programUserLogDateTime).format("DD/MM/YYYY hh:mm A")}
              </span>
            </div>
          </li>
        ))}
      </div>
    </>
  );
}

export default Logs;


const Field = (label, value) => (
  <div className="previewcontent">
    <h5 style={{ width: "40%", fontWeight: "400" }}>{label}:</h5>
    <p style={{ fontWeight: "400" }}>{value ?? "N/A"}</p>
  </div>
);

const Section = (title, content) => (
  <div className="content-body" style={{ marginLeft: "16px" }}>
    <div
      style={{
        marginTop: "5px",
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