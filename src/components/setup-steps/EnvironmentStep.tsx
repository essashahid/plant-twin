import { PlantFormData } from "@/types/plant";

export default function EnvironmentStep({ data, updateData }: { data: PlantFormData; updateData: (d: Partial<PlantFormData>) => void }) {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Estimated Direct Sunlight (hours/day)</label>
        <input type="number" value={data.sunlightHours} onChange={e => updateData({ sunlightHours: e.target.value ? Number(e.target.value) : "" })} placeholder="e.g., 5" className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Wind Exposure</label>
          <select value={data.windExposure} onChange={e => updateData({ windExposure: e.target.value })} className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all appearance-none">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Shade Risk</label>
          <select value={data.shadeRisk} onChange={e => updateData({ shadeRisk: e.target.value })} className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all appearance-none">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Temperature Feel</label>
          <select value={data.temperature} onChange={e => updateData({ temperature: e.target.value })} className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all appearance-none">
            <option>Cool</option>
            <option>Warm</option>
            <option>Hot</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Humidity</label>
          <select value={data.humidity} onChange={e => updateData({ humidity: e.target.value })} className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all appearance-none">
            <option>Low</option>
            <option>Moderate</option>
            <option>High</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">City/Location (Optional)</label>
        <input type="text" value={data.city} onChange={e => updateData({ city: e.target.value })} placeholder="e.g., London, UK" className="w-full bg-surface-primary border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
      </div>
    </div>
  );
}
