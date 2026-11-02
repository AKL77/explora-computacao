import { useClassroomsStore } from "@/store/useClassroomsStore";
import { useTeachingPathsStore } from "@/store/useTeachingPathsStore";
import { useWorkspaceState } from "./workspaceState";

export function resetWorkspace(ownerId: string | null) {
  const { generation } = useWorkspaceState.getState();
  useWorkspaceState.setState({ ownerId, generation: generation + 1, status: ownerId ? "loading" : "idle", pending: 0, error: "" });
  useClassroomsStore.setState({ classrooms: [], retiredCodes: [] });
  useTeachingPathsStore.setState({ paths: [] });
}
