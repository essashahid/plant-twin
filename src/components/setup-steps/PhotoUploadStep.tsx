import { PlantFormData } from "@/types/plant";
import { Camera } from "lucide-react";
import Image from "next/image";

export default function PhotoUploadStep({ data, updateData }: { data: PlantFormData; updateData: (d: Partial<PlantFormData>) => void }) {
  const handleUpload = (type: keyof PlantFormData["photos"], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateData({ photos: { ...data.photos, [type]: url } });
    }
  };

  const PhotoUploadBox = ({ label, type }: { label: string, type: keyof PlantFormData["photos"] }) => {
    const preview = data.photos[type];
    return (
      <div className="relative border-2 border-dashed border-surface-border hover:border-brand-500 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors group h-32 bg-surface-primary/50 overflow-hidden cursor-pointer">
        <input type="file" accept="image/*" onChange={(e) => handleUpload(type, e)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
        {preview ? (
          <Image src={preview} alt={label} fill className="object-cover" />
        ) : (
          <>
            <div className="h-10 w-10 rounded-full bg-surface-border/50 flex items-center justify-center mb-2 group-hover:bg-brand-500/20 group-hover:text-brand-400 text-text-muted transition-colors">
              <Camera className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-text-primary">{label}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-3">
        <p className="text-xs text-brand-400 leading-relaxed">
          Upload photos to generate accurate PlantTwin insights. For this demo, images stay on your device locally.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <PhotoUploadBox label="Full Plant" type="full" />
        <PhotoUploadBox label="Leaf Close-up" type="leaf" />
        <PhotoUploadBox label="Soil Surface" type="soil" />
        <PhotoUploadBox label="Pot/Container" type="pot" />
      </div>
      <PhotoUploadBox label="Growing Area / Balcony" type="area" />
    </div>
  );
}
