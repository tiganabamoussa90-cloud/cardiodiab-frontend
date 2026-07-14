import { Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Navbar } from "../components/layout/Navbar";
import { GradientMesh } from "../components/decor/GradientMesh";

export default function NotFoundPage() {
  return (
    // "h-screen" ou "min-h-screen" : on s'assure que tout tient sans défilement vertical parasite sur mobile
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-clinical">
      <GradientMesh variant="subtle" animated={false} className="no-print" />
      
      <Navbar />
      
      {/* 
        1. On ajoute "py-8" pour éviter que le contenu ne vienne coller au bas ou à la Navbar sur les écrans très courts.
        2. "max-w-[280px] sm:max-w-sm" sur la description pour garder une lecture fluide sur ton Samsung.
      */}
      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8 text-center">
        <HeartPulse className="h-10 w-10 text-pulse-500 animate-pulse" />
        
        <h1 className="font-display text-2xl font-semibold text-ink">Page introuvable</h1>
        
        <p className="max-w-[280px] sm:max-w-sm text-sm text-ink-muted">
          Cette page n'existe pas ou vous n'avez plus accès à cette ressource.
        </p>

        {/* 
          Correction sémantique : On utilise l'élément "Link" directement comme composant 
          ou on passe par une redirection propre pour éviter d'imbriquer un <button> dans un <a>.
          Ici, on applique les styles de ton composant Button (grâce à sa prop "fullWidth" si nécessaire) 
          tout en s'assurant que la zone de clic prend bien tout le lien sur mobile.
        */}
        <Link to="/" className="mt-2 w-full sm:w-auto flex justify-center">
          <Button fullWidth className="w-full sm:w-auto">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}