
import { useEffect } from "react";
import BusinessForm from "@/components/BusinessForm";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  // Add smooth scroll for better UX
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-form pt-10 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-form-heading mb-4 animate-slide-down">
            Formulario de Afiliación de Comercios
          </h1>
          <Separator className="mx-auto w-24 my-4 bg-form-accent opacity-50" />
          <p className="text-xl text-form-text max-w-2xl mx-auto animate-fade-in">
            Por favor complete el siguiente formulario para registrar su negocio en nuestro sistema de SharePoint.
          </p>
        </header>
        
        <BusinessForm />
      </div>
    </div>
  );
};

export default Index;
