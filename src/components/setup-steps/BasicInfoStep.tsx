import { PlantFormData } from "@/types/plant";

export default function BasicInfoStep({ data, updateData }: { data: PlantFormData; updateData: (d: Partial<PlantFormData>) => void }) {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Plant Name (optional)</label>
        <input type="text" value={data.name} onChange={e => updateData({ name: e.target.value })} placeholder="e.g., Spicy Boy" className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Plant Type</label>
        <select value={data.type} onChange={e => updateData({ type: e.target.value })} className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all appearance-none">
          <option>Chilli Plant</option>
          <option>Tomato Plant</option>
          <option>Monstera</option>
          <option>Snake Plant</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Location Type</label>
        <div className="grid grid-cols-2 gap-3">
          {["Balcony", "Garden", "Indoor", "Rooftop"].map(loc => (
            <button key={loc} type="button" onClick={() => updateData({ location: loc })} className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${data.location === loc ? "bg-brand-500/20 border-brand-500 text-brand-400" : "bg-surface-primary border-surface-border text-text-primary hover:border-text-dim"}`}>
              {loc}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Estimated Age</label>
          <input type="text" value={data.age} onChange={e => updateData({ age: e.target.value })} placeholder="e.g., 6 weeks" className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Date Planted</label>
          <input type="date" value={data.plantedDate} onChange={e => updateData({ plantedDate: e.target.value })} className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
        </div>
      </div>
    </div>
  );
}
