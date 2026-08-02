import "tui-image-editor/dist/tui-image-editor.css";

import { Autocomplete, TextField } from "@mui/material";
import ImageEditor from "@toast-ui/react-image-editor";
import { useRef, useState } from "react";
import { use } from "react";

import useAuthStore from "../../Zustand/Auth/UserAuth";
import TicketMutations from "./TicketMutations";

export default function ScreenShotEditor({ image, onSave, onClose }) {
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedReason, setSelectedReason] = useState(null);

  const editorRef = useRef();
  const user = useAuthStore((state) => state.user);
  const userShowFullData = useAuthStore((state) => state.userShowFullData);

  const handleSave = () => {
    const editorInstance = editorRef.current.getInstance();
    const dataUrl = editorInstance.toDataURL();
    onSave(dataUrl); // return edited image
  };

  const handleNextPage = () => {
    setPage(2);
  };

	const { newTicketMutation } = TicketMutations(onClose);
  function handleSubmit() {
    const editorInstance = editorRef.current.getInstance();

    if (selectedReason && description) {
      const dataUrl = editorInstance.toDataURL();

      // Convert base64 → Blob
      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      // Create file
      const file = new File([blob], "screenshot.png", { type: mimeString });

      // Prepare form
      const form = new FormData();
      form.append("TiketProjectId", 1);
      form.append("TiketBranchId", 1);
      form.append("TiketUserName", userShowFullData?.personalName);
      form.append("TiketUserMobile", userShowFullData?.personalMoble || "N/A");
      form.append(
        "TiketUserEmail",
        userShowFullData?.personalWorkMail || "N/A"
      );
      form.append(
        "TiketHeader",
        selectedReason?.title || "Other (please specify)"
      );
      form.append("TiketBody", description);
      form.append("FormFile1", file); // ✅ correct file now

      newTicketMutation.mutate({ data: form, token: user?.encodedPayload });
    }
  }

  const reasons = [
    {
      id: 3,
      title: "Access or login problem",
    },
    {
      id: 4,
      title: "System error / bug report",
    },
    {
      id: 5,
      title: "Request for new feature / improvement",
    },
    {
      id: 6,
      title: "Data update or correction needed",
    },
    {
      id: 7,
      title: "Training or how-to request",
    },
    {
      id: 8,
      title: "Performance or speed issue",
    },
    {
      id: 9,
      title: "Purchase / inventory request issue",
    },
    {
      id: 10,
      title: "Other (please specify)",
    },
  ];
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.7)",
        zIndex: 9999,
      }}
    >
      {
        <div style={{ margin: "20px auto", width: "80%", height: "80%" }}>
          <ImageEditor
            ref={editorRef}
            includeUI={{
              loadImage: {
                path: image,
                name: "Screenshot",
              },
              menu: ["crop", "draw", "text", "icon"],
              initMenu: "draw",
              uiSize: {
                width: "100%",
                height: "100%",
              },
              menuBarPosition: "bottom",
            }}
          />
        </div>
      }

      {page === 2 && (
        <div className="overlay">
          <div className="overlay-content height-fit">
            <h5>Ticket Submission</h5>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <label>Title</label>
              {/* <TextField
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                error={!title}
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                    backgroundColor: "white",
                    height: "35px",
                    width: "240px",
                    fontSize: "12px",
                    overflow: "hidden",
                  },
                }}
              /> */}

              <Autocomplete
                disablePortal
                options={reasons}
                value={selectedReason}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                    backgroundColor: "white",
                    height: "35px",
                    width: "240px",
                    fontSize: "12px",
                    overflow: "hidden",
                  },
                }}
                onChange={(event, newValue) => {
                  setSelectedReason(newValue);
                }}
                getOptionLabel={(option) => option?.title || ""}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    error={!selectedReason}
                  />
                )}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <label>Description</label>
              <TextField
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                error={!description}
                multiline
                rows={4}
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                    backgroundColor: "white",
                    width: "240px",
                    fontSize: "12px",
                    overflow: "hidden",
                  },
                }}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <label>Employee</label>
              <TextField
                value={userShowFullData?.personalName}
                disabled
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                    backgroundColor: "white",
                    height: "35px",
                    width: "240px",
                    fontSize: "12px",
                    overflow: "hidden",
                  },
                }}
              />
            </div>
            <div className="btns">
              <button onClick={() => setPage(1)} className="glb-btn danger-btn">
                Back
              </button>
              <button onClick={handleSubmit} className="glb-btn primary-btn">
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        {page === 1 && (
          <button onClick={onClose} className="glb-btn danger-btn">
            Close
          </button>
        )}

        {/* <button
          onClick={handleSave}
          className="glb-btn primary-btn"
          style={{ marginLeft: "10px" }}
        >
          Save
        </button> */}
        {page === 1 && (
          <button
            onClick={handleNextPage}
            className="glb-btn primary-btn"
            style={{ marginLeft: "10px" }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
