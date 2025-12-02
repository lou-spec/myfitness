import { useState } from "react";

const countryCodes = [
  { code: "+351", country: "🇵🇹 Portugal", flag: "🇵🇹" },
  { code: "+34", country: "🇪🇸 Espanha", flag: "🇪🇸" },
  { code: "+33", country: "🇫🇷 França", flag: "🇫🇷" },
  { code: "+44", country: "🇬🇧 Reino Unido", flag: "🇬🇧" },
  { code: "+49", country: "🇩🇪 Alemanha", flag: "🇩🇪" },
  { code: "+39", country: "🇮🇹 Itália", flag: "🇮🇹" },
  { code: "+1", country: "🇺🇸 EUA", flag: "🇺🇸" },
  { code: "+55", country: "🇧🇷 Brasil", flag: "🇧🇷" },
  { code: "+244", country: "🇦🇴 Angola", flag: "🇦🇴" },
  { code: "+258", country: "🇲🇿 Moçambique", flag: "🇲🇿" },
];

function PhoneInput({ value, onChange, placeholder = "912 345 678" }) {
  const [countryCode, setCountryCode] = useState("+351");
  const [phoneNumber, setPhoneNumber] = useState("");

  const formatPhoneNumber = (input) => {
    // Remove tudo exceto números
    const numbers = input.replace(/\D/g, "");
    
    // Limita a 9 dígitos
    const limited = numbers.slice(0, 9);
    
    // Formata em grupos de 3
    const parts = [];
    for (let i = 0; i < limited.length; i += 3) {
      parts.push(limited.slice(i, i + 3));
    }
    
    return parts.join(" ");
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    
    // Remove espaços para enviar valor limpo
    const cleanNumber = formatted.replace(/\s/g, "");
    onChange(`${countryCode}${cleanNumber}`);
  };

  const handleCountryChange = (e) => {
    setCountryCode(e.target.value);
    const cleanNumber = phoneNumber.replace(/\s/g, "");
    onChange(`${e.target.value}${cleanNumber}`);
  };

  return (
    <div className="phone-input-container">
      <select 
        className="country-code-select" 
        value={countryCode} 
        onChange={handleCountryChange}
      >
        {countryCodes.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.code}
          </option>
        ))}
      </select>
      <input
        type="tel"
        className="phone-number-input"
        placeholder={placeholder}
        value={phoneNumber}
        onChange={handlePhoneChange}
        maxLength={11} // 9 dígitos + 2 espaços
      />
    </div>
  );
}

export default PhoneInput;

