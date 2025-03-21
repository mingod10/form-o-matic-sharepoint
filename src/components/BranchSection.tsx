import { Branch, MerchantID, PROVINCE_OPTIONS, BANK_OPTIONS } from "@/types/form";
import { createEmptyBranch, createEmptyMerchantID } from "@/utils/formUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Building, MapPin, CreditCard, Building2 } from "lucide-react";

interface BranchSectionProps {
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
}

const BranchSection = ({ branches, setBranches }: BranchSectionProps) => {
  const handleAddBranch = () => {
    setBranches([...branches, createEmptyBranch()]);
  };

  const handleRemoveBranch = (id: string) => {
    if (branches.length === 1) {
      return; // Keep at least one branch form
    }
    setBranches(branches.filter(branch => branch.id !== id));
  };

  const updateBranch = (id: string, field: keyof Branch, value: string) => {
    setBranches(
      branches.map(branch => 
        branch.id === id ? { ...branch, [field]: value } : branch
      )
    );
  };

  const handleAddMerchantID = (branchId: string) => {
    setBranches(
      branches.map(branch => 
        branch.id === branchId 
          ? { ...branch, merchantIds: [...branch.merchantIds, createEmptyMerchantID()] } 
          : branch
      )
    );
  };

  const handleRemoveMerchantID = (branchId: string, merchantIdId: string) => {
    setBranches(
      branches.map(branch => {
        if (branch.id !== branchId) return branch;
        
        // Keep at least one merchant ID field
        if (branch.merchantIds.length === 1) return branch;
        
        return {
          ...branch,
          merchantIds: branch.merchantIds.filter(mid => mid.id !== merchantIdId)
        };
      })
    );
  };

  const updateMerchantID = (branchId: string, merchantIdId: string, field: keyof MerchantID, value: string) => {
    setBranches(
      branches.map(branch => {
        if (branch.id !== branchId) return branch;
        
        return {
          ...branch,
          merchantIds: branch.merchantIds.map(mid => 
            mid.id === merchantIdId ? { ...mid, [field]: value } : mid
          )
        };
      })
    );
  };

  return (
    <div className="form-section">
      <h3 className="form-subheading flex items-center gap-2">
        <Building size={20} />
        Sucursales
      </h3>
      
      {branches.map((branch, index) => (
        <div 
          key={branch.id} 
          className="p-4 mb-4 bg-white rounded-md border border-gray-200 shadow-sm transition-all hover:shadow-md animated-item"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-700">Sucursal {index + 1}</h4>
            {branches.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveBranch(branch.id)}
                className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
              >
                <X size={18} />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`name-${branch.id}`}>
                Nombre <span className="required-asterisk">*</span>
              </Label>
              <Input
                id={`name-${branch.id}`}
                value={branch.name}
                onChange={(e) => updateBranch(branch.id, "name", e.target.value)}
                className="form-input"
                placeholder="Nombre de la sucursal"
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`address-${branch.id}`}>
                Dirección <span className="required-asterisk">*</span>
              </Label>
              <Input
                id={`address-${branch.id}`}
                value={branch.address}
                onChange={(e) => updateBranch(branch.id, "address", e.target.value)}
                className="form-input"
                placeholder="Dirección completa"
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`province-${branch.id}`}>
                Provincia <span className="required-asterisk">*</span>
              </Label>
              <Select
                value={branch.province}
                onValueChange={(value) => updateBranch(branch.id, "province", value)}
              >
                <SelectTrigger id={`province-${branch.id}`} className="form-select">
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
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`maps-${branch.id}`} className="flex items-center gap-1">
                <MapPin size={16} /> Ubicación en Google Maps
              </Label>
              <Input
                id={`maps-${branch.id}`}
                value={branch.googleMapsUrl}
                onChange={(e) => updateBranch(branch.id, "googleMapsUrl", e.target.value)}
                className="form-input"
                placeholder="URL de Google Maps o coordenadas (latitud,longitud)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes pegar la URL de Google Maps o las coordenadas en formato "latitud,longitud"
              </p>
            </div>
            
            <div className="md:col-span-2 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={18} />
                <h5 className="text-md font-medium text-gray-700">Merchant IDs:</h5>
              </div>
              
              {branch.merchantIds.map((merchantId, midIndex) => (
                <div 
                  key={merchantId.id} 
                  className="p-3 mb-3 bg-gray-50 rounded-md border border-gray-200 relative"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Merchant ID {midIndex + 1}</span>
                    {branch.merchantIds.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMerchantID(branch.id, merchantId.id)}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-red-500 absolute top-2 right-2"
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`merchant-id-${merchantId.id}`}>
                        Merchant ID
                      </Label>
                      <Input
                        id={`merchant-id-${merchantId.id}`}
                        value={merchantId.merchantId}
                        onChange={(e) => updateMerchantID(branch.id, merchantId.id, "merchantId", e.target.value)}
                        className="form-input"
                        placeholder="Ej. 123456789"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`bank-${merchantId.id}`}>
                        Banco
                      </Label>
                      <Select
                        value={merchantId.bank}
                        onValueChange={(value) => updateMerchantID(branch.id, merchantId.id, "bank", value)}
                      >
                        <SelectTrigger id={`bank-${merchantId.id}`} className="form-select">
                          <SelectValue placeholder="Seleccione el banco" />
                        </SelectTrigger>
                        <SelectContent>
                          {BANK_OPTIONS.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddMerchantID(branch.id)}
                className="mt-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                size="sm"
              >
                <Plus size={16} /> Agregar Merchant ID
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={handleAddBranch}
        className="add-more-button mt-4"
      >
        <Plus size={18} /> Agregar otra sucursal
      </Button>
    </div>
  );
};

export default BranchSection;
