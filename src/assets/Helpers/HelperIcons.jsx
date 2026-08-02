import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { BiRename, BiStar, BiTrash } from "react-icons/bi";
import { BsStarFill } from "react-icons/bs";
import { FiDownload } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { LuSend } from "react-icons/lu";

export default function HelperIcons({
  onEdit,
  onStar,
  onDelete,
  onDownload,
  onSend,
  isStarred,
  grid,
	allowDelete,
	noBottomBorder,
  sending,
}) {
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleOptionClick(action) {
    action();
    handleClose();
  }

  const options = [];

  if (onStar) {
    options.push({
      name: isStarred ? "Unstar" : "Star",
      icon: (size) =>
        isStarred ? (
          <BsStarFill
            size={size}
            title="Unstar"
            className="lower-opacity"
            fill="#FFA107"
          />
        ) : (
          <BiStar size={size} title="Starred" className="lower-opacity" />
        ),
      action: onStar,
      disable: false,
    });
  }

  if (onDelete) {
    options.push({
      name: "Delete",
      text: "Move to Trash",
      icon: (size) => (
        <BiTrash size={size} title="Delete" className="lower-opacity" />
      ),
      action: () => setDeletePopUp(true),
      disable: !allowDelete,
    });
  }

  if (onEdit) {
    options.push({
      name: "Edit",
      icon: (size) => (
        <BiRename size={size} title="Edit" className="lower-opacity" />
      ),
      action: onEdit,
      disable: false,
    });
  }

  if (onDownload) {
    options.push({
      name: "Download",
      icon: (size) => (
        <FiDownload size={size} title="Download" className="lower-opacity" />
      ),
      action: onDownload,
      disable: false,
    });
  }

  if (onSend) {
    options.push({
      name: "Send",
      icon: (size) => (
        <LuSend size={size} title="Send" className="lower-opacity" />
      ),
      action: onSend,
      disable: false,
    });
  }

  return (
    <>
			<div style={{ position: "static", border: noBottomBorder ? "none" : "", flex: 1 }}>
        <div className="icons-container">
          {!grid && (
            <div
              className="list-icons-conatainer"
              style={{ position: "static", justifyContent: "end" }}
            >
              {options.map((option) => (
                <div
                  key={option.name}
                  className={`icon ${option.disable ? "disabled-icon" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!option.disable) option.action();
                  }}
                >
                  {option.icon(18)}
                  <span className="text">{option.text || option.name}</span>
                </div>
              ))}
            </div>
          )}
          <div
            className={`${!grid && "compact-icons"} ${anchorEl ? "show-icon" : ""}`}
            style={{ marginTop: "0" }}
          >
            <Button
              id="basic-button"
              title="Actions"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{
                padding: 1,
                minWidth: 0,
                color: "gray",
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "transparent",
                },
                "&:focus": {
                  outline: "none",
                },
                "&:active": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <HiOutlineDotsVertical />
            </Button>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              sx={{
                " .MuiMenu-list": {
                  backgroundColor: "#f8fafd",
                },
                "& .MuiPaper-root": {
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                  backgroundColor: "#f8fafd",
                },
              }}
            >
              {options &&
                options.map((option) => (
                  <MenuItem
                    disabled={option.disable}
                    sx={{
                      fontSize: "13px",
                      minWidth: "130px",
                    }}
                    key={option.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionClick(option.action);
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {option.icon(15)}
                      {option.name}
                    </div>
                  </MenuItem>
                ))}
            </Menu>
          </div>
        </div>
      </div>
      {deletePopUp && (
        <DeleteConfirmation
          onClose={() => setDeletePopUp(false)}
          onConfirm={onDelete}
        />
      )}
    </>
  );
}

function DeleteConfirmation({ onClose, onConfirm }) {
  return (
    <div className="overlay">
      <div className="overlay-content height-fit">
        <h5>Are you sure you want to delete this item?</h5>
        <div className="btns">
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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
