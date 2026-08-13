import { Navigate, Route, Routes } from "react-router-dom";
import { NotFoundPage } from "@/components/NotFoundPage";
import { AppShell } from "@/components/layout/AppShell";
import { AboutPage } from "@/features/about";
import { CatalogPage, ResourceDetailPage } from "@/features/catalog";
import { FolderDetailPage, FoldersPage } from "@/features/folders";
import { LandingPage } from "@/features/landing";
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
        <Route index element={<Navigate replace to="acervo" />} />
        <Route path="acervo" element={<CatalogPage />} />
        <Route path="acervo/:slug" element={<ResourceDetailPage />} />
        <Route path="pastas" element={<FoldersPage />} />
        <Route path="pastas/:folderId" element={<FolderDetailPage />} />
        <Route path="sobre" element={<AboutPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
