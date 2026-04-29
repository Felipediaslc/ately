"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

type ProductForm = {
  title: string;
  price: string;
  images: (File | string)[];
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

const initialForm: ProductForm = {
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
};

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<ProductForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const json = await res.json();
        const data = json.data ?? json;

        setForm({
          title: data.title ?? "",
          price: String(data.price ?? ""),
          images: Array.isArray(data.images) ? data.images : [], // ← fix
          category: data.category ?? "",
          description: data.description ?? "",
          pixPrice: String(data.pixPrice ?? ""),
          stock: String(data.stock ?? ""),
          sku: data.sku ?? "",
          deliveryDays: String(data.deliveryDays ?? ""),
          isUnique: data.isUnique ?? false,
          isHandmade: data.isHandmade ?? false,
          isLimited: data.isLimited ?? false,
        });
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return <p className="p-6 text-zinc-400">Carregando produto...</p>;
  }

  const previews = (form.images ?? []).map((img) =>
    typeof img === "string" ? img : URL.createObjectURL(img)
  );

  const removeImage = (index: number) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setForm({ ...form, images: [...form.images, ...Array.from(e.target.files)] });
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
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setUploadingIndex(i);
      const compressed = await compressImage(files[i]);
      const data = new FormData();
      data.append("file", compressed);
      data.append("upload_preset", "SEU_UPLOAD_PRESET");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dwncbpih4/image/upload",
        { method: "POST", body: data }
      );
      const result = await res.json();
      urls.push(result.secure_url);
    }
    setUploadingIndex(null);
    return urls;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const existingImages = form.images.filter((img): img is string => typeof img === "string");
      const newFiles = form.images.filter((img): img is File => img instanceof File);
      const uploadedNewImages = newFiles.length > 0 ? await uploadImages(newFiles) : [];

      const body = {
        title: form.title,
        price: Number(form.price),
        images: [...existingImages, ...uploadedNewImages],
        category: form.category,
        description: form.description,
        pixPrice: Number(form.pixPrice),
        stock: Number(form.stock),
        isUnique: form.isUnique,
        isHandmade: form.isHandmade,
        isLimited: form.isLimited,
        sku: form.sku,
        deliveryDays: Number(form.deliveryDays),
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Erro ao atualizar produto");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setUploadingIndex(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-zinc-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Editar Produto</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Atualize as informações do produto</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="bg-[#111113] border border-zinc-800/60 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-medium text-zinc-300">Informações gerais</h2>

            <div className="space-y-1">
              <label className="text-xs text-zinc-500">Título</label>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">Preço (R$)</label>
                <input
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">Preço Pix (R$)</label>
                <input
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition"
                  value={form.pixPrice}
                  onChange={(e) => setForm({ ...form, pixPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">Estoque</label>
                <input
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">SKU</label>
                <input
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">Prazo (dias)</label>
                <input
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition"
                  value={form.deliveryDays}
                  onChange={(e) => setForm({ ...form, deliveryDays: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-500">Categoria</label>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-500">Descrição</label>
              <textarea
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          {/* FLAGS */}
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
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-50 accent-sky-900"
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
              <input type="file" multiple onChange={handleImages} className="hidden" />
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {previews.map((img, i) => (
                  <div key={i} className="relative group">
                    <Image
                      src={img}
                      alt="produto"
                      width={300}
                      height={300}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
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
                Enviando imagem {uploadingIndex + 1} de {form.images.filter((i) => i instanceof File).length}...
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sky-900 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition"
          >
            {isSubmitting ? "Atualizando..." : "Atualizar Produto"}
          </button>

        </form>
      </div>
    </div>
  );
}

