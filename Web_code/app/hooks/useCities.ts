"use client";

// مدن ليبيا مع إحداثياتها
const libyanCities = [
  {
    value: "tripoli",
    label: "طرابلس",
    labelEn: "Tripoli",
    latlng: [32.8872, 13.1913],
    region: "طرابلس",
    regionEn: "Tripoli"
  },
  {
    value: "benghazi",
    label: "بنغازي",
    labelEn: "Benghazi",
    latlng: [32.1167, 20.0667],
    region: "بنغازي",
    regionEn: "Benghazi"
  },
  {
    value: "misrata",
    label: "مصراتة",
    labelEn: "Misrata",
    latlng: [32.3778, 15.0906],
    region: "مصراتة",
    regionEn: "Misrata"
  },
  {
    value: "tobruk",
    label: "طبرق",
    labelEn: "Tobruk",
    latlng: [32.0833, 23.9667],
    region: "طبرق",
    regionEn: "Tobruk"
  },
  {
    value: "sabha",
    label: "سبها",
    labelEn: "Sabha",
    latlng: [27.0333, 14.4333],
    region: "سبها",
    regionEn: "Sabha"
  },
  {
    value: "zawiya",
    label: "الزاوية",
    labelEn: "Zawiya",
    latlng: [32.7500, 12.7500],
    region: "الزاوية",
    regionEn: "Zawiya"
  },
  {
    value: "ajdabiya",
    label: "أجدابيا",
    labelEn: "Ajdabiya",
    latlng: [30.7500, 20.2167],
    region: "أجدابيا",
    regionEn: "Ajdabiya"
  },
  {
    value: "bayda",
    label: "البيضاء",
    labelEn: "Bayda",
    latlng: [32.7667, 21.7500],
    region: "البيضاء",
    regionEn: "Bayda"
  },
  {
    value: "derna",
    label: "درنة",
    labelEn: "Derna",
    latlng: [32.7667, 22.6333],
    region: "درنة",
    regionEn: "Derna"
  },
  {
    value: "ghat",
    label: "غات",
    labelEn: "Ghat",
    latlng: [24.9667, 10.1833],
    region: "غات",
    regionEn: "Ghat"
  },
  {
    value: "ghadames",
    label: "غدامس",
    labelEn: "Ghadames",
    latlng: [30.1333, 9.5000],
    region: "غدامس",
    regionEn: "Ghadames"
  },
  {
    value: "hun",
    label: "هون",
    labelEn: "Hun",
    latlng: [29.1167, 15.9500],
    region: "هون",
    regionEn: "Hun"
  },
  {
    value: "jalu",
    label: "جالو",
    labelEn: "Jalu",
    latlng: [29.0333, 21.5500],
    region: "جالو",
    regionEn: "Jalu"
  },
  {
    value: "kufra",
    label: "الكفرة",
    labelEn: "Kufra",
    latlng: [24.1833, 23.3167],
    region: "الكفرة",
    regionEn: "Kufra"
  },
  {
    value: "marj",
    label: "المرج",
    labelEn: "Marj",
    latlng: [32.4833, 20.8333],
    region: "المرج",
    regionEn: "Marj"
  },
  {
    value: "murzuq",
    label: "مرزق",
    labelEn: "Murzuq",
    latlng: [25.9167, 13.9167],
    region: "مرزق",
    regionEn: "Murzuq"
  },
  {
    value: "nufra",
    label: "نفرة",
    labelEn: "Nufra",
    latlng: [28.5000, 16.5167],
    region: "نفرة",
    regionEn: "Nufra"
  },
  {
    value: "sabrata",
    label: "صبراتة",
    labelEn: "Sabratha",
    latlng: [32.7833, 12.4833],
    region: "صبراتة",
    regionEn: "Sabratha"
  },
  {
    value: "sirte",
    label: "سرت",
    labelEn: "Sirte",
    latlng: [31.2000, 16.5833],
    region: "سرت",
    regionEn: "Sirte"
  },
  {
    value: "tarhuna",
    label: "ترهونة",
    labelEn: "Tarhuna",
    latlng: [32.4333, 13.6333],
    region: "ترهونة",
    regionEn: "Tarhuna"
  },
  {
    value: "ubari",
    label: "أوباري",
    labelEn: "Ubari",
    latlng: [26.5833, 12.7833],
    region: "أوباري",
    regionEn: "Ubari"
  },
  {
    value: "yafran",
    label: "يفرن",
    labelEn: "Yafran",
    latlng: [32.0667, 12.5333],
    region: "يفرن",
    regionEn: "Yafran"
  },
  {
    value: "zintan",
    label: "زنتان",
    labelEn: "Zintan",
    latlng: [31.9333, 12.2500],
    region: "زنتان",
    regionEn: "Zintan"
  }
];

const useCities = () => {
  const getAll = () => libyanCities;

  const getByValue = (value: string) => {
    return libyanCities.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue,
  };
};

export default useCities;
