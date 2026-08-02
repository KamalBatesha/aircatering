import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import useKDStore from "../../assets/store/KD/KDStore";
import useSalesStore from "../../assets/store/Sales/SalesStore";
import { onlineOrderToast } from "../../assets/Helpers/onlineOrderToast";
import KDMutations from "../../assets/apis/KD/KDMutations";

const ViewImage = ({
  images = [],
  startIndex = 0,
  setImagePath,
  depId,
  KD,
  KM,
  QC,
}) => {
  const fileInputRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(startIndex);

  const selectedQuotation = useSalesStore((state) => state.selectedQuotation);
  const selectedItemInTicket = useKDStore(
    (state) => state.selectedItemInTicket
  );

  const { markItemDone, itemDocumentsUpload, removeItemDocumentsUpload } =
    KDMutations(depId, selectedQuotation?.orderHeaderId);

  const safeIndex = startIndex >= 0 ? startIndex : 0;
  const [preview, setPreview] = useState(images[safeIndex]);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      const imageUrl = data.secure_url;

      await itemDocumentsUpload.mutateAsync({
        detailID: selectedItemInTicket?.orderDetailsId,
        pictPath: imageUrl,
      });

      await markItemDone.mutateAsync({
        itemId: selectedItemInTicket?.orderDetailsId,
      });
    } catch (err) {
      console.log(err);
      onlineOrderToast.error(err?.response?.data?.title || "Upload failed");
    }
  }

  console.log(images, 'images');


  async function handleRemoveImage() {
    const currentImage = images[activeIndex];

    if (!currentImage) return;

    try {
      await removeItemDocumentsUpload.mutateAsync({
        pictID: currentImage.id,
      });


      setImagePath(null);
    } catch (err) {
      console.log(err);
      onlineOrderToast.error("Failed to remove image");
    }
  }

  return (
    <div
      className="overlay"
      style={{ position: "fixed" }}
      onClick={() => setImagePath(null)}
    >
      <div
        className="fade-image height-fit"
        onClick={(e) => e.stopPropagation()}
      >
        <Swiper
          modules={[Navigation]}
          navigation
          initialSlide={startIndex}
          spaceBetween={20}
          slidesPerView={1}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          style={{ width: "90vmin" }}
        >
          {images.map((img, index) => (
            <SwiperSlide key={img.id}>
              <img
                src={img.path}
                style={{
                  width: "90vmin",
                  height: "60vmin",
                  objectFit: "contain",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {
          (KM || KD || QC) && (
            <button
              onClick={handleRemoveImage}
              style={{ marginTop: 15 }}
              className="glb-btn danger-btn"
            >
              Remove Image
            </button>
          )
        }

      </div>
    </div>
  );
};

export default ViewImage;
