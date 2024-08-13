import "./style.css";

type CardProps = {
  bgColor: string;
  textColor: string;
  title: string;
  content: string;
};

const Card = ({ bgColor, textColor, title, content }: CardProps) => {
  return (
    <div
      className={`Card bg-[${bgColor}] text-[${textColor}] gap-[5px] 2xl:gap-[10px]`}
    >
      <span className="text-md 2xl:text-xl">{title}</span>
      <p className="text-xl 2xl:text-2xl">{content}</p>
    </div>
  );
};

export default Card;
