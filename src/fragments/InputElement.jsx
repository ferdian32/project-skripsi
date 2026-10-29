const InputElement = ({ type, name, id, placeholder, onChange }) => {
  return (
    <div className="py-2">
      <label htmlFor={id} className="block">
        {name}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};
export default InputElement;
