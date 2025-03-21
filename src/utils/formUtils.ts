
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Contact, Branch, BusinessFormData, MerchantID } from "@/types/form";

export const createEmptyMerchantID = (): MerchantID => ({
  id: uuidv4(),
  merchantId: "",
  bank: ""
});

export const createEmptyContact = (): Contact => ({
  id: uuidv4(),
  firstName: "",
  lastName: "",
  position: "",
  email: "",
  phone: ""
});

export const createEmptyBranch = (): Branch => ({
  id: uuidv4(),
  name: "",
  address: "",
  province: "",
  googleMapsUrl: "",
  merchantIds: [createEmptyMerchantID()]
});

export const createEmptyFormData = (): BusinessFormData => ({
  razonSocial: "",
  razonComercial: "",
  ruc: "",
  dv: "",
  telefono: "",
  representanteLegalNombre: "",
  representanteLegalApellido: "",
  representanteLegalCedula: "",
  direccion1: "",
  direccion2: "",
  ciudad: "",
  provincia: "",
  tipoComercio: "",
  categoria: "",
  contacts: [createEmptyContact()],
  branches: [createEmptyBranch()]
});

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Simple validation for now
  return phone.length >= 8;
};

export const validateFormData = (formData: BusinessFormData): string[] => {
  const errors: string[] = [];

  if (!formData.razonSocial) errors.push("Razón Social es requerido");
  if (!formData.razonComercial) errors.push("Razón Comercial es requerido");
  if (!formData.ruc) errors.push("RUC es requerido");
  if (!formData.dv) errors.push("DV es requerido");
  if (!formData.telefono) errors.push("Teléfono es requerido");
  if (!formData.representanteLegalNombre) errors.push("Nombre del Representante Legal es requerido");
  if (!formData.representanteLegalApellido) errors.push("Apellido del Representante Legal es requerido");
  if (!formData.representanteLegalCedula) errors.push("Cédula del Representante Legal es requerida");
  if (!formData.direccion1) errors.push("Dirección es requerida");
  if (!formData.ciudad) errors.push("Ciudad es requerida");
  if (!formData.provincia) errors.push("Provincia es requerida");
  if (!formData.tipoComercio) errors.push("Tipo de Comercio es requerido");
  
  if (formData.tipoComercio === "Vale de Alimentos" && !formData.categoria) {
    errors.push("Categoría es requerida para Vale de Alimentos");
  }

  // Validate at least one contact
  const hasValidContact = formData.contacts.some(
    contact => 
      contact.firstName && 
      contact.lastName && 
      contact.position && 
      validateEmail(contact.email) && 
      validatePhone(contact.phone)
  );
  if (!hasValidContact) errors.push("Al menos un contacto completo es requerido");

  // Validate at least one branch with required fields
  const hasValidBranch = formData.branches.some(
    branch => branch.name && branch.address && branch.province
  );
  if (!hasValidBranch) errors.push("Al menos una sucursal completa es requerida");

  return errors;
};

export const formatFormDataForSubmission = (formData: BusinessFormData): Record<string, any> => {
  // This function would format data as required by SharePoint
  return {
    ...formData,
    contacts: JSON.stringify(formData.contacts),
    branches: JSON.stringify(formData.branches),
    dateSubmitted: new Date().toISOString()
  };
};
