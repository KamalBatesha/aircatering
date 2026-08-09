import {
  Box,
  ClickAwayListener,
  Divider,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

const CustomLookup = ({
  label,
  options = [],
  value,
  onChange,
  onAdd,
  onBlur,
  getOptionLabel = (option) => option?.label || "",
  getOptionValue = (option) => option?.id,
  error,
  placeholder,
  addButtonLabel = "Add New",
  disabled = false,
  defaultLabel = "",
}) => {
  const [inputValue, setInputValue] = useState(defaultLabel);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);

  // Sync internal input value with external value
  useEffect(() => {
    if (value !== undefined && value !== null && value !== "") {
      const selected = options.find((opt) => String(getOptionValue(opt)) === String(value));
      if (selected) {
        setInputValue(getOptionLabel(selected));
        setIsTyping(false);
      } else if (defaultLabel && !inputValue) {
        setInputValue(defaultLabel);
        setIsTyping(false);
      }
    } else {
      if (inputValue !== defaultLabel) {
        setInputValue("");
        setIsTyping(false);
      }
    }
  }, [value, options, getOptionLabel, getOptionValue, defaultLabel]);

  const filteredOptions = useMemo(() => {
    if (!isTyping) return options;

    const input = inputValue.trim().toLowerCase();
    if (!input) return options;

    return options
      .filter((opt) => getOptionLabel(opt).toLowerCase().includes(input))
      .sort((a, b) => {
        const aLabel = getOptionLabel(a).toLowerCase();
        const bLabel = getOptionLabel(b).toLowerCase();

        const aStarts = aLabel.startsWith(input);
        const bStarts = bLabel.startsWith(input);

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return aLabel.localeCompare(bLabel);
      });
  }, [options, inputValue, getOptionLabel, isTyping]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsTyping(true);
    if (!newValue) {
      onChange(null, "");
    }
    setIsOpen(true);
  };

  const handleSelect = (option) => {
    onChange(getOptionValue(option), getOptionLabel(option));
    setInputValue(getOptionLabel(option));
    setIsTyping(false);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue("");
    setIsTyping(false);
    onChange(null, "");
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div ref={containerRef} style={{ width: "100%" }}>
        <TextField
          label={label}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={onBlur}
          onFocus={(e) => {
            if (!disabled) {
              setIsOpen(true);
              e.target.select();
            }
          }}
          size="small"
          error={error}
          disabled={disabled}
          placeholder={placeholder}
          fullWidth
          autoComplete="new-password"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "24px",
              backgroundColor: "var(--color-bg-box)",
              height: "38px",
              fontSize: "14px",
              paddingRight: inputValue ? "4px" : undefined,
            },
            "& .MuiInputBase-input": {
              color: "var(--color-primary) !important",
              padding: "0 12px",
            },
            "& .MuiInputLabel-root": {
              fontSize: "14px",
              lineHeight: "14px",
              transform: "translate(14px, 12px) scale(1)",
              "&.Mui-focused, &.MuiInputLabel-shrink": {
                transform: "translate(14px, -12px) scale(0.75)",
              },
            },
          }}
          slotProps={{
            input: {
              endAdornment: inputValue && !disabled ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    tabIndex={-1}
                    sx={{
                      padding: "5px",
                      color: "var(--color-primary)",
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
        <Popper
          open={isOpen}
          anchorEl={containerRef.current}
          placement="bottom-start"
          style={{
            zIndex: 20000000,
            width: containerRef.current?.offsetWidth,
          }}
          modifiers={[
            {
              name: "flip",
              enabled: true,
              options: {
                fallbackPlacements: ["top"],
              },
            },
            {
              name: "preventOverflow",
              enabled: true,
              options: {
                boundary: "viewport",
              },
            },
          ]}
        >
          <Paper
            className="popup-component"
            elevation={3}
            sx={{
              mt: 0.5,
              width: "100%",
              height: "100%",
              maxHeight: 300,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <MenuList dense sx={{ overflowY: "auto", flex: 1, p: 0 }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <MenuItem
                    key={getOptionValue(option)}
                    onClick={() => handleSelect(option)}
                    sx={{ fontSize: "12px" }}
                  >
                    {getOptionLabel(option)}
                  </MenuItem>
                ))
              ) : (
                <Box
                  sx={{
                    p: 2,
                    fontSize: "12px",
                    color: "text.secondary",
                    textAlign: "center",
                  }}
                >
                  No options
                </Box>
              )}
            </MenuList>
            {onAdd && (
              <>
                <Divider />
                <MenuItem
                  id="add-new"
                  onClick={() => {
                    onAdd();
                    setIsOpen(false);
                  }}
                  sx={{
                    justifyContent: "center",
                    gap: 1,
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  <IoIosAddCircleOutline size={18} />
                  {addButtonLabel}
                </MenuItem>
              </>
            )}
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default CustomLookup;
