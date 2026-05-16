import { PlantFormData } from "@/types/plant";

export default function PotSoilStep({ data, updateData }: { data: PlantFormData; updateData: (d: Partial<PlantFormData>) => void }) {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Pot Size</label>
          <input type="text" value={data.potSize} onChange={e => updateData({ potSize: e.target.value })} placeholder="e.g., 10 inch" className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Drainage Holes</label>
          <select value={data.drainageHoles} onChange={e => updateData({ drainageHoles: e.target.value })} className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all appearance-none">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Soil Type</label>
        <input type="text" value={data.soilType} onChange={e => updateData({ soilType: e.target.value })} placeholder="e.g., Potting mix with perlite" className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Soil Condition</label>
        <select value={data.soilCondition} onChange={e => updateData({ soilCondition: e.target.value })} className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all appearance-none">
          <option>Dry</option>
          <option>Slightly dry</option>
          <option>Moist</option>
          <option>Wet</option>
          <option>Compacted</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Compost/Fertilizer Added Recently?</label>
        <div className="flex gap-4 mt-2">
          {["Yes", "No"].map(opt => (
            <button key={opt} type="button" onClick={() => updateData({ compostAdded: opt })} className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${data.compostAdded === opt ? "bg-brand-500/20 border-brand-500 text-brand-400" : "bg-surface-primary border-surface-border text-text-primary hover:border-text-dim"}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
