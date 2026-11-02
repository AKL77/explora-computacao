import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { NotFoundPage } from "@/components/NotFoundPage";
import { AppShell } from "@/components/layout/AppShell";
import { AboutPage } from "@/features/about";
import { ResourceDetailPage } from "@/features/catalog";
import { LandingPage } from "@/features/landing";
import { SavedTeachingPathsPage, TeachingPathPage } from "@/features/teaching-paths";
import { ReadyTeachingPathsPage } from "@/features/ready-teaching-paths";
import { PrivacyPage } from "@/features/privacy/PrivacyPage";
import { useSessionStore } from "@/store/useSessionStore";
import { useClassroomSync } from "@/features/classrooms/useClassroomSync";
import { CatalogStatus } from "@/features/catalog/components/CatalogStatus";
import { LoginPage } from "@/features/auth/LoginPage";
import { useBackendSession } from "@/lib/backend/useBackendSession";
import { isOnlineMode } from "@/lib/backend/config";

const ClassroomsPage = lazy(() => import("@/features/classrooms/pages/ClassroomsPage").then((module) => ({ default: module.ClassroomsPage })));
const ClassroomDetailPage = lazy(() => import("@/features/classrooms/pages/ClassroomDetailPage").then((module) => ({ default: module.ClassroomDetailPage })));
const StudentClassroomPage = lazy(() => import("@/features/classrooms/pages/StudentClassroomPage").then((module) => ({ default: module.StudentClassroomPage })));
const classroomLoading = <CatalogStatus busy title="Carregando" message="Estamos preparando sua página." />;

function PublicHome() {
  return <LandingPage />;
}

function ProtectedApp() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const sessionStatus = useSessionStore((state) => state.status);

  if (sessionStatus === "loading") return classroomLoading;

  if (!isAuthenticated) {
    return <Navigate replace to={isOnlineMode ? "/entrar" : "/"} />;
  }

  return <AppShell />;
}

export function App() {
  useClassroomSync();
  useBackendSession();
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/alunos/*" element={<Suspense fallback={classroomLoading}><StudentClassroomPage /></Suspense>} />
        <Route path="/app" element={<ProtectedApp />}>
          <Route index element={<Navigate replace to="trilha-de-ensino" />} />
          <Route path="acervo" element={<Navigate replace to="/app/trilha-de-ensino" />} />
          <Route path="acervo/:slug" element={<Navigate replace to="/app/trilha-de-ensino" />} />
          <Route path="materiais/:slug" element={<ResourceDetailPage />} />
          <Route path="perfil" element={<Navigate replace to="/app/trilha-de-ensino" />} />
          <Route path="pastas/*" element={<Navigate replace to="/app/trilha-de-ensino" />} />
          <Route path="planos/*" element={<Navigate replace to="/app/minhas-trilhas" />} />
          <Route path="plano-de-aula" element={<Navigate replace to="/app/trilha-de-ensino" />} />
          <Route path="trilha-de-ensino" element={<TeachingPathPage />} />
          <Route path="trilhas-prontas" element={<ReadyTeachingPathsPage />} />
          <Route path="trilhas-pronta" element={<Navigate replace to="/app/trilhas-prontas" />} />
          <Route path="minhas-trilhas" element={<SavedTeachingPathsPage />} />
          <Route path="minhas-turmas" element={<Suspense fallback={classroomLoading}><ClassroomsPage /></Suspense>} />
          <Route path="minhas-turmas/:classroomId" element={<Suspense fallback={classroomLoading}><ClassroomDetailPage /></Suspense>} />
          <Route path="sobre" element={<AboutPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <AnalyticsConsent />
    </>
  );
}
