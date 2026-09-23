"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  Package,
  FileText,
  MapPin,
  UploadCloud,
  Check,
  X,
  Sparkles,
  CheckCircle2,
  Plus,
  Truck,
  Plane,
  Anchor,
} from "lucide-react";
import { usePortal } from "@/context/portal-context";
import {
  VehicleInfo,
  PartInfo,
  PartPreference,
  PartCondition,
  SavedAddress,
} from "@/types/portal";

const POPULAR_MAKES_AND_MODELS: Record<string, string[]> = {
  Toyota: ["Hilux GR Sport", "Hilux", "Hiace", "Land Cruiser", "Land Cruiser Prado", "RAV4", "Corolla", "Camry", "Yaris", "Prius", "Aqua", "C-HR", "Fortuner", "Other Toyota Model"],
  Nissan: ["Navara", "X-Trail", "Qashqai", "Patrol", "Leaf", "Juke", "Skyline", "Caravan", "Note", "Pathfinder", "Other Nissan Model"],
  Mazda: ["CX-5", "CX-3", "CX-8", "CX-9", "CX-30", "CX-60", "Mazda 3", "Mazda 6", "Mazda 2", "BT-50", "MX-5", "Other Mazda Model"],
  Honda: ["Civic", "Civic Type R", "CR-V", "HR-V", "Jazz / Fit", "Accord", "Odyssey", "ZR-V", "Vezel", "Other Honda Model"],
  Subaru: ["WRX", "WRX STI", "Outback", "Forester", "XV / Crosstrek", "Legacy", "Impreza", "BRZ", "Levorg", "Other Subaru Model"],
  Ford: ["Ranger", "Ranger Raptor", "Everest", "Transit", "Transit Custom", "Focus", "Escape", "Falcon", "Mustang", "Other Ford Model"],
  Mitsubishi: ["Triton", "Outlander", "Pajero", "Pajero Sport", "ASX", "Eclipse Cross", "Delica", "Lancer", "Other Mitsubishi Model"],
  Lexus: ["RX450h", "RX", "NX", "NX300h", "UX", "GX", "LX", "IS", "ES", "GS", "LC", "Other Lexus Model"],
  Isuzu: ["D-Max", "MU-X", "Forward / F-Series", "Elf / N-Series", "Giga / C-Series", "Other Isuzu Model"],
  Hyundai: ["Tucson", "Santa Fe", "i30 / i30 N", "Kona", "Staria", "Ioniq 5", "Ioniq 6", "Palisade", "Other Hyundai Model"],
  Kia: ["Sportage", "Sorento", "Carnival", "EV6", "EV9", "Seltos", "Cerato", "Stinger", "Other Kia Model"],
  Volkswagen: ["Amarok", "Golf", "Tiguan", "Transporter", "Crafter", "Passat", "Touareg", "Other VW Model"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "X1", "1 Series", "M3 / M4", "Other BMW Model"],
  "Mercedes-Benz": ["Sprinter", "Vito", "C-Class", "E-Class", "GLC", "GLE", "A-Class", "Other Mercedes Model"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "RS3 / RS4", "Other Audi Model"],
  Suzuki: ["Jimny", "Swift", "Vitara", "S-Cross", "Ignis", "Baleno", "Other Suzuki Model"],
  Other: ["Other / Custom Vehicle Model"],
};

const AVAILABLE_YEARS = Array.from({ length: 2026 - 1995 + 1 }, (_, i) => 2026 - i);

export function NewRequestPage() {
  const router = useRouter();
  const { submitNewRequest, savedAddresses, addSavedAddress } = usePortal();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    label: "",
    recipientName: "",
    streetAddress: "",
    suburb: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [submittedRequestNumber, setSubmittedRequestNumber] = useState<string | null>(null);
  const [submittedRequestDetails, setSubmittedRequestDetails] = useState<any>(null);

  const handleAddNewAddress = () => {
    if (!newAddressForm.label || !newAddressForm.streetAddress || !newAddressForm.city) return;
    const newAddress: SavedAddress = {
      id: "addr-" + Date.now(),
      ...newAddressForm,
      businessName: "Custom Location",
    };
    addSavedAddress(newAddress);
    setIsAddingAddress(false);
    setSelectedAddress(newAddress);
    setNewAddressForm({ label: "", streetAddress: "", suburb: "", city: "", postalCode: "", recipientName: "", phone: "" });
  };

  // Form states
  const [vehicle, setVehicle] = useState<VehicleInfo>({
    make: "",
    model: "",
    year: "",
    vin: "",
    registration: "",
    engine: "",
    variant: "",
    transmission: "",
    driveConfig: "",
  });

  const [part, setPart] = useState<PartInfo>({
    name: "",
    partNumber: "",
    quantity: 1,
    condition: "New",
  });

  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [freightPreference, setFreightPreference] = useState<"Air Express" | "Sea Freight" | "No Preference">("Air Express");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) {
      alert("Please add a delivery address.");
      return;
    }
    const created = submitNewRequest({
      vehicle,
      part,
      supporting: {
        notes,
        photos,
        documents,
        freightPreference,
      },
      deliveryAddress: selectedAddress,
    });

    setSubmittedRequestDetails({
      vehicle,
      part,
      selectedAddress,
    });
    setSubmittedRequestNumber(created.requestNumber);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-[#B30D12] border border-red-100 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
            Door-To-Door Sourcing
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
            Submit New Vehicle Part Request
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Specify your vehicle details and part requirements. Autohub coordinates sourcing through our global supplier and logistics network.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/customer/requests")}
          className="px-4 py-2 text-xs font-bold bg-white border-[1px] border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* SECTION 1: VEHICLE IDENTIFICATION */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Car className="w-5 h-5 text-[#B30D12]" />
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">
              1. Vehicle Identification
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Make *
              </label>
              <input
                type="text"
                required
                value={vehicle.make}
                onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none bg-white"
                placeholder="e.g. Toyota"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Model *
              </label>
              <input
                type="text"
                required
                value={vehicle.model}
                onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none bg-white"
                placeholder="e.g. Hilux"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Model Variant
              </label>
              <input
                type="text"
                value={vehicle.variant || ""}
                onChange={(e) => setVehicle({ ...vehicle, variant: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none"
                placeholder="e.g. SR5, VXR, Nismo"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Model Year *
              </label>
              <input
                type="number"
                required
                value={vehicle.year}
                onChange={(e) =>
                  setVehicle({ ...vehicle, year: parseInt(e.target.value) || "" })
                }
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none bg-white"
                placeholder="e.g. 2024"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                VIN / Chassis Number (Mandatory) *{" "}
                <span className="text-[9px] text-red-500 font-normal ml-2 normal-case">
                  17-character VIN or JDM Chassis
                </span>
              </label>
              <input
                type="text"
                required
                value={vehicle.vin}
                onChange={(e) => setVehicle({ ...vehicle, vin: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none"
                placeholder="e.g. MR0HA3CD800192841"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                NZ Registration Plate (Optional)
              </label>
              <input
                type="text"
                value={vehicle.registration || ""}
                onChange={(e) => setVehicle({ ...vehicle, registration: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono uppercase focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none"
                placeholder="e.g. NZZ482"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Engine Code / Displacement
              </label>
              <input
                type="text"
                value={vehicle.engine || ""}
                onChange={(e) => setVehicle({ ...vehicle, engine: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none"
                placeholder="e.g. 1GD-FTV 2.8L"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Transmission
              </label>
              <select
                value={vehicle.transmission || ""}
                onChange={(e) =>
                  setVehicle({ ...vehicle, transmission: e.target.value })
                }
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none bg-white"
              >
                <option value="" disabled>Select Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Drive Configuration
              </label>
              <select
                value={vehicle.driveConfig || ""}
                onChange={(e) =>
                  setVehicle({ ...vehicle, driveConfig: e.target.value })
                }
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none bg-white"
              >
                <option value="" disabled>Select Drive Config</option>
                <option value="4WD (Selectable/Low)">4WD (Selectable/Low)</option>
                <option value="AWD">AWD</option>
                <option value="RWD">RWD</option>
                <option value="FWD">FWD</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: PART REQUIREMENTS & SPECIFICATION */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Package className="w-5 h-5 text-[#B30D12]" />
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">
              2. Part Requirements & Specification
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Part Name / Description *
              </label>
              <input
                type="text"
                required
                value={part.name}
                onChange={(e) => setPart({ ...part, name: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none"
                placeholder="e.g. Genuine Alternator 12V 130A Assembly"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Quantity Required *
              </label>
              <input
                type="number"
                min={1}
                required
                value={part.quantity}
                onChange={(e) =>
                  setPart({ ...part, quantity: parseInt(e.target.value) || 1 })
                }
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                OEM Part Number (If Known)
              </label>
              <input
                type="text"
                value={part.partNumber || ""}
                onChange={(e) => setPart({ ...part, partNumber: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none"
                placeholder="e.g. 27060-0E050"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Condition Request
              </label>
              <select
                value={part.condition}
                onChange={(e) =>
                  setPart({ ...part, condition: e.target.value as PartCondition })
                }
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none bg-white"
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: FREIGHT PREFERENCE */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-5 h-5 text-[#B30D12]" />
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">
              3. Freight Preference
            </h2>
          </div>

          <p className="text-xs text-slate-500">
            Select your preferred freight method. This helps us prioritise the right logistics channel when preparing your quote.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Air Express */}
            <div
              onClick={() => setFreightPreference("Air Express")}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2 relative ${freightPreference === "Air Express"
                ? "border-[#0ea5e9] bg-sky-50/50"
                : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${freightPreference === "Air Express" ? "bg-[#0ea5e9] text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                  <Plane className="w-4 h-4" />
                </div>
                <span className="font-bold text-[13px] text-slate-900">Air Express</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Priority air freight — fastest transit, typically 7–10 business days door-to-door.
              </p>
              {freightPreference === "Air Express" && (
                <div className="absolute top-3 right-3 text-[#0ea5e9]">
                  <CheckCircle2 className="w-5 h-5 stroke-[1.5]" />
                </div>
              )}
            </div>

            {/* Sea Freight */}
            <div
              onClick={() => setFreightPreference("Sea Freight")}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2 relative ${freightPreference === "Sea Freight"
                ? "border-[#0ea5e9] bg-sky-50/50"
                : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${freightPreference === "Sea Freight" ? "bg-[#0ea5e9] text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                  <Anchor className="w-4 h-4" />
                </div>
                <span className="font-bold text-[13px] text-slate-900">Sea Freight</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Consolidated sea freight — cost-effective option, typically 25–40 business days.
              </p>
              {freightPreference === "Sea Freight" && (
                <div className="absolute top-3 right-3 text-[#0ea5e9]">
                  <CheckCircle2 className="w-5 h-5 stroke-[1.5]" />
                </div>
              )}
            </div>

            {/* No Preference */}
            <div
              onClick={() => setFreightPreference("No Preference")}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2 relative ${freightPreference === "No Preference"
                ? "border-[#0ea5e9] bg-sky-50/50"
                : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${freightPreference === "No Preference" ? "bg-[#0ea5e9] text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                  <Package className="w-4 h-4" />
                </div>
                <span className="font-bold text-[13px] text-slate-900">No Preference</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Let Autohub recommend the best freight option based on cost, weight, and urgency.
              </p>
              {freightPreference === "No Preference" && (
                <div className="absolute top-3 right-3 text-[#0ea5e9]">
                  <CheckCircle2 className="w-5 h-5 stroke-[1.5]" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: SUPPORTING FILES */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-[#B30D12]" />
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">
              4. Supporting Photos
            </h2>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Customer Notes / Fitting Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any specific details, urgency, or fitment notes..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Supporting Photos
              </label>
              <label className="block border-2 border-dashed border-slate-200 hover:border-[#B30D12]/60 rounded-lg p-5 text-center cursor-pointer transition-colors bg-slate-50/50">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, .pdf, .doc, .docx"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      const newPhotos: string[] = [];
                      const newDocs: string[] = [];
                      Array.from(e.target.files).forEach(f => {
                        if (f.type.startsWith('image/')) {
                          newPhotos.push(URL.createObjectURL(f));
                        } else {
                          newDocs.push(f.name);
                        }
                      });
                      if (newPhotos.length > 0) setPhotos([...photos, ...newPhotos]);
                      if (newDocs.length > 0) setDocuments([...documents, ...newDocs]);
                    }
                  }}
                />
                <UploadCloud className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                <p className="text-[11px] text-slate-600 font-medium">
                  Drag files here or <span className="text-[#B30D12] font-bold">browse</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP, PDF or DOCX up to 10MB</p>
              </label>
              {(photos.length > 0 || documents.length > 0) && (
                <div className="space-y-3 mt-3">
                  {photos.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {photos.map((url, i) => (
                        <div key={i} className="relative w-12 h-12 rounded-md overflow-hidden border border-slate-200 group bg-slate-100">
                          {url.startsWith('http') || url.startsWith('blob') ? (
                            <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400 break-all p-1 text-center">{url}</div>
                          )}
                          <button type="button" onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {documents.length > 0 && (
                    <div className="space-y-1.5">
                      {documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                          <span className="font-mono text-slate-700 truncate mr-2">{doc}</span>
                          <button type="button" onClick={() => setDocuments(documents.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500 shrink-0">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 5: DELIVERY */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-[#B30D12]" />
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">
              5. Delivery Address
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedAddress && (
              <div className="p-3 rounded-lg border-2 border-[#B30D12] bg-red-50/10 transition-all flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      {selectedAddress.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {selectedAddress.streetAddress}, {selectedAddress.suburb}, {selectedAddress.city} {selectedAddress.postalCode}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Contact: {selectedAddress.recipientName} • {selectedAddress.phone}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-[#B30D12] bg-[#B30D12] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <button type="button" onClick={() => setSelectedAddress(null)} className="text-[10px] text-red-500 hover:underline font-medium">Remove</button>
                </div>
              </div>
            )}

            {/* Add New Address Card / Form */}
            {isAddingAddress ? (
              <div className="md:col-span-2 p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 space-y-4 animate-in fade-in zoom-in duration-200">
                <h3 className="text-[13px] font-bold text-slate-900 mb-2">New Delivery Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Location Label (e.g. South Branch)" className="w-full text-xs p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12]" value={newAddressForm.label} onChange={e => setNewAddressForm({ ...newAddressForm, label: e.target.value })} />
                  <input type="text" placeholder="Recipient Name" className="w-full text-xs p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12]" value={newAddressForm.recipientName} onChange={e => setNewAddressForm({ ...newAddressForm, recipientName: e.target.value })} />
                  <input type="text" placeholder="Street Address" className="w-full text-xs p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12]" value={newAddressForm.streetAddress} onChange={e => setNewAddressForm({ ...newAddressForm, streetAddress: e.target.value })} />
                  <input type="text" placeholder="Suburb" className="w-full text-xs p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12]" value={newAddressForm.suburb} onChange={e => setNewAddressForm({ ...newAddressForm, suburb: e.target.value })} />
                  <input type="text" placeholder="City" className="w-full text-xs p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12]" value={newAddressForm.city} onChange={e => setNewAddressForm({ ...newAddressForm, city: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Postcode" className="w-full text-xs p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12]" value={newAddressForm.postalCode} onChange={e => setNewAddressForm({ ...newAddressForm, postalCode: e.target.value })} />
                    <input type="text" placeholder="Phone" className="w-full text-xs p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#B30D12]/20 focus:border-[#B30D12]" value={newAddressForm.phone} onChange={e => setNewAddressForm({ ...newAddressForm, phone: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="button" onClick={() => setIsAddingAddress(false)} className="px-5 py-2 text-xs font-bold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">Cancel</button>
                  <button type="button" onClick={handleAddNewAddress} className="px-5 py-2 text-xs font-bold bg-[#B30D12] hover:bg-[#9B0A0F] text-white rounded-lg shadow-sm transition-colors">Save Address</button>
                </div>
              </div>
            ) : (
              !selectedAddress && (
                <div
                  onClick={() => setIsAddingAddress(true)}
                  className="p-3 rounded-lg border-2 border-dashed border-slate-200 hover:border-[#B30D12]/50 bg-slate-50/50 hover:bg-red-50/20 cursor-pointer transition-all flex flex-col items-center justify-center text-slate-500 hover:text-[#B30D12] group min-h-[100px]"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#B30D12]/10 flex items-center justify-center mb-1.5 transition-colors">
                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#B30D12] transition-colors" />
                  </div>
                  <span className="font-bold text-xs group-hover:text-slate-900 transition-colors">Add New Address</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Ship to a different workshop</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* SUBMIT ACTIONS */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/customer/requests")}
            className="w-full sm:w-auto px-6 py-2.5 text-[13px] font-bold bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Cancel & Discard
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#B30D12] hover:bg-[#9B0A0F] text-white font-bold text-[13px] rounded-xl shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Part Request to Autohub Sourcing</span>
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {submittedRequestNumber && submittedRequestDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[550px] rounded-[24px] shadow-2xl p-10 text-center space-y-7 animate-in zoom-in-95 duration-200">
            <div className="w-[72px] h-[72px] bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-3">
              <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold uppercase tracking-wider">
                Request Generated & Submitted
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Request Number: <span className="text-[#B30D12] font-mono">{submittedRequestNumber}</span>
              </h3>
              <p className="text-[13px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                Your part request has been dispatched to Autohub Sourcing specialists in Japan and overseas distribution centers. You will receive an immediate quote alert once pricing and freight are locked.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left text-[13px] space-y-3.5 mt-2">
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-500 shrink-0">Target Vehicle:</span>
                <span className="font-bold text-slate-800 text-right">
                  {submittedRequestDetails.vehicle.year} {submittedRequestDetails.vehicle.make} {submittedRequestDetails.vehicle.model}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-500 shrink-0">VIN / Chassis:</span>
                <span className="font-mono font-semibold text-slate-800 text-right">
                  {submittedRequestDetails.vehicle.vin}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-500 shrink-0">Part Requested:</span>
                <span className="font-semibold text-slate-800 text-right truncate" title={submittedRequestDetails.part.name}>
                  {submittedRequestDetails.part.name}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-500 shrink-0">Delivery Address:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {submittedRequestDetails.selectedAddress?.label}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => router.push("/customer/requests")}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#B30D12] hover:bg-[#9B0A0F] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-red-500/20 transition-all"
              >
                Return to Requests List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
