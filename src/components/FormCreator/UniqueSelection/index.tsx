import { CancelOutlined } from "@mui/icons-material";
import SquaredDownArrow from "@/assets/icons/SquaredDownArrow";
import SquaredUpArrow from "@/assets/icons/SquaredUpArrow";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState, useEffect, use } from "react";
import BaseComponent from "../BaseComponent";
import BaseContent from "../BaseContent";
import BaseTitle from "../BaseTitle";
import BaseFooter from "../BaseFooter";

import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { updateElement } from "../../../../redux/surveySlice";

interface EditableCheckbox {
  id: string;
  label: string;
  enabled: boolean;
}

interface UniqueSelectionProps {
  pageIndex: number;
  elementIndex: number;
  onCopy: () => void;
  onDelete: () => void;
  onMove: () => void;
}

const UniqueSelection: React.FC<UniqueSelectionProps> = ({
  pageIndex,
  elementIndex,
  onCopy,
  onDelete,
  onMove,
}) => {
  const dispatch = useDispatch();

  const element = useSelector(
    (state: any) =>
      state.survey.surveyJson.pages[pageIndex]?.elements[elementIndex]
  );
  const [question, setQuestion] = useState<string>(element?.name || "");
  const [type, setType] = useState<string>("text");
  const [required, setRequired] = useState<boolean>(element?.required || false);
  const [options, setOptions] = useState<EditableCheckbox[]>(
    element?.options || [
      { id: "1", label: "Muito Frequentemente", enabled: true },
      { id: "2", label: "Raramente", enabled: true },
      { id: "3", label: "Item 2", enabled: false },
      { id: "4", label: "Item 3", enabled: false },
      { id: "5", label: "Nenhum", enabled: false },
      { id: "6", label: "Outro (Descreva)", enabled: false },
    ]
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const updateElementChoices = () => {
    console.log("updateElementChoices", options);

    const updatedElement = {
      ...element,
      choices: options
        .filter((option) => option.enabled)
        .map((option) => option.label),
    };

    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement,
      })
    );
  };

  useEffect(() => {
    if (element) {
      setQuestion(element.name);
      setType(element.type);
      setRequired(element.required);
      console.log(element.choices);

      const choices = element.choices || [];

      const existingOptions = options.filter(
        (option) =>
          option.label !== "Nenhum" && option.label !== "Outro (Descreva)"
      );

      const updatedOptions = [
        ...existingOptions,
        { id: "5", label: "Nenhum", enabled: false },
        { id: "6", label: "Outro (Descreva)", enabled: false },
      ];
      updateElementChoices();
      setOptions(updatedOptions);
      updateElementChoices();
    }
  }, []);

  const toggleOption = (id: string) => {
    setOptions(
      options?.map((option) =>
        option.id === id ? { ...option, enabled: true } : option
      )
    );
    updateElementChoices();
  };

  const handleSelect = (id: string) => {
    setSelectedOption(id);
  };

  const handleChangeQuestion = (newQuestion: string) => {
    setQuestion(newQuestion);
    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement: { ...element, name: newQuestion },
      })
    );
  };

  const handleRequired = () => {
    setRequired(!required);
    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement: { ...element, required: !required },
      })
    );
  };

  const handleLabelChange = (id: string, newLabel: string) => {
    setOptions(
      options?.map((option) =>
        option.id === id ? { ...option, label: newLabel } : option
      )
    );
    updateElementChoices();
  };

  const handleRemove = (id: string) => {
    setOptions(options?.filter((option) => option.id !== id));
    updateElementChoices();
  };

  const moveOption = (index: number, direction: "up" | "down") => {
    const newOptions = [...options];
    const [movedOption] = newOptions.splice(index, 1);
    if (direction === "down") {
      if (index + 1 <= newOptions.length && newOptions[index + 1].enabled) {
        newOptions.splice(index + 1, 0, movedOption);
      } else {
        return;
      }
    } else if (direction === "up") {
      if (index - 1 >= 0 && newOptions[index - 1].enabled) {
        newOptions.splice(index - 1, 0, movedOption);
      }
    }
    setOptions(newOptions);
    updateElementChoices();
  };

  const content = (
    <div className="flex flex-col gap-4 justify-center">
      {options?.map((option, index) => (
        <div key={option.id} className="flex items-center gap-4 relative group">
          {option.enabled ? (
            <CancelOutlined
              fontSize="small"
              className="text-red-500 cursor-pointer"
              onClick={() => toggleOption(option.id)}
            />
          ) : (
            <AddCircleOutlineIcon
              fontSize="small"
              className="text-green-500 cursor-pointer"
              onClick={() => toggleOption(option.id)}
            />
          )}
          <input
            type="radio"
            name="unique-selection"
            checked={selectedOption === option.id}
            onChange={() => handleSelect(option.id)}
            disabled={!option.enabled}
            className={`custom-checkbox${option.enabled ? "-enabled" : ""}`}
          />
          <input
            type="text"
            value={option.label}
            onChange={(e) => handleLabelChange(option.id, e.target.value)}
            className={`text-lg  rounded-full font-regular font-poppins text-[16px] leading-[21px] focus:outline-none ${
              !option.enabled ? "text-gray-400" : "text-black"
            } border-2 rounded border-transparent hover:border-[#575757]`}
          />
          <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {index > 0 && (
              <button onClick={() => moveOption(index, "up")}>
                <SquaredUpArrow className="cursor-pointer" />
              </button>
            )}
            {index < options?.length - 1 && (
              <button onClick={() => moveOption(index, "down")}>
                <SquaredDownArrow className="cursor-pointer" />
              </button>
            )}
          </div>
          {/* <button */}
          {/*   onClick={() => handleRemove(option.id)} */}
          {/*   className="ml-auto text-red-500 font-semibold" */}
          {/* > */}
          {/*   Remove */}
          {/* </button> */}
        </div>
      ))}
    </div>
  );

  const header = (
    <BaseTitle
      required={required}
      question={question}
      type={type}
      onChange={handleChangeQuestion}
    />
  );

  const footer = <BaseFooter onRequire={handleRequired} required={required} />;

  return <BaseComponent header={header} content={content} footer={footer} />;
};

export default UniqueSelection;
