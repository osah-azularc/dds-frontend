import { Box, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { cleanText } from '../../utilities/formFieldHelpers';

/**
 * Cell component with tooltip that only shows for truncated text
 */
const hasValue = (value) => value !== null && value !== undefined && value !== '';

const getTooltipTitle = (value) => (hasValue(value) ? String(value) : '');

const CellWithTooltip = ({ value, children = null, tooltipTitle, sx = {} }) => {
  const textRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return undefined;

    const checkOverflow = () => {
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    };

    checkOverflow(); // initial check

    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [value]);

  const resolvedTooltipTitle = getTooltipTitle(tooltipTitle ?? value);

  return (
    <Tooltip title={isOverflowing ? resolvedTooltipTitle : ''} arrow placement="top">
      <Box
        ref={textRef}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
          cursor: 'default',
          ...sx,
        }}
      >
        {children ?? value}
      </Box>
    </Tooltip>
  );
};

export const renderCellWithTooltip = (params, fallbackValue = '') => {
  const rawValue = params.formattedValue ?? params.value;
  const normalizedValue = typeof rawValue === 'string' ? cleanText(rawValue) : rawValue;
  const displayValue = hasValue(normalizedValue) ? normalizedValue : fallbackValue;

  return <CellWithTooltip value={displayValue} tooltipTitle={displayValue} />;
};

export default CellWithTooltip;
