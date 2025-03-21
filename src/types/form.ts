
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  province: string;
}

export interface BusinessFormData {
  razonSocial: string;
  razonComercial: string;
  ruc: string;
  dv: string;
  telefono: string;
  direccion1: string;
  direccion2: string;
  ciudad: string;
  provincia: string;
  tipoComercio: string;
  categoria: string;
  contacts: Contact[];
  branches: Branch[];
}

export const COMERCIO_OPTIONS = [
  "Vale de Alimentos",
  "Gasolina",
  "Seguro",
  "Celular",
  "Fondo de Cesantía",
  "Internet",
  "Luz Electrica"
];

export const CATEGORIA_OPTIONS: Record<string, string[]> = {
  "Vale de Alimentos": [
    "Restaurantes",
    "Mercados",
    "Salud",
    "Escuelas",
    "Utiles Escolares"
  ],
  "Gasolina": [],
  "Seguro": [],
  "Celular": [],
  "Fondo de Cesantía": [],
  "Internet": [],
  "Luz Electrica": []
};

export const PROVINCE_OPTIONS = [
  "Bocas del Toro",
  "Chiriquí",
  "Coclé",
  "Colón",
  "Darién",
  "Herrera",
  "Los Santos",
  "Panamá",
  "Panamá Oeste",
  "Veraguas"
];
