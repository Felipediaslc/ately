"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ProductForm = {
  title: string;
  price: string;
  images: File[];
  category: string;
  description: string;
  pixPrice: string;
  stock: string;
  sku: string;
  deliveryDays: string;
  isUnique: boolean;
  isHandmade: boolean;
  isLimited: boolean;
};

export default function NewProductPage() {
  const router = useRouter();

  const [form, setForm] = useState<ProductForm>({
    title: "",
    price: "",
    images: [],
    category: "",
    description: "",
    pixPrice: "",
    stock: "",
    sku: "",
    deliveryDays: "",
    isUnique: false,
    isHandmade: false,
    isLimited: false,
  });

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previews = useMemo(() => {
    return form.images.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [form.images]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const removeImage = (index: number) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setForm({ ...form, images: Array.from(e.target.files) });
  };

  async function compressImage(file: File): Promise<File> {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = document.createElement("img");

      return await new Promise((resolve) => {
        img.onload = () => {
          const MAX_WIDTH = 1200;
          const scale = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (!blob) return resolve(file);
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          }, "image/jpeg", 0.7);
        };
        img.src = URL.createObjectURL(file);
      });
    } catch {
      return file;
    }
  }

  async function uploadImages(files: File[]) {
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setUploadingIndex(i);
      try {
        const compressed = await compressImage(files[i]);
        const data = new FormData();
        data.append("file", compressed);
        data.append("upload_preset", "SEU_UPLOAD_PRESET");
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dwncbpih4/image/upload",
          { method: "POST", body: data }
        );
        const result = await res.json();
        if (!res.ok || !result.secure_url) throw new Error("Falha no upload");
        uploadedUrls.push(result.secure_url);
      } catch (err) {
        console.error(err);
        throw new Error("Erro ao enviar imagens para Cloudinary");
      }
    }
    setUploadingIndex(null);
    return uploadedUrls;
  }

  function validateForm() {
    if (!form.title.trim()) return "Título obrigatório";
    if (!form.price || Number(form.price) <= 0) return "Preço inválido";
    if (!form.stock || Number(form.stock) < 0) return "Estoque inválido";
    if (form.images.length === 0) return "Adicione pelo menos 1 imagem";
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }
    setError(null);
    setIsSubmitting(true);
    try {
      const imagesUrls = await uploadImages(form.images);
      const body = {
        title: form.title,
        price: Number(form.price),
        images: imagesUrls,
        category: form.category,
        description: form.description,
        pixPrice: Number(form.pixPrice),
        stock: Number(form.stock),
        sold: 0,
        isUnique: form.isUnique,
        isHandmade: form.isHandmade,
        isLimited: form.isLimited,
        sku: form.sku,
        deliveryDays: Number(form.deliveryDays),
      };
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Erro ao criar produto");
      router.push("/admin/products");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setIsSubmitting(false);
      setUploadingIndex(null);
    }
  }

  const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition";

  return (
    <div className="min-h-screen bg-[#0f0f11] text-zinc-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Novo Produto</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Preencha as informações do produto</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* INFORMAÇÕES GERAIS */}
          <div className="bg-[#111113] border border-zinc-800/60 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-medium text-zinc-300">Informações gerais</h2>

            <div className="space-y-1">
              <label className="text-xs text-zinc-500">Título</label>
              <input className={inputClass} placeholder="Nome do produto" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">Preço (R$)</label>
                <input className={inputClass} placeholder="0,00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">Preço Pix (R$)</label>
                <input className={inputClass} placeholder="0,00" value={form.pixPrice} onChange={(e) => setForm({ ...form, pixPrice: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">Estoque</label>
                <input className={inputClass} placeholder="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">SKU</label>
                <input className={inputClass} placeholder="SKU-001" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">Prazo (dias)</label>
                <input className={inputClass} placeholder="7" value={form.deliveryDays} onChange={(e) => setForm({ ...form, deliveryDays: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-500">Categoria</label>
              <input className={inputClass} placeholder="Ex: Acessórios" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-500">Descrição</label>
              <textarea rows={4} className={`${inputClass} resize-none`} placeholder="Descreva o produto..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>

          {/* CARACTERÍSTICAS */}
          <div className="bg-[#111113] border border-zinc-800/60 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-medium text-zinc-300">Características</h2>
            {[
              { key: "isUnique", label: "Produto único" },
              { key: "isHandmade", label: "Feito à mão" },
              { key: "isLimited", label: "Edição limitada" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key as keyof ProductForm] as boolean}
                  onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 accent-sky-500"
                />
                <span className="text-sm text-zinc-400">{label}</span>
              </label>
            ))}
          </div>

          {/* IMAGENS */}
          <div className="bg-[#111113] border border-zinc-800/60 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-medium text-zinc-300">Imagens</h2>

            <label className="flex items-center gap-2 w-fit cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs px-3 py-2 rounded-lg transition">
              + Adicionar imagens
              <input type="file" multiple accept="image/*" onChange={handleImages} disabled={isSubmitting} className="hidden" />
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {previews.map((img, index) => (
                  <div key={index} className="relative group">
                    <Image src={img.url} alt="preview" width={300} height={300} className="w-full h-20 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={isSubmitting}
                      className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadingIndex !== null && (
              <p className="text-xs text-zinc-500">
                Enviando imagem {uploadingIndex + 1} de {form.images.length}...
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sky-700 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition"
          >
            {isSubmitting ? "Criando..." : "Criar Produto"}
          </button>

        </form>
      </div>
    </div>
  );
}