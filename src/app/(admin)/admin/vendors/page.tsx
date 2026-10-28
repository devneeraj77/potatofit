"use client";

import React, { useState } from "react";
import {
  Store,
  Plus,
  MapPin,
  Phone,
  Search,
  Filter,
  Trash2,
  ShieldCheck,
  Tag,
} from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  category: "Vegetable Mandi" | "Organic Grocer" | "Dairy & Protein" | "Superfoods";
  city: string;
  address: string;
  phone: string;
  produceItems: string[];
  verified: boolean;
  rating: number;
  athletesMapped: number;
}

const INITIAL_VENDORS: Vendor[] = [
  {
    id: "v-1",
    name: "Shree Krishna Fresh Mandi",
    category: "Vegetable Mandi",
    city: "Indore",
    address: "Stall #14, Chhavani Sabzi Mandi",
    phone: "+91 98260 11492",
    produceItems: ["Sweet Potato", "Baby Spinach", "Bitter Gourd", "Broccoli", "Coriander"],
    verified: true,
    rating: 4.9,
    athletesMapped: 840,
  },
  {
    id: "v-2",
    name: "Narmada Valley Organic Store",
    category: "Organic Grocer",
    city: "Indore",
    address: "Scheme 54, Vijay Nagar",
    phone: "+91 94250 83921",
    produceItems: ["Desi Ghee", "A2 Paneer", "Black Rice", "Foxtail Millet", "Flaxseed"],
    verified: true,
    rating: 4.8,
    athletesMapped: 620,
  },
  {
    id: "v-3",
    name: "Aman Protein & Dairy Farm",
    category: "Dairy & Protein",
    city: "Bhopal",
    address: "Arera Colony, E-Sector",
    phone: "+91 97521 44810",
    produceItems: ["Raw Whey Curd", "Grass-fed Paneer", "Country Eggs", "Sprouts Mix"],
    verified: true,
    rating: 4.7,
    athletesMapped: 490,
  },
  {
    id: "v-4",
    name: "Apex BioNutrients Market",
    category: "Superfoods",
    city: "Delhi NCR",
    address: "Sector 18, Noida",
    phone: "+91 98110 99402",
    produceItems: ["Ashwagandha Root", "Spirulina Powder", "Moringa Greens", "Walnuts"],
    verified: false,
    rating: 4.5,
    athletesMapped: 280,
  },
  {
    id: "v-5",
    name: "Bengaluru South Farmer Cooperative",
    category: "Vegetable Mandi",
    city: "Bengaluru",
    address: "Malleswaram 8th Cross",
    phone: "+91 94480 32190",
    produceItems: ["Ragi Whole Grain", "Red Banana", "Country Beans", "Tender Coconut"],
    verified: true,
    rating: 4.9,
    athletesMapped: 1120,
  },
];

export default function VendorsManagementPage() {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New vendor form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<"Vegetable Mandi" | "Organic Grocer" | "Dairy & Protein" | "Superfoods">("Vegetable Mandi");
  const [newCity, setNewCity] = useState("Indore");
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newItems, setNewItems] = useState("");

  const handleToggleVerify = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, verified: !v.verified } : v))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this vendor?")) {
      setVendors((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAddress) return;

    const vendor: Vendor = {
      id: "v-" + Date.now().toString(36),
      name: newName.trim(),
      category: newCategory,
      city: newCity,
      address: newAddress.trim(),
      phone: newPhone.trim() || "+91 98000 00000",
      produceItems: newItems.split(",").map((i) => i.trim()).filter(Boolean),
      verified: true,
      rating: 5.0,
      athletesMapped: 0,
    };

    setVendors([vendor, ...vendors]);
    setShowAddModal(false);
    setNewName("");
    setNewAddress("");
    setNewPhone("");
    setNewItems("");
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.produceItems.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCity = cityFilter === "all" || v.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Hyper-Local Supply Chain
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs font-mono text-[#34d399]">Farmer &amp; Grocer Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            Local Grocers &amp; Vegetable Mandis
          </h1>
          <p className="text-xs text-[#505445] dark:text-[#CBD2C7]">
            Map athlete fuel recommendations directly to neighborhood stalls, seasonal vegetable farmers, and verified dairy suppliers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Local Vendor</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendor name, crop, or produce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-xs text-[#121815] dark:text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#757761]" />
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-xs text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
          >
            <option value="all">All Cities</option>
            <option value="Indore">Indore</option>
            <option value="Bhopal">Bhopal</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Bengaluru">Bengaluru</option>
          </select>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 hover:border-[#f7fe72]/50 transition-all flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#18211C] text-[#f7fe72] border border-[#757761]/35 font-bold">
                  {vendor.category}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleVerify(vendor.id)}
                  className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border cursor-pointer transition-colors ${
                    vendor.verified
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}
                  title="Click to toggle verification badge"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>{vendor.verified ? "Verified Partner" : "Pending Audit"}</span>
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#121815] dark:text-white flex items-center justify-between">
                  <span>{vendor.name}</span>
                  <span className="text-xs font-mono text-[#f7fe72] bg-black/40 px-1.5 py-0.5 rounded">
                    ★ {vendor.rating}
                  </span>
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#505445] dark:text-[#A0A493] mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#34d399] shrink-0" />
                  <span className="truncate">{vendor.address}, {vendor.city}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#757761] mt-1">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span>{vendor.phone}</span>
                </div>
              </div>

              {/* Produce tags */}
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase text-[#757761] block mb-1.5">
                  Available Athlete Produce:
                </span>
                <div className="flex flex-wrap gap-1">
                  {vendor.produceItems.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F6F5] dark:bg-[#141A16] text-[#505445] dark:text-[#CBD2C7] border border-[#757761]/20"
                    >
                      <Tag className="w-2.5 h-2.5 text-[#f7fe72]" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#757761]/15 text-[11px] font-mono">
              <span className="text-[#34d399] font-bold">
                {vendor.athletesMapped.toLocaleString()} Athletes Mapped
              </span>
              <button
                type="button"
                onClick={() => handleDelete(vendor.id)}
                className="text-[#757761] hover:text-red-400 p-1 transition-colors"
                title="Remove Vendor"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Vendor */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-[#0E1310] border border-[#757761]/35 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#757761]/25">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#f7fe72]" />
                <h3 className="text-base font-bold text-white">Register Local Vendor</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-[#757761] hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVendor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Store / Stall Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kisan Super Greens Mandi"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[#A0A493] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Vendor["category"])}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white focus:outline-none focus:border-[#f7fe72]"
                  >
                    <option value="Vegetable Mandi">Vegetable Mandi</option>
                    <option value="Organic Grocer">Organic Grocer</option>
                    <option value="Dairy & Protein">Dairy &amp; Protein</option>
                    <option value="Superfoods">Superfoods</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[#A0A493] mb-1">City Hub</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white focus:outline-none focus:border-[#f7fe72]"
                  >
                    <option value="Indore">Indore</option>
                    <option value="Bhopal">Bhopal</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Local Address / Stall Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stall #42, Mandi Gate 2, Palasia"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Phone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+91 98XXX XXXXX"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Produce Items (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Sweet Potato, Spinach, Paneer, Desi Eggs, Bananas"
                  value={newItems}
                  onChange={(e) => setNewItems(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#757761]/25">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl text-xs text-[#A0A493] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors cursor-pointer"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
