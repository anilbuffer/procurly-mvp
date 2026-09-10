"use client";

import React, { useState } from "react";
import {
  X,
  Car,
  Package,
  FileText,
  MapPin,
  CheckCircle2,
  UploadCloud,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Check,
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
  Toyota: [
    "Hilux GR Sport",
    "Hilux",
    "Hiace",
    "Land Cruiser",
    "Land Cruiser Prado",
    "RAV4",
    "Corolla",
    "Camry",
    "Yaris",
    "Prius",
    "Aqua",
    "C-HR",
    "Fortuner",
    "Other Toyota Model",
  ],
  Nissan: [
    "Navara",
    "X-Trail",
    "Qashqai",
    "Patrol",
    "Leaf",
    "Juke",
    "Skyline",
    "Caravan",
    "Note",
    "Pathfinder",
    "Other Nissan Model",
  ],
  Mazda: [
    "CX-5",
    "CX-3",
    "CX-8",
    "CX-9",
    "CX-30",
    "CX-60",
    "Mazda 3",
    "Mazda 6",
    "Mazda 2",
    "BT-50",
    "MX-5",
    "Other Mazda Model",
  ],
  Honda: [
    "Civic",
    "Civic Type R",
    "CR-V",
    "HR-V",
    "Jazz / Fit",
    "Accord",
    "Odyssey",
    "ZR-V",
    "Vezel",
    "Other Honda Model",
  ],
  Subaru: [
    "WRX",
    "WRX STI",
    "Outback",
    "Forester",
    "XV / Crosstrek",
    "Legacy",
    "Impreza",
    "BRZ",
    "Levorg",
    "Other Subaru Model",
  ],
  Ford: [
    "Ranger",
    "Ranger Raptor",
    "Everest",
    "Transit",
    "Transit Custom",
    "Focus",
    "Escape",
    "Falcon",
    "Mustang",
    "Other Ford Model",
  ],
  Mitsubishi: [
    "Triton",
    "Outlander",
    "Pajero",
    "Pajero Sport",
    "ASX",
    "Eclipse Cross",
    "Delica",
    "Lancer",
    "Other Mitsubishi Model",
  ],
  Lexus: [
    "RX450h",
    "RX",
    "NX",
    "NX300h",
    "UX",
    "GX",
    "LX",
    "IS",
    "ES",
    "GS",
    "LC",
    "Other Lexus Model",
  ],
  Isuzu: [
    "D-Max",
    "MU-X",
    "Forward / F-Series",
    "Elf / N-Series",
    "Giga / C-Series",
    "Other Isuzu Model",
  ],
  Hyundai: [
    "Tucson",
    "Santa Fe",
    "i30 / i30 N",
    "Kona",
    "Staria",
    "Ioniq 5",
    "Ioniq 6",
    "Palisade",
    "Other Hyundai Model",
  ],
  Kia: [
    "Sportage",
    "Sorento",
    "Carnival",
    "EV6",
    "EV9",
    "Seltos",
    "Cerato",
    "Stinger",
    "Other Kia Model",
  ],
  Volkswagen: [
    "Amarok",
    "Golf",
    "Tiguan",
    "Transporter",
    "Crafter",
    "Passat",
    "Touareg",
    "Other VW Model",
  ],
  BMW: [
    "3 Series",
    "5 Series",
    "X3",
    "X5",
    "X1",
    "1 Series",
    "M3 / M4",
    "Other BMW Model",
  ],
  "Mercedes-Benz": [
    "Sprinter",
    "Vito",
    "C-Class",
    "E-Class",
    "GLC",
    "GLE",
    "A-Class",
    "Other Mercedes Model",
  ],
  Audi: [
    "A3",
    "A4",
    "A6",
    "Q3",
    "Q5",
    "Q7",
    "RS3 / RS4",
    "Other Audi Model",
  ],
  Suzuki: [
    "Jimny",
    "Swift",
    "Vitara",
    "S-Cross",
    "Ignis",
    "Baleno",
    "Other Suzuki Model",
  ],
  Other: ["Other / Custom Vehicle Model"],
};

const AVAILABLE_YEARS = Array.from({ length: 2026 - 1995 + 1 }, (_, i) => 2026 - i);

export function NewRequestModal() {
  const {
    isNewRequestModalOpen,
    setIsNewRequestModalOpen,
    submitNewRequest,
    savedAddresses,
  } = usePortal();

  // Step state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [submittedRequestNumber, setSubmittedRequestNumber] = useState<string | null>(null);

  // Form states
  const [vehicle, setVehicle] = useState<VehicleInfo>({
    make: "Toyota",
    model: "Hilux GR Sport",
    year: 2024,
    vin: "MR0HA3CD600129",
    registration: "SPM442",
    engine: "1GD-FTV 2.8L Turbo Diesel",
    variant: "Widebody Edition",
    transmission: "6-Speed Automatic",
    driveConfig: "4WD",
  });

  const [part, setPart] = useState<PartInfo>({
    name: "Front Brake Caliper Assembly (RHS)",
    partNumber: "47730-0K310",
    quantity: 1,
    preference: "Genuine OEM",
    condition: "Brand New OEM",
  });

  const [notes, setNotes] = useState(
    "Urgent replacement required for customer fleet service. Must be genuine factory sealed."
  );
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=80",
  ]);
  const [documents, setDocuments] = useState<string[]>([
    "Toyota_Workshop_Diagram_Section4.pdf",
  ]);

  const [selectedAddress, setSelectedAddress] = useState<SavedAddress>(
    savedAddresses[0]
  );

  if (!isNewRequestModalOpen) return null;

  const handleClose = () => {
    setIsNewRequestModalOpen(false);
    setSubmittedRequestNumber(null);
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = submitNewRequest({
      vehicle,
      part,
      supporting: {
        notes,
        photos,
        documents,
      },
      deliveryAddress: selectedAddress,
    });
    setSubmittedRequestNumber(created.requestNumber);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ED2025] to-[#B91C1C] flex items-center justify-center shadow-md shadow-red-500/20 text-white font-black text-sm">
              +
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                New Part Procurement Request
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Direct sourcing inquiry through Autohub Global Trade Network
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedRequestNumber ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
                Request Generated & Submitted
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Request Number:{" "}
                <span className="text-[#ED2025] font-mono font-black">
                  {submittedRequestNumber}
                </span>
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your part request has been dispatched to Autohub Sourcing specialists
                in Japan and overseas distribution centers. You will receive an
                immediate quote alert once pricing and freight are locked.
              </p>
            </div>

            {/* Overview Card */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Vehicle:</span>
                <span className="font-bold text-slate-800">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VIN / Chassis:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {vehicle.vin}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Part Requested:</span>
                <span className="font-semibold text-slate-800">{part.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="font-semibold text-slate-800">
                  {selectedAddress.label}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Form */
          <div>
            {/* Step navigation tabs */}
            <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50/40 text-xs">
              {[
                { num: 1, label: "Vehicle Info", icon: Car },
                { num: 2, label: "Part Details", icon: Package },
                { num: 3, label: "Supporting & Files", icon: FileText },
                { num: 4, label: "Delivery & Submit", icon: MapPin },
              ].map((s) => {
                const Icon = s.icon;
                const isActive = step === s.num;
                const isPassed = step > s.num;
                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => setStep(s.num as 1 | 2 | 3 | 4)}
                    className={`p-3 text-center flex items-center justify-center gap-2 border-b-2 font-bold transition-all ${
                      isActive
                        ? "border-[#ED2025] text-[#ED2025] bg-white shadow-xs"
                        : isPassed
                        ? "border-emerald-500 text-emerald-700 bg-emerald-50/30"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* STEP 1: VEHICLE INFORMATION */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Car className="w-4 h-4 text-[#ED2025]" />
                    <span>Enter complete vehicle identification details for exact fitment</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Make Select */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Make *
                      </label>
                      <select
                        required
                        value={vehicle.make}
                        onChange={(e) => {
                          const newMake = e.target.value;
                          const models = POPULAR_MAKES_AND_MODELS[newMake] || ["Other Model"];
                          setVehicle({ ...vehicle, make: newMake, model: models[0] });
                        }}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none bg-white font-medium cursor-pointer"
                      >
                        {Object.keys(POPULAR_MAKES_AND_MODELS).map((mk) => (
                          <option key={mk} value={mk}>
                            {mk}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Model Select */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Model *
                      </label>
                      <select
                        required
                        value={vehicle.model}
                        onChange={(e) =>
                          setVehicle({ ...vehicle, model: e.target.value })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none bg-white font-medium cursor-pointer"
                      >
                        {(
                          POPULAR_MAKES_AND_MODELS[vehicle.make] || [
                            "Other / Custom Model",
                          ]
                        ).map((mdl) => (
                          <option key={mdl} value={mdl}>
                            {mdl}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Year Select */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Year *
                      </label>
                      <select
                        required
                        value={vehicle.year}
                        onChange={(e) =>
                          setVehicle({
                            ...vehicle,
                            year: parseInt(e.target.value) || 2024,
                          })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none bg-white font-medium cursor-pointer"
                      >
                        {AVAILABLE_YEARS.map((yr) => (
                          <option key={yr} value={yr}>
                            {yr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        VIN / Chassis Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={vehicle.vin}
                        onChange={(e) =>
                          setVehicle({ ...vehicle, vin: e.target.value })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none"
                        placeholder="e.g. GDH201-0012845"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Registration (Optional)
                      </label>
                      <input
                        type="text"
                        value={vehicle.registration || ""}
                        onChange={(e) =>
                          setVehicle({ ...vehicle, registration: e.target.value })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono uppercase focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none"
                        placeholder="e.g. MTB842"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Engine (Optional)
                      </label>
                      <input
                        type="text"
                        value={vehicle.engine || ""}
                        onChange={(e) =>
                          setVehicle({ ...vehicle, engine: e.target.value })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none"
                        placeholder="e.g. 1GD-FTV 2.8L"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Variant (Optional)
                      </label>
                      <input
                        type="text"
                        value={vehicle.variant || ""}
                        onChange={(e) =>
                          setVehicle({ ...vehicle, variant: e.target.value })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none"
                        placeholder="e.g. GL / DX / SR5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Transmission (Optional)
                      </label>
                      <input
                        type="text"
                        value={vehicle.transmission || ""}
                        onChange={(e) =>
                          setVehicle({ ...vehicle, transmission: e.target.value })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none"
                        placeholder="e.g. 6-Speed Automatic"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Drive Configuration (Optional)
                      </label>
                      <select
                        value={vehicle.driveConfig || "4WD"}
                        onChange={(e) =>
                          setVehicle({ ...vehicle, driveConfig: e.target.value })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none"
                      >
                        <option value="4WD">4WD / All-Wheel Drive</option>
                        <option value="RWD">RWD / Rear-Wheel Drive</option>
                        <option value="FWD">FWD / Front-Wheel Drive</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PART INFORMATION */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Package className="w-4 h-4 text-[#ED2025]" />
                    <span>Specify part requirements, preference, and condition</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Part Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={part.name}
                      onChange={(e) => setPart({ ...part, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none"
                      placeholder="e.g. Left Front Lower Control Arm Assembly"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        OEM Part Number (Optional if known)
                      </label>
                      <input
                        type="text"
                        value={part.partNumber || ""}
                        onChange={(e) =>
                          setPart({ ...part, partNumber: e.target.value })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none"
                        placeholder="e.g. 48069-26150"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={part.quantity}
                        onChange={(e) =>
                          setPart({
                            ...part,
                            quantity: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Genuine / Aftermarket Preference *
                      </label>
                      <select
                        value={part.preference}
                        onChange={(e) =>
                          setPart({
                            ...part,
                            preference: e.target.value as PartPreference,
                          })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none"
                      >
                        <option value="Genuine OEM">Genuine OEM Factory</option>
                        <option value="OEM Supplier Tier 1">
                          OEM Supplier Tier 1 (Denso, Aisin, KYB)
                        </option>
                        <option value="Quality Aftermarket">Quality Aftermarket</option>
                        <option value="Any Suitable Alternative">
                          Any Suitable Alternative
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Condition Requirement *
                      </label>
                      <select
                        value={part.condition}
                        onChange={(e) =>
                          setPart({
                            ...part,
                            condition: e.target.value as PartCondition,
                          })
                        }
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none"
                      >
                        <option value="Brand New OEM">Brand New OEM</option>
                        <option value="Brand New Certified Aftermarket">
                          Brand New Certified Aftermarket
                        </option>
                        <option value="Used Grade A">
                          Used Grade A (Inspected)
                        </option>
                        <option value="Remanufactured">
                          Remanufactured / Reconditioned
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SUPPORTING INFORMATION & FILES */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <FileText className="w-4 h-4 text-[#ED2025]" />
                    <span>Upload photos, parts diagrams, and workshop notes</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Customer Notes / Fitting Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any specific details, urgency, or fitment notes..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ED2025]/20 focus:border-[#ED2025] outline-none"
                    />
                  </div>

                  {/* Photo Upload Dropzone */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Multiple Photos (Damage / Existing Part)
                    </label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-[#ED2025]/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50">
                      <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 font-medium">
                        Drag photos here or{" "}
                        <span className="text-[#ED2025] font-bold">browse</span>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        PNG, JPG or WEBP up to 10MB
                      </p>
                    </div>

                    {photos.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {photos.map((url, i) => (
                          <div
                            key={i}
                            className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 group"
                          >
                            <img
                              src={url}
                              alt="Part preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setPhotos(photos.filter((_, idx) => idx !== i))
                              }
                              className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* PDF Attachments */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      PDF Attachments & Supporting Documents
                    </label>
                    <div className="space-y-1.5">
                      {documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                        >
                          <span className="font-mono text-slate-700">{doc}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setDocuments(documents.filter((_, i) => i !== idx))
                            }
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: DELIVERY ADDRESS & SUBMIT */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <MapPin className="w-4 h-4 text-[#ED2025]" />
                    <span>Select saved delivery workshop address before submitting</span>
                  </div>

                  <div className="space-y-2">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddress.id === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddress(addr)}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                            isSelected
                              ? "border-[#ED2025] bg-red-50/10"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">
                                {addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600">
                              {addr.streetAddress}, {addr.suburb}, {addr.city}{" "}
                              {addr.postalCode}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Contact: {addr.recipientName} • {addr.phone}
                            </p>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-[#ED2025] bg-[#ED2025] text-white"
                                : "border-slate-300"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2 text-xs text-blue-900">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Automatic Request Code:</strong> Submitting will lock
                      your request and generate a tracked procurement reference in format{" "}
                      <code className="font-mono font-bold bg-white px-1 py-0.5 rounded text-blue-700">
                        AH-P-000XXX
                      </code>
                      .
                    </p>
                  </div>
                </div>
              )}

              {/* Form Navigation Buttons */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep((step + 1) as 1 | 2 | 3 | 4)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#ED2025] hover:bg-[#d11a1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-red-500/30 hover:shadow-lg transition-all transform active:scale-95"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Generate Request & Submit</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
