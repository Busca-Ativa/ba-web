export type StatusObject = {
  name: string;
  config: {
    editable: boolean;
    deletable: boolean;
  };
};

export function getStatus(status: string) : StatusObject | string {
  switch (status) {
    case "done":
      return {name:"Pronto",config:{editable: false, deletable: true}};
    case "undone":
      return {name:"Em Edição",config:{editable: true, deletable: true}};
    case "used":
      return {name:"Usado",config:{editable: false, deletable: false}};
    default:
      return "Unknown";
  }
}

export function getTime(dateStr: string) : string {
  const date = new Date(dateStr);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return `${date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: timeZone
  })} às ${date.toLocaleTimeString("pt-BR",{timeZone: timeZone})}`;
}