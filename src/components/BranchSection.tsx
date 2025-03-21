
import { Branch, PROVINCE_OPTIONS } from "@/types/form";
import { createEmptyBranch } from "@/utils/formUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Building } from "lucide-react";

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
