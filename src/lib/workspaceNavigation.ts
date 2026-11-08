// Signing out changes the session before the router can protect a page's draft.
// Let an editor defer that action until the teacher decides whether to leave.
export const WORKSPACE_EXIT_EVENT = "explora:before-workspace-exit";

export function requestWorkspaceExit(action: () => void) {
  const event = new CustomEvent<() => void>(WORKSPACE_EXIT_EVENT, {
    cancelable: true,
    detail: action,
  });
  if (window.dispatchEvent(event)) action();
}
