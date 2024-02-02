import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export default function NavigationButton({
  title,
  placement,
  icon,
  onClick,
}: {
  title: string;
  placement: "right-end" | "left-end";
  icon: any,
  onClick: () => void;
}) {
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow
    >
      <IconButton aria-label="Back" onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  )
}