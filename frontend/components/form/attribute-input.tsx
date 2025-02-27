import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface AttributeInputProps {
  traitType: string;
  attributeValue: string;
  setTraitType: (value: string) => void;
  setAttributeValue: (value: string) => void;
  handleAddAttribute: () => void;
}

const AttributeInput: React.FC<AttributeInputProps> = ({
  traitType,
  attributeValue,
  setTraitType,
  setAttributeValue,
  handleAddAttribute,
}) => {
  const t = useTranslations("mint");

  return (
    <div>
      <Label>
        {t("Attributes")}{" "}
        <span className="text-gray-600">({t("Optional")})</span>
      </Label>
      <div className="mt-2 flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={t("trait_type_placeholder")}
            value={traitType}
            onChange={(e) => setTraitType(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Input
            type="text"
            placeholder={t("value_placeholder")}
            value={attributeValue}
            onChange={(e) => setAttributeValue(e.target.value)}
          />
        </div>
        <Button onClick={handleAddAttribute}>{t("Add")}</Button>
      </div>
    </div>
  );
};

export default AttributeInput;
