import { StatusIndicatorProps } from "@awsui/components-react/status-indicator";

export function getStatus(state?: string): StatusIndicatorProps.Type {
  switch (state) {
    case "ACTIVE":
      return "success";
    case "CREATING":
    case "LOADING":
      return "pending";
    case "DELETED":
      return "warning";
    default:
      return "warning";
  }
}
