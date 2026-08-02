import React, { useState, useRef, useEffect } from "react";

/**
 * AddFoodItem
 * React + Tailwind component (single-file). Default export.
 * Props:
 *  - apiEndpoint (string) optional: if provided, component will POST FormData to this URL
 *  - onSubmit (function) optional: receives (formData) and should return a Promise. If provided, used instead of apiEndpoint.
 *  - initial (object) optional: { name_ar, name_en, price, description }
 *
 * Usage:
 * <AddFoodItem apiEndpoint="/api/foods" />
 */

export default function AddFoodItem({ apiEndpoint = null, onSubmit = null, initial = {} }) {
  const [nameAr, setNameAr] = useState(initial.name_ar || "");
  const [nameEn, setNameEn] = useState(initial.name_en || "");
  const [price, setPrice] = useState(initial.price || "");
  const [description, setDescription] = useState(initial.description || "");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  // CSS variables (colors you provided) are applied to the root container so Tailwind layout + these vars combine.
  const cssVars = {
    "--primary": "#B88E52",
    "--secondary": "#49494A",
    "--gray": "#6b6b6b",
    "--light-gray": "#E5E5E5",
  };

  useEffect(() => {
    // revoke url on unmount
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function validate() {
    const e = {};
    if (!nameAr.trim()) e.nameAr = "Arabic name is required";
    if (!nameEn.trim()) e.nameEn = "English name is required";
    if (!price || Number.isNaN(Number(price))) e.price = "Valid price is required";
    if (!file) e.file = "An image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleFileChange(ev) {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    setFile(f);
    // create preview
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  }

  function handleReset() {
    setNameAr("");
    setNameEn("");
    setPrice("");
    setDescription("");
    setFile(null);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    setErrors({});
    if (fileRef.current) fileRef.current.value = null;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const fd = new FormData();
    fd.append("name_ar", nameAr.trim());
    fd.append("name_en", nameEn.trim());
    fd.append("price", Number(price).toFixed(2));
    fd.append("description", description.trim());
    fd.append("image", file);

    // try {
    //   if (typeof onSubmit === "function") {
    //     await onSubmit(fd);
    //   } else if (apiEndpoint) {
    //     const res = await fetch(apiEndpoint, { method: "POST", body: fd });
    //     if (!res.ok) throw new Error(`Server returned ${res.status}`);
    //   } else {
    //     // demo fallback
    //     console.info("FormData prepared (demo):", fd.get("name_en"), fd.get("image"));
    //     // in a real integration you'd replace this with a POST
    //   }

    //   // success behaviour
    //   alert("Food item saved successfully.");
    //   handleReset();
    // } catch (err) {
    //   console.error(err);
    //   alert("Save failed. See console for details.");
    // } finally {
    //   setLoading(false);
    // }
  }

  return (
    <div className="max-w-4xl mx-auto p-6" style={cssVars}>
      {/* style block to make subtle elements use the provided colors */}
      <style>{`
        .primary-bg{background:var(--primary)}
        .primary-text{color:var(--primary)}
        .secondary-text{color:var(--secondary)}
        .muted{color:var(--gray)}
        .light-bg{background:var(--light-gray)}
      `}</style>

      <header className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg primary-bg flex items-center justify-center shadow-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#fff"/></svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold secondary-text">Add new food item</h2>
          <p className="text-sm muted">Arabic & English names, price, description and an image. Preview updates in real time.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form className="bg-white rounded-2xl p-6 shadow-sm" onSubmit={handleSubmit} onReset={handleReset} noValidate>

          <div className="mb-4">
            <label htmlFor="name_ar" className="text-sm muted block mb-2">Arabic name <span className="text-primary">*</span></label>
            <input
              id="name_ar"
              dir="rtl"
              value={nameAr}
              onChange={(e)=>setNameAr(e.target.value)}
              className="w-full border border-gray-100 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-opacity-30"
              placeholder="مثال: كفتة بالطحينة"
              aria-invalid={errors.nameAr ? "true" : "false"}
            />
            {errors.nameAr && <p className="text-xs text-red-500 mt-1">{errors.nameAr}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="name_en" className="text-sm muted block mb-2">English name <span className="text-primary">*</span></label>
            <input
              id="name_en"
              value={nameEn}
              onChange={(e)=>setNameEn(e.target.value)}
              className="w-full border border-gray-100 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-opacity-30"
              placeholder="e.g. Kofta with tahini"
              aria-invalid={errors.nameEn ? "true" : "false"}
            />
            {errors.nameEn && <p className="text-xs text-red-500 mt-1">{errors.nameEn}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="price" className="text-sm muted block mb-2">Price <span className="text-primary">*</span></label>
              <div className="flex items-center gap-3">
                <div className="px-3 py-2 rounded-lg light-bg text-sm muted font-semibold">EGP</div>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e)=>setPrice(e.target.value)}
                  className="w-full border border-gray-100 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-opacity-30"
                  placeholder="0.00"
                  aria-invalid={errors.price ? "true" : "false"}
                />
              </div>
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="category" className="text-sm muted block mb-2">Category</label>
              <input id="category" className="w-full border border-gray-100 rounded-xl p-3 text-sm" placeholder="e.g. Main course" />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="text-sm muted block mb-2">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              className="w-full border border-gray-100 rounded-xl p-3 text-sm min-h-[120px] resize-y outline-none focus:ring-2 focus:ring-opacity-30"
              placeholder="Short description for the menu (ingredients, notes, spiciness)..."
            />
          </div>

          <div className="mb-4">
            <label className="text-sm muted block mb-2">Image <span className="text-primary">*</span></label>
            <div className="flex items-center justify-between gap-3 border-2 border-dashed rounded-xl p-3">
              <div>
                <div className="font-medium secondary-text">Choose an image</div>
                <div className="text-xs muted">PNG / JPG / JPEG — recommended 1200×800</div>
                {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={()=>fileRef.current?.click()} className="px-3 py-2 border rounded-lg text-sm">Browse</button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            </div>
            {file && <div className="text-xs muted mt-2">{file.name} • {Math.round(file.size/1024)}KB</div>}
          </div>

          <div className="flex justify-end gap-3">
            <button type="reset" className="px-4 py-2 rounded-lg border">Reset</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-white primary-bg" disabled={loading}>
              {loading ? "Saving..." : "Save food item"}
            </button>
          </div>
        </form>

        {/* Preview */}
        <aside className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          <div className="h-64 rounded-lg overflow-hidden bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center muted">
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#fff" stroke="#eee" strokeWidth="1.2"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#ddd" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <div className="mt-2">Image preview</div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg border">
            <div className="text-right font-semibold text-lg secondary-text" dir="rtl">{nameAr || "اسم الطبق بالعربية"}</div>
            <div className="text-sm muted mt-1">{nameEn || "Dish name in English"}</div>
            <div className="mt-3 text-lg font-bold primary-text">{price ? Number(price).toFixed(2) + " EGP" : "—"}</div>
          </div>

          <div className="text-xs muted">This preview shows how the item will look in the menu. It updates as you type.</div>
        </aside>
      </div>
    </div>
  );
}
