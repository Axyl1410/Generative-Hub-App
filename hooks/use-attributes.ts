import { useState } from "react";
import { toast } from "sonner";

interface Attribute {
  trait_type: string;
  value: string;
}

const useAttributes = () => {
  const [traitType, setTraitType] = useState<string>("");
  const [attributeValue, setAttributeValue] = useState<string>("");
  const [attributesArray, setAttributesArray] = useState<Attribute[]>([]);

  const handleAddAttribute = () => {
    if (traitType.trim() && attributeValue.trim()) {
      setAttributesArray([
        ...attributesArray,
        { trait_type: traitType, value: attributeValue },
      ]);
      setTraitType("");
      setAttributeValue("");
    } else toast.error("Attribute type and value cannot be empty");
  };

  const handleRemoveAttribute = (indexToRemove: number) => {
    setAttributesArray(
      attributesArray.filter((_, index) => index !== indexToRemove)
    );
  };

  return {
    traitType,
    setTraitType,
    attributeValue,
    setAttributeValue,
    attributesArray,
    handleAddAttribute,
    handleRemoveAttribute,
  };
};

export default useAttributes;
