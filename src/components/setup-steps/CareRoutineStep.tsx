import { PlantFormData } from "@/types/plant";

export default function CareRoutineStep({ data, updateData }: { data: PlantFormData; updateData: (d: Partial<PlantFormData>) => void }) {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Last Watered Date</label>
          <input type="date" value={data.lastWatered} onChange={e => updateData({ lastWatered: e.target.value })} className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Watering Freq.</label>
          <select value={data.wateringFreq} onChange={e => updateData({ wateringFreq: e.target.value })} className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all appearance-none">
            <option value="Daily">Daily</option>
            <option value="Every 2-3 days">Every 2-3 days</option>
            <option value="Weekly">Weekly</option>
            <option value="Irregular">Irregular</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Last Fertilizer</label>
          <input type="date" value={data.lastFertilizer} onChange={e => updateData({ lastFertilizer: e.target.value })} className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Fertilizer Type</label>
          <input type="text" value={data.fertilizerType} onChange={e => updateData({ fertilizerType: e.target.value })} placeholder="e.g., Tomato Feed" className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Last Pesticide Spray</label>
        <input type="date" value={data.lastPesticide} onChange={e => updateData({ lastPesticide: e.target.value })} className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Compost/Fertilizer Notes</label>
        <textarea rows={3} value={data.careNotes} onChange={e => updateData({ careNotes: e.target.value })} placeholder="Any extra details..." className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all resize-none" />
      </div>
    </div>
  );
}
