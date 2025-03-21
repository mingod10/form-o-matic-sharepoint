
import { useState } from "react";
import { Contact } from "@/types/form";
import { createEmptyContact } from "@/utils/formUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, User } from "lucide-react";

interface ContactSectionProps {
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
}

const ContactSection = ({ contacts, setContacts }: ContactSectionProps) => {
  const handleAddContact = () => {
    setContacts([...contacts, createEmptyContact()]);
  };

  const handleRemoveContact = (id: string) => {
    if (contacts.length === 1) {
      return; // Keep at least one contact form
    }
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const updateContact = (id: string, field: keyof Contact, value: string) => {
    setContacts(
      contacts.map(contact => 
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  };

  return (
    <div className="form-section">
      <h3 className="form-subheading flex items-center gap-2">
        <User size={20} />
        Contactos de la Empresa
      </h3>
      
      {contacts.map((contact, index) => (
        <div 
          key={contact.id} 
          className="p-4 mb-4 bg-white rounded-md border border-gray-200 shadow-sm transition-all hover:shadow-md animated-item"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-700">Contacto {index + 1}</h4>
            {contacts.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveContact(contact.id)}
                className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
              >
                <X size={18} />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`firstName-${contact.id}`}>
                Nombre <span className="required-asterisk">*</span>
              </Label>
              <Input
                id={`firstName-${contact.id}`}
                value={contact.firstName}
                onChange={(e) => updateContact(contact.id, "firstName", e.target.value)}
                className="form-input"
                placeholder="Nombre del contacto"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`lastName-${contact.id}`}>
                Apellido <span className="required-asterisk">*</span>
              </Label>
              <Input
                id={`lastName-${contact.id}`}
                value={contact.lastName}
                onChange={(e) => updateContact(contact.id, "lastName", e.target.value)}
                className="form-input"
                placeholder="Apellido del contacto"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`position-${contact.id}`}>
                Posición <span className="required-asterisk">*</span>
              </Label>
              <Input
                id={`position-${contact.id}`}
                value={contact.position}
                onChange={(e) => updateContact(contact.id, "position", e.target.value)}
                className="form-input"
                placeholder="Cargo o posición"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`email-${contact.id}`}>
                Email <span className="required-asterisk">*</span>
              </Label>
              <Input
                id={`email-${contact.id}`}
                type="email"
                value={contact.email}
                onChange={(e) => updateContact(contact.id, "email", e.target.value)}
                className="form-input"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`phone-${contact.id}`}>
                Teléfono <span className="required-asterisk">*</span>
              </Label>
              <Input
                id={`phone-${contact.id}`}
                type="tel"
                value={contact.phone}
                onChange={(e) => updateContact(contact.id, "phone", e.target.value)}
                className="form-input"
                placeholder="(000) 000-0000"
                required
              />
            </div>
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={handleAddContact}
        className="add-more-button mt-4"
      >
        <Plus size={18} /> Agregar otro contacto
      </Button>
    </div>
  );
};

export default ContactSection;
