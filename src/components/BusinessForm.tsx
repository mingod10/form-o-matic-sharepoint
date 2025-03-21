
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { 
  BusinessFormData, 
  COMERCIO_OPTIONS, 
  CATEGORIA_OPTIONS, 
  PROVINCE_OPTIONS 
} from "@/types/form";
import { 
  createEmptyFormData, 
  validateFormData 
} from "@/utils/formUtils";
import { submitToSharePoint } from "@/lib/sharepoint";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, Loader2 } from "lucide-react";
import ContactSection from "./ContactSection";
import BranchSection from "./BranchSection";

const BusinessForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BusinessFormData>(createEmptyFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);

  // This will run when tipoComercio changes to determine if we should show the categoria dropdown
  useEffect(() => {
    setShowCategorias(formData.tipoComercio === "Vale de Alimentos");
    // Reset categoria if not Vale de Alimentos
    if (formData.tipoComercio !== "Vale de Alimentos") {
      setFormData(prev => ({ ...prev, categoria: "" }));
    }
  }, [formData.tipoComercio]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateFormData(formData);
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await submitToSharePoint(formData);
      if (success) {
        setSubmitSuccess(true);
        toast.success("Formulario enviado exitosamente");
        
        // After successful submission, navigate to documents upload page
        setTimeout(() => {
          // Generate a unique business ID from form data
          const businessId = `${formData.ruc}-${formData.dv}`;
          navigate("/documents-upload", { state: { businessId } });
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al enviar el formulario");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="text-center mb-8 animate-fade-in">
        <p className="text-red-500 font-medium">
          Todos los campos marcados con * son requeridos y deben ser llenados.
        </p>
      </div>
      
      {/* Información Básica del Negocio */}
      <div className="form-section">
        <h2 className="form-heading">Información del Negocio</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="razonSocial">
              Razón Social <span className="required-asterisk">*</span>
            </Label>
            <Input
              id="razonSocial"
              name="razonSocial"
              value={formData.razonSocial}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="razonComercial">
              Razón Comercial <span className="required-asterisk">*</span>
            </Label>
            <Input
              id="razonComercial"
              name="razonComercial"
              value={formData.razonComercial}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ruc">
              RUC <span className="required-asterisk">*</span>
            </Label>
            <Input
              id="ruc"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              className="form-input"
              required
            />
            <p className="text-xs text-gray-500 mt-1">RUC</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dv">
              DV <span className="required-asterisk">*</span>
            </Label>
            <Input
              id="dv"
              name="dv"
              value={formData.dv}
              onChange={handleChange}
              className="form-input"
              required
              maxLength={2}
              style={{ maxWidth: "100px" }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefono">
              Teléfono <span className="required-asterisk">*</span>
            </Label>
            <Input
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="form-input"
              placeholder="(000) 000-0000"
              required
            />
          </div>
        </div>
        
        {/* Representante Legal */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Representante Legal</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="representanteLegalNombre">
                Nombre <span className="required-asterisk">*</span>
              </Label>
              <Input
                id="representanteLegalNombre"
                name="representanteLegalNombre"
                value={formData.representanteLegalNombre}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="representanteLegalApellido">
                Apellido <span className="required-asterisk">*</span>
              </Label>
              <Input
                id="representanteLegalApellido"
                name="representanteLegalApellido"
                value={formData.representanteLegalApellido}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="representanteLegalCedula">
                Cédula <span className="required-asterisk">*</span>
              </Label>
              <Input
                id="representanteLegalCedula"
                name="representanteLegalCedula"
                value={formData.representanteLegalCedula}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Dirección */}
      <div className="form-section">
        <h2 className="form-heading">Dirección Principal</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="direccion1">
              Dirección <span className="required-asterisk">*</span>
            </Label>
            <Input
              id="direccion1"
              name="direccion1"
              value={formData.direccion1}
              onChange={handleChange}
              className="form-input"
              placeholder="Dirección 1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Direccion 1</p>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="direccion2">
              Dirección 2
            </Label>
            <Input
              id="direccion2"
              name="direccion2"
              value={formData.direccion2}
              onChange={handleChange}
              className="form-input"
              placeholder="Dirección 2 (opcional)"
            />
            <p className="text-xs text-gray-500 mt-1">Direccion 2</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ciudad">
              Ciudad <span className="required-asterisk">*</span>
            </Label>
            <Input
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              className="form-input"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Ciudad</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="provincia">
              Provincia <span className="required-asterisk">*</span>
            </Label>
            <Select
              value={formData.provincia}
              onValueChange={handleSelectChange("provincia")}
            >
              <SelectTrigger id="provincia" className="form-select">
                <SelectValue placeholder="Seleccione la provincia" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCE_OPTIONS.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Provincia</p>
          </div>
        </div>
      </div>
      
      {/* Tipo de Comercio */}
      <div className="form-section">
        <h2 className="form-heading">Clasificación del Comercio</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tipoComercio">
              Tipo de Comercio <span className="required-asterisk">*</span>
            </Label>
            <Select
              value={formData.tipoComercio}
              onValueChange={handleSelectChange("tipoComercio")}
            >
              <SelectTrigger id="tipoComercio" className="form-select">
                <SelectValue placeholder="Seleccione el tipo de comercio" />
              </SelectTrigger>
              <SelectContent>
                {COMERCIO_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {showCategorias && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="categoria">
                Categoría <span className="required-asterisk">*</span>
              </Label>
              <Select
                value={formData.categoria}
                onValueChange={handleSelectChange("categoria")}
              >
                <SelectTrigger id="categoria" className="form-select">
                  <SelectValue placeholder="Seleccione la categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIA_OPTIONS["Vale de Alimentos"].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
      
      {/* Contactos */}
      <ContactSection
        contacts={formData.contacts}
        setContacts={(contacts) => setFormData({ ...formData, contacts })}
      />
      
      {/* Sucursales */}
      <BranchSection
        branches={formData.branches}
        setBranches={(branches) => setFormData({ ...formData, branches })}
      />
      
      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <Button
          type="submit"
          className="form-button px-10 py-6 text-lg"
          disabled={isSubmitting || submitSuccess}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Enviando...
            </>
          ) : submitSuccess ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Enviado
            </>
          ) : (
            "Enviar Formulario"
          )}
        </Button>
      </div>
    </form>
  );
};

export default BusinessForm;
