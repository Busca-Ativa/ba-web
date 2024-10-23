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
  id: number;
  label: string;
  enabled: boolean;
}

interface UniqueSelectionProps {
  pageIndex: number;
  elementIndex: number;
  onCopy: () => void;
  onDelete: () => void;
  onMove: () => void;
  index: number;
}

const UniqueSelection: React.FC<UniqueSelectionProps> = ({
  pageIndex,
  elementIndex,
  onCopy,
  onDelete,
  onMove,
  index,
}) => {
  const dispatch = useDispatch();

  const element = useSelector(
    (state: any) =>
      state.survey.surveyJson.pages[pageIndex]?.elements[elementIndex]
  );

  const [question, setQuestion] = useState<string>(element?.title || "");
  const [type, setType] = useState<string>("comment");
  const [required, setRequired] = useState<boolean>(element?.required || false);
  const [options, setOptions] = useState<EditableCheckbox[]>(
    element?.choices?.map((value: any, index: number) => ({
      id: index,
      label: value,
      enabled: true,
    }))
  );
  const [hasFirstRender, setHasFirstRender] = useState(false);

  useEffect(() => {
    if (
      !hasFirstRender &&
      element?.choices &&
      JSON.stringify(element.choices) ==
        JSON.stringify(["Muito Frequentemente", "Raramente"])
    ) {
      console.log("entrou");
      const updatedOptions = element.choices.map(
        (value: any, index: number) => ({
          id: index,
          label: value,
          enabled: true,
        })
      );
      setOptions(updatedOptions);
      setHasFirstRender(true);
    }
  }, [element, hasFirstRender]);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const updateElementChoices = () => {
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

  const updateChoices = (newChoices: any) => {
    const updatedElement = {
      ...element,
      choices: newChoices
        .filter((option: any) => option.enabled)
        .map((option: any) => option.label),
    };

    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement,
      })
    );
  };

  const updateChoice = (id: string, newLabel: string) => {
    const updatedOptions = options?.map((option: any) =>
      option.id === id ? { ...option, label: newLabel } : option
    );

    const updatedElement = {
      ...element,
      choices: updatedOptions
        ?.filter((option) => option.enabled)
        ?.map((option) => option.label),
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
    console.log(options);
    if (options?.length < 5 && options) {
      const defaultOptions = [
        { id: 0, label: "Muito Frequentemente", enabled: false },
        { id: 1, label: "Raramente", enabled: false },
        { id: 2, label: "Item 2", enabled: false },
        { id: 3, label: "Item 3", enabled: false },
        { id: 4, label: "Outro (Descreva)", enabled: false },
      ];
      const missingCount = 5 - options?.length;
      const toAdd = [...options, ...defaultOptions?.slice(-missingCount)];
      setOptions(toAdd);
    }
  }, [options]);

  const toggleOption = (id: number) => {
    console.log(options);
    const newOptions = options?.map((option: any) =>
      option.id === id ? { ...option, enabled: !option.enabled } : option
    );
    console.log(newOptions);
    setOptions(newOptions);
    updateChoices(newOptions);
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
        updatedElement: { ...element, title: newQuestion },
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

  const handleLabelChange = (id: number, newLabel: string) => {
    setOptions(
      options?.map((option: any) =>
        option.id === id ? { ...option, label: newLabel } : option
      )
    );
    updateChoice(id, newLabel);
  };

  const handleRemove = (id: string) => {
    setOptions(options?.filter((option: any) => option.id !== id));
    const updatedOptions = options?.map((option: any) =>
      option.id === id ? (option.enabled = false) : option.enabled
    );
    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement: { ...element, choices: updatedOptions },
      })
    );
  };

  const moveOption = (index: number, direction: "up" | "down") => {
    const newOptions = [...options];
    const [movedOption] = newOptions?.splice(index, 1);
    if (direction === "down") {
      if (index <= newOptions?.length && newOptions[index].enabled) {
        newOptions?.splice(index + 1, 0, movedOption);
      } else {
        return;
      }
    } else if (direction === "up") {
      if (index - 1 >= 0 && newOptions[index - 1].enabled) {
        newOptions?.splice(index - 1, 0, movedOption);
      }
    }
    setOptions(newOptions);
    updateChoices(newOptions);
  };

  const content = (
    <div className="flex flex-col gap-4 justify-center">
      {options?.map((option, index) => (
        <div key={index} className="flex items-center gap-4 relative group">
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
            checked={selectedOption === option.id.toString()}
            onChange={() => handleSelect(option.id.toString())}
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
                <SquaredUpArrow />
              </button>
            )}
            {index < options?.length - 1 && (
              <button onClick={() => moveOption(index, "down")}>
                <SquaredDownArrow />
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

  const footer = (
    <BaseFooter
      onRequire={handleRequired}
      pageIndex={pageIndex}
      elementIndex={elementIndex}
    />
  );

  return (
    <BaseComponent
      onMove={onMove}
      index={index}
      header={header}
      content={content}
      footer={footer}
    />
  );
};

export default UniqueSelection;
