import { Dialog } from "@mui/material";

export default function SimpleConfirmationPopup({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="auto"
      className="popup-component"
    >
      <div className="overlay-content height-fit">
        <h5>{title}</h5>
        <p
          style={{
            textAlign: "center",
            maxWidth: "300px",
            textWrap: "balance",
            margin: "15px 0",
          }}
        >
          {message}
        </p>
        <div
          className="btns"
          style={{ display: "flex", gap: "10px", marginTop: "10px" }}
        >
          <button className="glb-btn danger-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="glb-btn primary-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </Dialog>
  );
}
