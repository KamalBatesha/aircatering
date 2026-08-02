import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState, useMemo } from 'react'
import { getMyAddress } from '../../assets/apis/auth/AuthApi';
import useAuthMutation from '../../assets/apis/auth/AuthMutation';
import { onlineOrderToast } from '../../assets/Helpers/onlineOrderToast';
import Loading from '../loading/Loading';
import { GetLocationList } from '../../assets/apis/country/Country';
import { langText } from '../../assets/constants/lang';
import { useLangStore } from '../../assets/store/langStore';

function SavedAddr() {
  const [editAddressPopup, setEditAddressPopup] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const { lang } = useLangStore();
  const { editMyAddressMutation } = useAuthMutation();
  const queryClient = useQueryClient();

  const { data: myAddresses = [], isLoading } = useQuery({
    queryKey: ["myAddresses"],
    queryFn: () => getMyAddress(),
  });

  useEffect(() => {
    console.log("myAddresses", myAddresses);
  }, [myAddresses]);

  const handleDeleteAddress = (addressToDelete) => {
    const updatedAddresses = myAddresses.filter(
      (addr) => addr.customerAddressId !== addressToDelete.customerAddressId
    );

    editMyAddressMutation.mutate({
      data: updatedAddresses
    }, {
      onSuccess: () => {
        onlineOrderToast.success(lang === "AR" ? "تم حذف العنوان بنجاح" : "Address deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["myAddresses"] });
      },
      onError: (error) => {
        onlineOrderToast.error(lang === "AR" ? "حدث خطأ أثناء الحذف" : "Error deleting address");
        console.error(error);
      }
    });
  };

  if (isLoading) {
    return <Loading />
  }

  return (
    <div>
      <div className="flex flex-col ">
        <div className="flex justify-between items-center mb-4 border-0 border-b border-b-light-gray pb-2">
          <h2 className="text-xl font-bold">{langText.savedAddresses ? langText.savedAddresses[lang] : "Saved Addresses"}</h2>
          <button
            onClick={() => {
              setAddressToEdit(null);
              setEditAddressPopup(true);
            }}
            className="rounded-full bg-primary text-white hover:bg-secondary transition py-2 px-6 text-sm font-medium shadow-md"
          >
            + {langText.AddNewAddress ? langText.AddNewAddress[lang] : "Add New Address"}
          </button>
        </div>
        {myAddresses && myAddresses.length > 0 ?
          myAddresses.map((address) => (
            <div key={address?.customerAddressId} className=" border-0 border-b border-b-light-gray py-4">
              <div className="grid grid-cols-12 gap-4">
                <p className='sm:col-span-3 col-span-6 text-gray'>{langText.addressName[lang]}</p>
                <p className='sm:col-span-9 col-span-6'>{address?.customerAddressType}</p>
                <p className='sm:col-span-3 col-span-6 text-gray'>{langText.address[lang]}</p>
                <p className='sm:col-span-9 col-span-6'>{address?.customerAddressData}</p>
              </div>
              <div className="flex md:justify-end gap-3 my-2">
                <button
                  onClick={() => {
                    setAddressToEdit(address);
                    setEditAddressPopup(true)
                  }}
                  className='rounded-full text-center border-gray hover:bg-primary hover:border-primary hover:text-white transition md:py-2 md:px-4 px-2 py-1 text-sm md:text-lg border cursor-pointer'>{langText.edit[lang]}</button>
                <button
                  onClick={() => setAddressToDelete(address)}
                  className='rounded-full text-center border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition md:py-2 md:px-4 px-2 py-1 text-sm md:text-lg border cursor-pointer'>{lang === "AR" ? "حذف" : "Delete"}</button>
              </div>
            </div>
          ))
          :
          myAddresses && myAddresses.length == 0 &&
          <div className="flex justify-center items-center text-gray text-lg">{langText.noSavedAddress[lang]}</div>
        }
      </div>
      {
        editAddressPopup &&
        <AddressPoup myAddresses={myAddresses} setAddressToEdit={setAddressToEdit} addressToEdit={addressToEdit} setEditAddressPopup={setEditAddressPopup} />
      }
      {
        addressToDelete &&
        <DeleteConfirmPopup address={addressToDelete} onClose={() => setAddressToDelete(null)} onConfirm={() => {
          handleDeleteAddress(addressToDelete);
          setAddressToDelete(null);
        }} />
      }
    </div>
  )
}

export default SavedAddr

function AddressPoup({ addressToEdit, setEditAddressPopup, myAddresses, setAddressToEdit }) {
  const [addressType, setAddressType] = useState(addressToEdit?.customerAddressType || "");
  const { editMyAddressMutation } = useAuthMutation();
  const queryClient = useQueryClient();
  const { lang } = useLangStore();

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [triedSubmit, setTriedSubmit] = useState(false);

  const { data: locations = [], isLoading: isLocationsLoading, isError: isLocationsError } = useQuery({
    queryKey: ["locations"],
    queryFn: GetLocationList,
  });

  const countries = useMemo(() => {
    return Array.from(new Set(locations.map((item) => item.countryName)))
      .map((name) => locations.find((item) => item.countryName === name))
      .filter(Boolean);
  }, [locations]);

  const cities = useMemo(() => {
    if (!country) return [];
    return Array.from(
      new Set(locations.filter((l) => l.countryName === country).map((l) => l.cityName))
    );
  }, [locations, country]);

  const areas = useMemo(() => {
    if (!country || !city) return [];
    return locations.filter((l) => l.countryName === country && l.cityName === city);
  }, [locations, country, city]);

  useEffect(() => {
    if (locations.length > 0 && addressToEdit?.customerAddressData) {
      const parts = addressToEdit.customerAddressData.split(", ");
      if (parts.length >= 4) {
        const [c, ci, a, ...rest] = parts;
        setCountry(c);
        setCity(ci);
        setArea(a);
        setDetailedAddress(rest.join(", "));
      } else {
        setDetailedAddress(addressToEdit.customerAddressData);
      }
    }
  }, [addressToEdit, locations]);

  function handleUpdateAddress() {
    setTriedSubmit(true);
    if (!country || !city || !area || !detailedAddress || !addressType) {
      onlineOrderToast.error(lang === "AR" ? "يرجى إكمال جميع الحقول" : "Please complete all fields");
      return;
    }

    const finalAddress = `${country}, ${city}, ${area}, ${detailedAddress}`;

    // Find the matching location details to extract the correct IDs
    const matchedLocation = locations.find(
      (l) => l.countryName === country && l.cityName === city && l.ariaName === area
    );

    const customerCountryId = matchedLocation?.countryID ?? null;
    const customerCityId = matchedLocation?.cityID ?? null;
    const customerAreaId = matchedLocation?.ariaID ?? null;

    let updatedAddresses;

    if (addressToEdit) {
      // Edit Mode
      updatedAddresses = myAddresses.map((addr) => {
        if (addr.customerAddressId === addressToEdit.customerAddressId) {
          return {
            ...addr,
            customerAddressData: finalAddress,
            customerAddressType: addressType,
            customerAddressCountryId: customerCountryId,
            customerAddressCityId: customerCityId,
            customerAddressCityAreaId: customerAreaId,
          };
        }
        return addr;
      });
    } else {
      // Create Mode
      const newAddress = {
        customerAddressId: 0,
        customerAddressData: finalAddress,
        customerAddressType: addressType,
        customerId: myAddresses[0]?.customerId || 0,
        customerType: myAddresses[0]?.customerType || "individual",
        customerAddressCountryId: customerCountryId,
        customerAddressCityId: customerCityId,
        customerAddressCityAreaId: customerAreaId,

      };
      updatedAddresses = [...myAddresses, newAddress];
    }
    console.log("updatedAddresses", updatedAddresses);

    editMyAddressMutation.mutate({
      data: updatedAddresses
    }, {
      onSuccess: () => {
        onlineOrderToast.success(lang === "AR" ? "تم حفظ العنوان بنجاح" : "Address saved successfully");
        queryClient.invalidateQueries({ queryKey: ["myAddresses"] });
        setAddressToEdit(null);
        setEditAddressPopup(false);
      },
      onError: (error) => {
        onlineOrderToast.error(lang === "AR" ? "حدث خطأ أثناء الحفظ" : "Error saving address");
        console.log(error);
        setAddressToEdit(null);
        setEditAddressPopup(false);
      }
    });
  }

  return (
    <div className='fixed z-50 w-screen h-screen top-0 left-0 bg-[#00000066] flex items-center justify-center p-5'>
      <div className="bg-white md:w-1/2 xl:w-1/3 w-full p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4 capitalize">
          {addressToEdit ? langText?.updateYourAddress[lang] : (langText.AddNewAddress ? langText.AddNewAddress[lang] : "Add New Address")}
        </h2>
        {isLocationsLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loading />
          </div>
        ) : isLocationsError ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <p className="text-red-500">
              {lang === "AR" ? "فشل تحميل المواقع" : "Failed to load locations"}
            </p>
            <button
              className='rounded-full text-center border-gray hover:bg-primary hover:border-primary hover:text-white transition py-2 px-4 border cursor-pointer'
              onClick={() => setEditAddressPopup(false)}
            >
              {langText.cancel[lang]}
            </button>
          </div>
        ) : (
          <>
            <input
              onChange={(e) => setAddressType(e.target.value)}
              value={addressType}
              type="text"
              placeholder={langText.enterYourAddressName[lang]}
              className={`w-full border rounded-lg p-2 mb-4 focus:outline-none focus:border-primary transition-all ${triedSubmit && !addressType ? "border-red-500" : "border-light-gray"
                }`}
            />

            <div className="flex flex-col gap-4 mb-4">
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCountry(val);
                    setCity("");
                    setArea("");
                  }}
                  className={`w-full border rounded-lg p-2 focus:outline-none focus:border-primary transition-all appearance-none ${triedSubmit && !country ? "border-red-500" : "border-light-gray"
                    }`}
                >
                  <option value="">{langText.selectCountry[lang]}</option>
                  {countries.map((c) => (
                    <option key={c.countryID} value={c.countryName}>
                      {c.countryName}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={city}
                  disabled={!country}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCity(val);
                    setArea("");
                  }}
                  className={`w-full border rounded-lg p-2 focus:outline-none focus:border-primary transition-all appearance-none disabled:bg-gray-50 ${triedSubmit && !city ? "border-red-500" : "border-light-gray"
                    }`}
                >
                  <option value="">{langText.selectCity[lang]}</option>
                  {cities.map((ci, idx) => (
                    <option key={idx} value={ci}>
                      {ci}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={area}
                  disabled={!city}
                  onChange={(e) => setArea(e.target.value)}
                  className={`w-full border rounded-lg p-2 focus:outline-none focus:border-primary transition-all appearance-none disabled:bg-gray-50 ${triedSubmit && !area ? "border-red-500" : "border-light-gray"
                    }`}
                >
                  <option value="">{langText.selectArea[lang]}</option>
                  {areas.map((a) => (
                    <option key={a.ariaID} value={a.ariaName}>
                      {a.ariaName}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <input
                onChange={(e) => setDetailedAddress(e.target.value)}
                value={detailedAddress}
                type="text"
                placeholder={langText.enterYourAddress[lang]}
                className={`w-full border rounded-lg p-2 focus:outline-none focus:border-primary transition-all ${triedSubmit && !detailedAddress ? "border-red-500" : "border-light-gray"
                  }`}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button className='rounded-full text-center border-gray hover:bg-primary hover:border-primary hover:text-white transition py-2 px-4 border cursor-pointer' onClick={() => setEditAddressPopup(false)}>{langText.cancel[lang]}</button>
              <button className='rounded-full text-center bg-primary text-white hover:bg-secondary transition py-2 px-4 border cursor-pointer' onClick={handleUpdateAddress}>{langText.save[lang]}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function DeleteConfirmPopup({ address, onClose, onConfirm }) {
  const { lang } = useLangStore();

  return (
    <div className="fixed z-50 w-screen h-screen top-0 left-0 bg-[#00000066] flex items-center justify-center p-5">
      <div className="bg-white md:w-1/2 xl:w-1/3 w-full p-4 rounded-lg shadow-lg flex flex-col gap-4">
        <h2 className="text-lg font-semibold mb-2 capitalize">
          {lang === "AR" ? "تأكيد حذف العنوان" : "Confirm Delete Address"}
        </h2>

        <p className="text-sm text-gray">
          {lang === "AR"
            ? "هل أنت متأكد من رغبتك في حذف هذا العنوان؟"
            : "Are you sure you want to delete this address?"}
        </p>

        <div className="border border-light-gray rounded-lg p-4">
          <div className="grid grid-cols-12 gap-4 text-sm">
            <p className="sm:col-span-3 col-span-6 text-gray">{langText.addressName[lang]}</p>
            <p className="sm:col-span-9 col-span-6 font-semibold">{address?.customerAddressType}</p>
            <p className="sm:col-span-3 col-span-6 text-gray">{langText.address[lang]}</p>
            <p className="sm:col-span-9 col-span-6 font-semibold">{address?.customerAddressData}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            className="rounded-full text-center border-gray hover:bg-primary hover:border-primary hover:text-white transition py-2 px-4 border cursor-pointer"
            onClick={onClose}
          >
            {lang === "AR" ? "إلغاء" : "Cancel"}
          </button>
          <button
            className="rounded-full text-center bg-red-500 text-white hover:bg-red-700 transition py-2 px-4 border cursor-pointer"
            onClick={onConfirm}
          >
            {lang === "AR" ? "حذف" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}