
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, Upload, Loader2, FileIcon } from "lucide-react";
import { uploadFileToSharePoint } from "@/lib/sharepoint";

type DocumentType = "representanteLegal" | "avisoOperaciones" | "contratoFirmado";

interface DocumentStatus {
  file: File | null;
  uploading: boolean;
  uploaded: boolean;
  url: string | null;
}

const DocumentsUpload = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const businessId = location.state?.businessId || "unknown";
  
  const [documents, setDocuments] = useState<Record<DocumentType, DocumentStatus>>({
    representanteLegal: { file: null, uploading: false, uploaded: false, url: null },
    avisoOperaciones: { file: null, uploading: false, uploaded: false, url: null },
    contratoFirmado: { file: null, uploading: false, uploaded: false, url: null },
  });

  const handleFileChange = (type: DocumentType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments({
        ...documents,
        [type]: {
          ...documents[type],
          file: e.target.files[0],
          uploaded: false,
        },
      });
    }
  };

  const handleUpload = async (type: DocumentType) => {
    const file = documents[type].file;
    if (!file) {
      toast.error("Por favor seleccione un archivo primero");
      return;
    }

    setDocuments({
      ...documents,
      [type]: {
        ...documents[type],
        uploading: true,
      },
    });

    try {
      const url = await uploadFileToSharePoint(file, `business-${businessId}`);
      
      if (url) {
        setDocuments({
          ...documents,
          [type]: {
            ...documents[type],
            uploading: false,
            uploaded: true,
            url,
          },
        });
        toast.success(`Documento ${getDocumentTitle(type)} subido exitosamente`);
      } else {
        throw new Error("Error al subir archivo");
      }
    } catch (error) {
      console.error(`Error uploading ${type} document:`, error);
      toast.error(`Error al subir el documento ${getDocumentTitle(type)}`);
      
      setDocuments({
        ...documents,
        [type]: {
          ...documents[type],
          uploading: false,
        },
      });
    }
  };

  const getDocumentTitle = (type: DocumentType): string => {
    switch (type) {
      case "representanteLegal":
        return "Copia del Representante Legal";
      case "avisoOperaciones":
        return "Aviso de Operaciones";
      case "contratoFirmado":
        return "Contrato Firmado";
    }
  };

  const allDocumentsUploaded = Object.values(documents).every(
    (doc) => doc.uploaded
  );

  const handleFinish = () => {
    if (allDocumentsUploaded) {
      toast.success("Proceso completado exitosamente");
      navigate("/");
    } else {
      toast.error("Por favor suba todos los documentos requeridos");
    }
  };

  const renderDocumentUpload = (type: DocumentType) => {
    const doc = documents[type];
    const title = getDocumentTitle(type);

    return (
      <div className="p-6 border rounded-lg bg-white shadow-sm mb-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          {doc.uploaded && (
            <span className="flex items-center text-green-600">
              <Check className="h-5 w-5 mr-1" /> Documento subido
            </span>
          )}
        </div>

        <div className="space-y-4">
          {doc.file && (
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <FileIcon className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-sm font-medium truncate">{doc.file.name}</span>
              <span className="ml-2 text-xs text-gray-500">
                ({(doc.file.size / 1024).toFixed(0)} KB)
              </span>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <Label htmlFor={`file-${type}`}>
              Seleccionar archivo
            </Label>
            <div className="flex gap-2">
              <Input
                id={`file-${type}`}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange(type)}
                disabled={doc.uploading || doc.uploaded}
                className="max-w-md"
              />

              <Button
                type="button"
                onClick={() => handleUpload(type)}
                disabled={!doc.file || doc.uploading || doc.uploaded}
                variant={doc.uploaded ? "outline" : "default"}
              >
                {doc.uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : doc.uploaded ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Subido
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Subir
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-form pt-10 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-form-heading mb-4 animate-slide-down">
            Documentos Requeridos
          </h1>
          <Separator className="mx-auto w-24 my-4 bg-form-accent opacity-50" />
          <p className="text-xl text-form-text max-w-2xl mx-auto animate-fade-in">
            Por favor suba los siguientes documentos para completar su registro.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          {renderDocumentUpload("representanteLegal")}
          {renderDocumentUpload("avisoOperaciones")}
          {renderDocumentUpload("contratoFirmado")}

          <div className="flex justify-center mt-8">
            <Button
              className="form-button px-10 py-6 text-lg"
              onClick={handleFinish}
              disabled={!allDocumentsUploaded}
            >
              {allDocumentsUploaded ? "Finalizar Proceso" : "Subir Todos los Documentos"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsUpload;
