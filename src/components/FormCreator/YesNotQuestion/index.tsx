import { useEffect, useState } from "react";
import BaseComponent from "../BaseComponent";
import BaseContent from "../BaseContent";
import BaseTitle from "../BaseTitle";
import BaseFooter from "../BaseFooter";
import { useDispatch, useSelector } from "react-redux";
import { updateElement } from "../../../../redux/surveySlice";

interface YesNotQuestionProps {
  pageIndex: number;
  elementIndex: number;
  onCopy: () => void;
  onDelete: () => void;
  onMove: () => void;
  index: number;
}

const YesNotQuestion: React.FC<YesNotQuestionProps> = ({
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

  const [question, setQuestion] = useState(element?.name || "");
  const [type, setType] = useState(element?.type || "boolean");
  const [required, setRequired] = useState(element?.required || false);
  const [labelYes, setLabelYes] = useState(element?.labelTrue || "Sim");
  const [labelNo, setLabelNo] = useState(element?.labelFalse || "Não");

  useEffect(() => {
    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement: {
          ...element,
          labelTrue: labelYes,
          labelFalse: labelNo,
        },
      })
    );
  }, [labelNo, labelYes]);

  useEffect(() => {
    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement: {
          ...element,
          name: question,
        },
      })
    );
  }, [question]);

  const handleRequired = () => {
    setRequired(!required);
  };

  const handleLabel = (label: any, value: any) => {
    if (label) {
      setLabelYes(value);
    } else {
      setLabelNo(value);
    }
    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement: {
          ...element,
          labelTrue: labelYes,
          labelFalse: labelNo,
        },
      })
    );
  };

  const handleQuestion = (value: any) => {
    setQuestion(value);
  };

  const header = (
    <BaseTitle
      question={question}
      type={type}
      onChange={handleQuestion}
      required={required}
    />
  );

  const content = (
    <div className="flex h-[49px] w-fit p-1 bg-neutral-100 rounded-[100px] shadow-inner justify-start items-start">
      <div className="px-6 py-2 flex">
        <input
          value={labelNo}
          onChange={(e) => handleLabel(false, e.target.value)}
          type="text"
          placeholder="Não..."
          className="text-[#8a8a8a] text-lg font-medium font-['Poppins'] leading-[21px] bg-transparent rounded border-2 border-transparent hover:border-[#575757] min-w-[4ch] max-w-[12ch]"
          style={{ width: `${labelNo.length}ch` }}
        />
      </div>
      <div className="px-6 py-2 flex">
        <input
          value={labelYes}
          onChange={(e) => handleLabel(true, e.target.value)}
          type="text"
          placeholder="Sim..."
          className="text-[#8a8a8a] text-lg font-medium font-['Poppins'] leading-[21px] bg-transparent rounded border-2 border-transparent hover:border-[#575757] min-w-[4ch] max-w-[12ch]"
          style={{ width: `${labelYes.length}ch` }}
        />
      </div>
    </div>
  );

  const footer = (
    <BaseFooter
      onRequire={handleRequired}
      pageIndex={pageIndex}
      elementIndex={elementIndex}
    />
  );

  return <BaseComponent index={index} onMove={onMove} header={header} content={content} footer={footer} />;
};

export default YesNotQuestion;
