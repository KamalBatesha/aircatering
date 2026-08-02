import React from 'react';
import { Tooltip, Zoom } from '@mui/material';
import { FaQuestionCircle } from 'react-icons/fa';
import { styled } from '@mui/material/styles';

const ModernTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: '#ffffff',
    color: '#49494a',
    maxWidth: 280,
    fontSize: '12px',
    border: '1px solid #f3f4f6',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderRadius: '12px',
    padding: '10px 14px',
    fontWeight: 500,
    lineHeight: 1.5,
    zIndex: 2147483647,
  },
  '& .MuiTooltip-arrow': {
    color: '#ffffff',
    "&::before": {
      border: '1px solid #f3f4f6',
    }
  },
}));

export default function HelpTooltip({ text }) {
  if (!text) return null;

  return (
    <ModernTooltip
      title={text}
      placement="top"
      arrow
      TransitionComponent={Zoom}
      enterTouchDelay={0}
      leaveTouchDelay={3000}
      slotProps={{
        popper: {
          style: { zIndex: 2147483647 }
        }
      }}
    >
      <span className="inline-flex items-center mx-1 align-middle text-gray-400 hover:text-primary transition-colors cursor-help">
        <FaQuestionCircle size={13} />
      </span>
    </ModernTooltip>
  );
}
