export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="flex flex-col mb-4 w-full">
      <label className="mb-1 text-gray-700 font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
