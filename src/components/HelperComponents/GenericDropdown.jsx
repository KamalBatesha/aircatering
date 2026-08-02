import { Dropdown } from "antd";
import { MdKeyboardArrowDown } from "react-icons/md";
import PropTypes from "prop-types";

/**
 * A generic dropdown component.
 *
 * @param {string} value - The currently selected value.
 * @param {function} onChange - Callback when an option is selected.
 * @param {string[]} options - Array of options to display.
 * @param {string} defaultText - Text to display when no value is selected (or when value is "All").
 */
const GenericDropdown = ({
	value,
	onChange,
	options = [],
	defaultText = "Select",
	style,
}) => {
	const getOptionLabel = (option) => option?.label || option;
	const getOptionValue = (option) => option?.value || option;

	const items = options.map((option) => ({
		key: getOptionValue(option),
		label: getOptionLabel(option),
		onClick: () => onChange(getOptionValue(option)),
	}));

	const selectedOption = options.find((o) => getOptionValue(o) === value);
	const displayText = selectedOption ? getOptionLabel(selectedOption) : defaultText;

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
        ...style,
			}}
		>
			<Dropdown
				menu={{
					items: items,
					selectedKeys: [value],
				}}
				placement="bottomRight"
				trigger={["click"]}
			>
				<button
					className="employee-btn"
					style={{
						outline: "none",
						width: "120px",
						height: "32px",
						padding: "2px 8px",
						borderRadius: "10px",
						border: "1px solid #d3d3d3",
						cursor: "pointer",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						backgroundColor: "var(--color-card)",
						color: "var(--color-primary)",
					}}
				>
					<span style={{ fontSize: "12px" }}>
						{displayText}
					</span>
					<MdKeyboardArrowDown />
				</button>
			</Dropdown>
		</div>
	);
};

GenericDropdown.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	options: PropTypes.array,
	defaultText: PropTypes.string,
  style: PropTypes.object,
};

export default GenericDropdown;
