import React, { useState, useEffect } from "react";
import { ClickAwayListener, IconButton, InputAdornment, MenuList, Paper, Popper, Box, MenuItem, TextField } from "@mui/material";

export default function FreeTextLookup({
  label,
  options = [],
  valueId,
  valueName,
  onChange,
  getOptionLabel = (option) => option?.label || "",
  getOptionValue = (option) => option?.id,
  error,
  placeholder,
  disabled = false,
}) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = React.useRef(null);

  useEffect(() => {
    setInputValue(valueName || "");
    setIsTyping(false);
  }, [valueName]);

  const filteredOptions = React.useMemo(() => {
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
    } else {
      const matchedOption = options.find(
        (opt) => getOptionLabel(opt).toLowerCase() === newValue.trim().toLowerCase()
      );
      if (matchedOption) {
        onChange(getOptionValue(matchedOption), getOptionLabel(matchedOption));
      } else {
        onChange(0, newValue);
      }
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
    onChange(null, "");
    setIsTyping(false);
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
        <TextField
          value={inputValue}
          onChange={handleInputChange}
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
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
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
          style={{ width: containerRef.current?.clientWidth, zIndex: 99999 }}
        >
          <Paper
            elevation={3}
            style={{
              maxHeight: 250,
              overflow: "auto",
              marginTop: "4px",
              borderRadius: "16px",
            }}
          >
            <MenuList>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleSelect(option)}
                    sx={{
                      fontSize: "13px",
                      color: "var(--color-primary)",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "rgba(197, 167, 109, 0.08)",
                      },
                    }}
                  >
                    {getOptionLabel(option)}
                  </MenuItem>
                ))
              ) : (
                <Box
                  sx={{
                    p: 2,
                    color: "gray",
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                >
                  No options
                </Box>
              )}
            </MenuList>
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
