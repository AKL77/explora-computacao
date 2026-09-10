import { Navigate, Route, Routes } from "react-router-dom";
import { NotFoundPage } from "@/components/NotFoundPage";
import { AppShell } from "@/components/layout/AppShell";
import { AboutPage } from "@/features/about";
import { ResourceDetailPage } from "@/features/catalog";
import { FolderDetailPage, FoldersPage } from "@/features/folders";
import { LandingPage } from "@/features/landing";
import {
  LessonPlanPage,
  SavedLessonPlansPage,
} from "@/features/lesson-plans";
import { SavedTeachingPathsPage, TeachingPathPage } from "@/features/teaching-paths";
import { ProfilePage } from "@/features/profile";
import { ReadyTeachingPathsPage } from "@/features/ready-teaching-paths";
import { useSessionStore } from "@/store/useSessionStore";

function PublicHome() {
  return <LandingPage />;
}

function ProtectedApp() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  return <AppShell />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/app" element={<ProtectedApp />}>
        <Route index element={<Navigate replace to="trilha-de-ensino" />} />
        <Route path="acervo" element={<Navigate replace to="/app/trilha-de-ensino" />} />
        <Route path="acervo/:slug" element={<ResourceDetailPage />} />
        <Route path="materiais/:slug" element={<ResourceDetailPage />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="pastas" element={<FoldersPage />} />
        <Route path="pastas/:folderId" element={<FolderDetailPage />} />
        <Route path="planos" element={<SavedLessonPlansPage />} />
        <Route path="planos/:planId/editar" element={<LessonPlanPage />} />
        <Route path="plano-de-aula" element={<LessonPlanPage />} />
        <Route path="trilha-de-ensino" element={<TeachingPathPage />} />
        <Route path="trilhas-prontas" element={<ReadyTeachingPathsPage />} />
        <Route path="trilhas-pronta" element={<Navigate replace to="/app/trilhas-prontas" />} />
        <Route path="minhas-trilhas" element={<SavedTeachingPathsPage />} />
        <Route path="sobre" element={<AboutPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
