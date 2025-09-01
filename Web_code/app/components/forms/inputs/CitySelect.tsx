"use client";
import useCities from "../../../hooks/useCities";
import Select from "react-select";
import { useTranslation } from "react-i18next";

export type CitySelectValue = {
  label: string;
  labelEn: string;
  latlng: number[];
  region: string;
  regionEn: string;
  value: string;
};

interface CitySelectProps {
  value?: CitySelectValue;
  onChange: (value: CitySelectValue) => void;
}

const CitySelect: React.FC<CitySelectProps> = ({ value, onChange }) => {
  const { getAll } = useCities();
  const { t, i18n } = useTranslation("common");

  const cities = getAll().map((city) => ({
    ...city,
    label: i18n.language === "ar" ? city.label : city.labelEn,
    region: i18n.language === "ar" ? city.region : city.regionEn,
  }));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t("select_city")}
      </label>
      <Select
        placeholder={t("choose_city")}
        isClearable
        options={cities}
        value={value}
        onChange={(value) => onChange(value as CitySelectValue)}
        formatOptionLabel={(option: CitySelectValue) => (
          <div className="flex flex-row items-center gap-3">
            <div className="text-2xl">🏙️</div>
            <div>
              <span className="font-medium">{option.label}</span>
              <span className="text-gray-500 ml-1">• {option.region}</span>
            </div>
          </div>
        )}
        classNames={{
          control: () =>
            "p-4 border-2 border-gray-300 hover:border-rose-400 focus:border-rose-500 transition-colors duration-200 rounded-lg shadow-sm",
          input: () => "text-lg",
          option: () => "text-lg p-3 hover:bg-rose-50 cursor-pointer",
          menu: () => "border border-gray-200 rounded-lg shadow-lg",
          placeholder: () => "text-gray-400",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 8,
          colors: {
            ...theme.colors,
            primary: "#f43f5e", // rose-500
            primary25: "#fef2f2", // rose-50
            primary50: "#fecdd3", // rose-200
            neutral0: "#ffffff",
            neutral5: "#f9fafb",
            neutral10: "#f3f4f6",
            neutral20: "#e5e7eb",
            neutral30: "#d1d5db",
            neutral40: "#9ca3af",
            neutral50: "#6b7280",
            neutral60: "#4b5563",
            neutral70: "#374151",
            neutral80: "#1f2937",
            neutral90: "#111827",
          },
        })}
      />
    </div>
  );
};

export default CitySelect;
