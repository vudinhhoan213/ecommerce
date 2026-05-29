import React from "react";

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onChange: (newQuantity: number) => void;
  className?: string;
  btnClassName?: string;
  inputClassName?: string;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  onChange,
  className,
  btnClassName,
  inputClassName,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      onChange(val);
    }
  };

  return (
    <div className={className}>
      <button className={btnClassName} onClick={onIncrease}>
        +
      </button>
      <input
        type="number"
        className={inputClassName}
        value={quantity}
        min={1}
        onChange={handleInputChange}
      />
      <button className={btnClassName} onClick={onDecrease}>
        -
      </button>
    </div>
  );
};

export default QuantityControl;
