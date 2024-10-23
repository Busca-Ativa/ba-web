import BATable from "@/components/BATable";
import api from "@/services/api";
import { useEffect, useRef, useState } from "react";
import { addElement } from "../../../../redux/surveySlice";
import { useDispatch } from "react-redux";

type ModalinsertionsProps = {
  onClose: (value: boolean) => void;
};

interface Row {
  id: any;
  title: any;
  creator: string;
  tags: string;
  config: {
    editable: boolean;
    deletable: boolean;
    duplicable: boolean;
    insertable: boolean;
  };
  origin: any;
}

interface InsertsSelected {
  id: string;
  selected: boolean;
}

const ModalInsertions = ({ onClose }: ModalinsertionsProps) => {
  const [tabSelected, setTabSelected] = useState(0);
  const [data, setData] = useState([]);
  const [insertsSelected, setInsertsSelected] = useState<InsertsSelected[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const dispath = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);

  const columns = [
    { id: "title", label: "Título", numeric: false },
    { id: "origin", label: "Origem", numeric: false },
    { id: "tags", label: "Tags", numeric: false },
  ];

  const handleClickOutside = (event: any) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose(false);
    }
  };

  useEffect(() => {
    const url = `/editor/${tabSelected == 0 ? "sections" : "questions"}`;
    api
      .get(url)
      .then((response) => {
        setData(response.data);
        setInsertsSelected(
          response.data.map((item: any) => ({ id: item.id, selected: false }))
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [tabSelected]);

  useEffect(() => {
    if (data) {
      setRows(
        data.map((item: any) => {
          return {
            id: item.id, // Mapeando o 'id' diretamente
            title: item.title, // Mapeando o 'title'
            creator: item.creator, // Mapeando o 'creator'
            origin: item.origin?.name, // Mapeando o 'origin.name' com segurança
            tags: item.tags, // Mapeando 'tags'
            config: {
              editable: false,
              deletable: false,
              duplicable: false,
              insertable: true,
            },
          };
        })
      );
    }
  }, [data]);

  const insert = () => {
    const selectedData = data.filter((item: any) =>
      insertsSelected.some((insert) => insert.id === item.id && insert.selected)
    );

    const mappedData = selectedData.map((item: any) => {
      if (tabSelected === 0) {
        return item.questions.elements;
      } else {
        return item.question_data;
      }
    });

    console.log("Mapped Data:", mappedData);
    if (tabSelected === 0)
      mappedData[0].forEach((el: any) => {
        dispath(addElement({ pageIndex: 0, element: el }));
      });
    if (tabSelected === 1)
      mappedData.forEach((el) => {
        dispath(addElement({ pageIndex: 0, element: el }));
      });
    onClose(false);
  };

  const handleInsert = (id: string) => {
    console.log("id", id);
    setInsertsSelected((prevInsertsSelected) =>
      prevInsertsSelected.map((insert) =>
        insert.id === id ? { ...insert, selected: !insert.selected } : insert
      )
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={() => onClose(false)}
      ></div>
      <div className="relative z-10 flex items-center justify-center">
        <div className="modal w-[971px] h-fit flex flex-col items-center justify-center px-[60px] py-[50px] rounded-lg bg-white">
          <div ref={modalRef} className="flex w-full justify-between mb-[40px]">
            <div className="text-[#0e1113] text-3xl font-bold font-['Poppins'] leading-[38px]">
              Importar Seção/Questão
            </div>
          </div>
          <div className="flex w-full h-[45px] !rounded-2xl">
            <div
              className={
                tabSelected == 0
                  ? "bg-[#D2F9F1] text-[#19b394] text-lg font-medium font-['Poppins'] leading-[21px] flex flex-1 justify-center items-center cursor-pointer rounded-l-md h-[45px]"
                  : "bg-[#F6F6F6] text-[#575757] text-lg font-medium font-['Poppins'] leading-[21px] flex flex-1 justify-center items-center cursor-pointer rounded-l-md h-[45px]"
              }
              onClick={() => setTabSelected(0)}
            >
              Seções
            </div>
            <div
              className={
                tabSelected == 1
                  ? "bg-[#D2F9F1] text-[#19b394] text-lg font-medium font-['Poppins'] leading-[21px] flex flex-1 justify-center items-center cursor-pointer rounded-r-md h-[45px]"
                  : "bg-[#F6F6F6] text-[#575757] text-lg font-medium font-['Poppins'] leading-[21px] flex flex-1 justify-center items-center cursor-pointer rounded-r-md h-[45px]"
              }
              onClick={() => setTabSelected(1)}
            >
              Questões
            </div>
          </div>
          <div className="mt-[50px] w-full">
            <BATable
              columns={columns}
              initialRows={rows as any}
              insertsSelected={insertsSelected}
              onInsert={handleInsert}
            />
          </div>
          <div className="flex justify-between w-full mt-[40px]">
            <div
              onClick={() => onClose(false)}
              className="h-[41px] px-10 py-2 rounded border border-[#ef4838] justify-center items-center gap-3 inline-flex cursor-pointer"
            >
              <div className="text-[#ef4838] text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                Cancelar
              </div>
            </div>
            <button
              onClick={insert}
              className="h-[41px] px-10 py-2 bg-[#19b394] rounded justify-center items-center gap-3 inline-flex"
            >
              <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                Concluir
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalInsertions;
