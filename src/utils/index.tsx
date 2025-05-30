export type StatusObject = {
  name: string;
  config: {
    editable: boolean;
    deletable: boolean;
  };
  bcolor: string;
  color: string;
};

export function getStatus(status: string) : StatusObject {
  switch (status) {
    case "done":
      return {name:"Pronto",config:{editable: true, deletable: true},bcolor:"#ADDBBA",color:"#008E20"};
    case "undone":
      return {name:"Em Edição",config:{editable: true, deletable: true},bcolor:"#FFE9A6",color:"#BE9007"};
    case "used":
      return {name:"Usado",config:{editable: false, deletable: false},bcolor:"#BBBEC3",color:"#43494E"};
    default:
      return {name:"Desconhecido",config:{editable: false, deletable: false},bcolor:"#471dc3",color:"#bbbbbb"}
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

export function translateSegment(segmentName: string): string {
  const dict: Record<string, string> = {
    country: "País",
    state: "Estado",
    city: "Cidade",
    sector: "Setor",
    neighborhood: "Bairro",
  };

  if (segmentName in dict) {
    return dict[segmentName];
  }

  return `Tipo desconhecido: ${segmentName}`;
}

export function translateRole(roleName: string): string {
  const dict: Record<string, string> = {
    admin: "Administrador",
    coordinator: "Coordenador",
    supervisor: "Supervisor",
    agent: "Agente",
    user: "Usuário",
    superuser: "Super Usuário",
    editor: "Editor",
  };

  if (roleName in dict) {
    return dict[roleName];
  }

  return `Tipo desconhecido: ${roleName}`;
}
