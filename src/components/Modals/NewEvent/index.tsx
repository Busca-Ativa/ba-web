import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { MapContainer, TileLayer, useMap, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import axios from "axios";

import api from "@/services/api";
import { translateSegment } from "@/utils/index";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
};

type SegmentContainer = {
  segment_id: string;
};

type Segments = {
  country?: SegmentContainer[];
  state?: SegmentContainer[];
  city?: SegmentContainer[];
  sector?: SegmentContainer[];
  neighborhood?: SegmentContainer[];
};

type BoundingBox = [number, number, number, number];
type ParsedBounds = [[number, number], [number, number]];

interface NominatimResponse {
  boundingbox: BoundingBox;
  display_name: string;
  lat: string;
  lon: string;
}

interface FitBoundsProps {
  bounds: ParsedBounds | null;
}

const FitBounds: React.FC<FitBoundsProps> = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [bounds, map]);

  return null;
};

interface Event {
  id?: string;
  title?: string;
  description?: string;
  date_start?: string;
  date_end?: string;
  meta?: number;
  meta_unit?: string;
  form?: {
    id?: string;
    title?: string;
  };
  units?: any[];
  teams?: any[];
  agents?: any[];
  segments?: Segments;
  geometry?: any;
}
interface UF {
  id: number;
  sigla: string;
  nome: string;
}

interface City {
  id: string;
  nome: string;
}

const geoJsonCache = new Map<string, any>(); // In-memory cache

export default function NewEvent({ open, onClose, onSubmit }: ModalProps) {
  const [modalState, setModalState] = useState<number>(0);

  // Event Variables
  const [event, setEvent] = useState<Event>({
    segments: {
      country: [],
      state: [],
      city: [],
      sector: [],
      neighborhood: [],
    },
  });

  // Map Variables
  const [currentLocation, setCurrentLocation] =
    useState<LatLngExpression | null>(null);
  const [bounds, setBounds] = useState<ParsedBounds | null>(null);
  const [geojson, setGeojson] = useState<any[]>([]);

  // Selects Fetched Data
  const [ufs, setUfs] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [availableSegmentsType, setAvailableSegmentsType] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);

  // Selects Controllers
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(200);
  const [currentSegmentType, setCurrentSegmentType] = useState<string>();
  const [currentState, setCurrentState] = useState<UF>();
  const [currentCity, setCurrentCity] = useState<City>();

  // Select Results
  const [segments, setSegments] = useState<Segments>({});

  useEffect(() => {
    loadUFs(); // Carrega UFs ao montar o componente
    loadForms(); // Carrega Formulários ao montar o componente
    loadTeams(); // Carrega Times ao montar o componente
    loadUnits(); // Carrega Unidades ao montar o componente
    loadAgents(); // Carrega Agentes ao montar o componente
    getCurrentLocation(); // Obtém localização atual do dispositivo
  }, []);

  useEffect(() => {
    if (currentState) {
      loadCities(currentState); // Carrega cidades quando a UF é alterada
    }
  }, [currentState]);

  useEffect(() => {
    // console.log(segments)
  }, [segments]);

  useEffect(() => {
    console.log(event);
  }, [event]);

  useEffect(() => {
    console.log(currentSegmentType);
    if (currentSegmentType) {
      loadSegments(); // Carrega os segmentos
    }
  }, [currentSegmentType]);

  useEffect(() => {
    const fetchavailableSegmentsType = async () => {
      try {
        const response = await api.get(
          `/all/kind?id_country=BR${
            currentState?.id ? "&id_state=" + currentState.id : ""
          }${currentCity?.id ? "&id_city=" + currentCity.id : ""}`
        );
        setAvailableSegmentsType(response.data);
      } catch (error) {
        console.error("Erro ao carregar UFs:", error);
      }
    };
    fetchavailableSegmentsType();
  }, [currentState, currentCity]);

  const loadUFs = async () => {
    try {
      const response = await api.post("all/uf", {
        filter: {
          // nome: ""
        },
      });
      const sortedUfs = response.data.sort((a: any, b: any) =>
        a.nome.localeCompare(b.nome)
      ); // Ordena alfabeticamente
      setUfs(sortedUfs);
    } catch (error) {
      console.error("Erro ao carregar UFs:", error);
    }
  };

  const loadCities = async (uf: UF) => {
    try {
      const response = await api.post(
        `all/uf/${uf.id}/city?offset=${offset}&limit=${limit}`,
        {
          filter: {
            // nome: ""
          },
        }
      );

      const sortedCities = response.data.sort((a: any, b: any) =>
        a.nome.localeCompare(b.nome)
      ); // Ordena alfabeticamente
      setCities(sortedCities);
    } catch (error) {
      console.error("Erro ao carregar cidades:", error);
    }
  };

  const loadForms = async () => {
    try {
      const response = await api.get("/coordinator/institution/forms");
      if (response.status === 200) {
        setForms(response.data.data);
        return;
      }
      setForms([]);
    } catch (error) {
      console.error("Erro ao carregar Formulários:", error);
    }
  };

  const loadUnits = async () => {
    try {
      const response = await api.get("/coordinator/institution/units");
      if (response.status === 200) {
        setUnits(response.data.data);
        return;
      }
      setUnits([]);
    } catch (error) {
      console.error("Erro ao carregar Unidades:", error);
    }
  };

  const loadTeams = async () => {
    try {
      const response = await api.get("/coordinator/institution/teams");
      if (response.status === 200) {
        setTeams(response.data.data);
        return;
      }
      setTeams([]);
    } catch (error) {
      console.error("Erro ao carregar Times:", error);
    }
  };

  const loadAgents = async () => {
    try {
      const response = await api.get("/coordinator/institution/users");
      if (response.status === 200) {
        setAgents(response.data.data);
        return;
      }
      setAgents([]);
    } catch (error) {
      console.error("Erro ao carregar Agentes:", error);
    }
  };

  const loadSegments = async () => {
    if (modalState === 2) {
      try {
        const response = await api.post(
          `/all/uf${
            (currentState?.id ? "/" + currentState.id + "/city" : "") +
            (currentCity?.id
              ? "/" + currentCity.id + "/" + currentSegmentType
              : "")
          }?offset=${offset}&limit=${limit}`,
          { filter: {} }
        );
        if (response.status === 200) {
          setSegments((prev) => ({
            ...prev,
            [currentSegmentType || "error"]: response.data,
          }));
          return;
        }
      } catch (error) {
        console.error("Erro ao carregar Agentes:", error);
      }
    }
  };

  const loadGeoJson = async (segmentsID: string) => {
    let stateString = currentState?.id ? currentState.id : "";
    let cityString = currentCity?.id ? currentCity.id : "";
    let countryString = "BR";
    let segmentTypeString = currentSegmentType ? currentSegmentType : "";
    let segmentID = segmentsID[segmentsID.length - 1];

    // Check if the result is already in the cache
    if (segmentID && geoJsonCache.has(segmentID)) {
      setGeojson((prev) => [...prev, geoJsonCache.get(segmentID)]);
      return;
    }

    try {
      const response = await api.get(
        `/all/geojson?id_state=${stateString}&segment_type=${segmentTypeString}&id_city=${cityString}&id_segment=${segmentID}&id_country=${countryString}`
      );

      if (response.status === 200) {
        if (segmentID) {
          geoJsonCache.set(segmentID, response.data);
        }
        setGeojson((prev) => [...prev, response.data]);
        return;
      }
    } catch (error) {
      console.error("Erro ao carregar Agentes:", error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
        }
      );
    }
  };

  const updateLocationByUF = async (ufCode: any) => {
    try {
      const ufData = ufs.find((uf) => uf.sigla === ufCode);
      if (ufData) {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${ufData.nome}&format=json`
        );
        if (response.data.length > 0) {
          const { lat, lon, boundingbox } = response.data[0];
          const parsedBounds: ParsedBounds = [
            [boundingbox[0], boundingbox[2]],
            [boundingbox[1], boundingbox[3]],
          ];
          setBounds(parsedBounds);
          setCurrentLocation([parseFloat(lat), parseFloat(lon)]);
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar localização por UF:", error);
    }
  };

  const updateLocationByCity = async (cityName: any) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?city=${cityName}&state=${event.uf.nome}&country=Brazil&format=json`
      );
      if (response.data.length > 0) {
        const { lat, lon, boundingbox } = response.data[0];
        const parsedBounds: ParsedBounds = [
          [boundingbox[0], boundingbox[2]],
          [boundingbox[1], boundingbox[3]],
        ];
        setBounds(parsedBounds);
        setCurrentLocation([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error("Erro ao atualizar localização por cidade:", error);
    }
  };

  const handleNext = () => {
    if (modalState === 0) {
      if (
        !event.title ||
        !event.description ||
        !event.date_start ||
        !event.date_end ||
        !event.meta ||
        !event.meta_unit ||
        !event.form
      ) {
        return;
      }
    }

    if (modalState === 1) {
      if (!event.units || !event.teams || !event.agents) {
        return;
      }
    }

    if (modalState === 2) {
      if (!event.uf || !event.city || !currentSegmentType) {
        return;
      }

      if (currentSegmentType === "bairros" && !event.bairros) {
        return;
      }

      if (currentSegmentType === "setores" && !event.setores) {
        return;
      }
    }

    setModalState((prev) => prev + 1);
  };

  const handleBack = () => {
    setModalState((prev) => prev - 1);
  };

  const handleScroll = (e: React.UIEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
      setOffset(offset + limit);
    }
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
  };

  const handleChange = async (field: any, value: any) => {
    // Atualizar localização quando UF ou cidade forem alterados
    if (field === "uf") {
      const uf: UF | undefined = ufs.find(
        (uf: UF) => uf.id.toString() === value.toString()
      );
      if (uf) {
        // setEvent((prev) => ({ ...prev, [field]: uf, ["city"]:"", ["segment_type"]:""}));
        setCurrentState(uf);
        setCurrentSegmentType("");
        setCurrentCity({ id: "", nome: "" });
        await updateLocationByUF(uf.sigla);
        return;
      }
    } else if (field === "city") {
      const city = cities.find(
        (city: City) => city.id.toString() === value.toString()
      );
      if (city) {
        setCurrentCity(city);
        setCurrentSegmentType("");
        await updateLocationByCity(city.nome);
      }
    } else if (field === "segment_type") {
      setCurrentSegmentType(value);
      return;
    } else if (
      ["country", "state", "city", "sector", "neighborhood"].includes(
        field.split(" ")[1]
      )
    ) {
      setEvent((prev) => ({
        ...prev,
        segments: {
          ...prev.segments,
          [field.split(" ")[1]]: value,
        },
      }));
      loadGeoJson(value);
      // console.log(value)
      return;
    }

    setEvent((prev) => ({ ...prev, [field]: value }));
  };

  const renderStage = () => {
    switch (modalState) {
      case 0:
        return (
          <>
            {/* Título */}
            <Box display={"flex"} flexDirection={"column"} mb={2}>
              <Typography
                fontFamily={"Poppins"}
                variant="body2"
                fontWeight="bold"
              >
                Título
              </Typography>
              <TextField
                label="Digite o título"
                fullWidth
                variant="outlined"
                margin="normal"
                value={event.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </Box>

            {/* Descrição */}
            <Box display={"flex"} flexDirection={"column"} mb={2}>
              <Typography
                fontFamily={"Poppins"}
                variant="body2"
                fontWeight="bold"
              >
                Descrição
              </Typography>
              <TextField
                label="Digite a descrição"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                margin="normal"
                value={event.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Box>

            {/* Datas */}
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Data de Início"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={event.date_start || ""}
                onChange={(e) => handleChange("date_start", e.target.value)}
              />
              <TextField
                label="Data de Fim"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={event.date_end || ""}
                onChange={(e) => handleChange("date_end", e.target.value)}
              />
            </Box>

            {/* Unidade da Meta e Meta */}
            <Box display="flex" gap={2} mb={2}>
              <FormControl fullWidth>
                <InputLabel>Unidade da Meta</InputLabel>
                <Select
                  value={event.meta_unit || ""}
                  onChange={(e) => handleChange("meta_unit", e.target.value)}
                >
                  <MenuItem value="coletas">Coletas</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Meta"
                type="number"
                fullWidth
                variant="outlined"
                value={event.meta || ""}
                onChange={(e) => handleChange("meta", Number(e.target.value))}
              />
            </Box>

            {/* Formulário */}
            <Box display="flex" flexDirection="column" mb={4}>
              <Typography
                fontFamily={"Poppins"}
                variant="body2"
                fontWeight="bold"
                mb={2}
              >
                Formulário
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Selecione o formulário</InputLabel>
                <Select
                  value={event.form || ""}
                  onChange={(e) => handleChange("form", e.target.value)}
                >
                  {forms?.map((form: any) => {
                    return (
                      <MenuItem key={form.id} value={form.id}>
                        {form.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </>
        );
      case 1:
        return (
          <Box mb={4}>
            {/* Unidades */}
            <Box display="flex" flexDirection="column" mb={2}>
              <Typography variant="body2" fontWeight="bold" mb={2}>
                Unidades
              </Typography>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={event.units || []}
                  onChange={(e) =>
                    handleChange("units", Array.from(e.target.value))
                  }
                >
                  {units?.map((unit: any) => {
                    return (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {(event.units || []).map((unitId, index) => {
                  const unit = units.find((u) => u.id === unitId);
                  return (
                    <Box
                      key={unitId}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                        alignItems: "center",
                        backgroundColor: "#FFE9CC",
                        borderRadius: "8px",
                        px: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {unit.name}
                      </Typography>
                      <Button
                        size="small"
                        color="warning"
                        sx={{ padding: 0, minWidth: 0 }}
                        onClick={() =>
                          handleChange(
                            "units",
                            (event.units || []).filter((u) => u === unit)
                          )
                        }
                      >
                        x
                      </Button>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Times */}
            <Box display="flex" flexDirection="column" mb={2}>
              <Typography variant="body2" fontWeight="bold" mb={2}>
                Times
              </Typography>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={event.teams || []}
                  onChange={(e) =>
                    handleChange("teams", Array.from(e.target.value))
                  }
                >
                  {teams?.map((agent: any) => {
                    return (
                      <MenuItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {(event.teams || []).map((teamId, index) => {
                  const team = teams.find((t) => t.id === teamId);
                  return (
                    <Box
                      key={teamId}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                        alignItems: "center",
                        backgroundColor: "#FFE9CC",
                        borderRadius: "8px",
                        px: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {team.name}
                      </Typography>
                      <Button
                        size="small"
                        color="warning"
                        sx={{ padding: 0, minWidth: 0 }}
                        onClick={() =>
                          handleChange(
                            "teams",
                            (event.teams || []).filter((t) => t === team)
                          )
                        }
                      >
                        x
                      </Button>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Agentes */}
            <Box display="flex" flexDirection="column" mb={2}>
              <Typography variant="body2" fontWeight="bold" mb={2}>
                Agentes
              </Typography>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={event.agents || []}
                  onChange={(e) =>
                    handleChange("agents", Array.from(e.target.value))
                  }
                >
                  {agents?.map((agent: any) => {
                    return (
                      <MenuItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {(event.agents || []).map((agent, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      alignItems: "center",
                      backgroundColor: "#FFE9CC",
                      borderRadius: "8px",
                      px: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {agent}
                    </Typography>
                    <Button
                      size="small"
                      color="warning"
                      sx={{ padding: 0, minWidth: 0 }}
                      onClick={() =>
                        handleChange(
                          "agents",
                          (event.agents || []).filter((a) => a === agent)
                        )
                      }
                    >
                      x
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box
            display="flex"
            flexDirection="row"
            gap={2}
            alignItems="flex-start"
          >
            {/* Coluna do Formulário */}
            {/* Coluna do Formulário */}
            <Box flex={1}>
              {/* Linha 1: Select de UF e Cidade */}
              <Box display="flex" flexDirection="row" gap={2} mb={2}>
                <FormControl fullWidth>
                  <Typography variant="body2" fontWeight="bold" mb={2}>
                    UF
                  </Typography>
                  <Select
                    value={currentState?.id || ""}
                    onChange={(e) => handleChange("uf", e.target.value)}
                  >
                    <MenuItem key={-1} value={""}>
                      Nenhum
                    </MenuItem>
                    {ufs?.map((uf: any) => (
                      <MenuItem key={uf.id} value={uf.id}>
                        {uf.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <Typography variant="body2" fontWeight="bold" mb={2}>
                    Cidade
                  </Typography>
                  <Select
                    value={currentCity?.id || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                    disabled={!currentState} // Desabilita se nenhuma UF estiver selecionada
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.id} value={city.id}>
                        {city.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Linha 2: Tipo de Segmento */}
              <Box mb={2}>
                <FormControl fullWidth>
                  <Typography variant="body2" fontWeight="bold" mb={2}>
                    Tipo de Segmento
                  </Typography>
                  <Select
                    value={currentSegmentType || ""}
                    onChange={(e) =>
                      handleChange("segment_type", e.target.value)
                    }
                  >
                    {availableSegmentsType.map(
                      (segment: any, index: number) => (
                        <MenuItem key={index} value={segment}>
                          {translateSegment(segment)}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Box>

              {/* Linha 3: Select de Bairros ou Setores */}
              {currentSegmentType && (
                <Box mb={2}>
                  <FormControl fullWidth>
                    <Typography variant="body2" fontWeight="bold" mb={2}>
                      {translateSegment(currentSegmentType)}
                    </Typography>
                    <Select
                      multiple
                      value={
                        event.segments ? event.segments[currentSegmentType] : []
                      }
                      onScroll={handleScroll}
                      onChange={(e) =>
                        handleChange(
                          "segments " + currentSegmentType,
                          Array.from(e.target.value)
                        )
                      }
                    >
                      {currentSegmentType === "sector"
                        ? (segments[currentSegmentType || "error"] || []).map(
                            (segment: any, index: number) => (
                              <MenuItem key={index} value={segment._id}>
                                {segment.properties.CD_SETOR}s{" "}
                              </MenuItem>
                            )
                          )
                        : (segments[currentSegmentType] || []).map(
                            (segment: any, index: number) => (
                              <MenuItem key={index} value={segment.id}>
                                {segment.nome}
                              </MenuItem>
                            )
                          )}
                    </Select>
                  </FormControl>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {(event.segments
                      ? Object.values(event.segments).flat()
                      : []
                    ).map((segment: any, index: number) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 1,
                            alignItems: "center",
                            backgroundColor: "#FFE9CC",
                            borderRadius: "8px",
                            px: 2,
                          }}
                        >
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {segment?.nome ? segment.nome : segment}
                          </Typography>
                          <Button
                            size="small"
                            color="warning"
                            sx={{ padding: 0, minWidth: 0 }}
                            onClick={() =>
                              handleChange(
                                currentSegmentType,
                                (
                                  event.segments[currentSegmentType] || []
                                ).filter((b) => b !== segment)
                              )
                            }
                          >
                            x
                          </Button>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Coluna do Mapa */}
            <Box flex={1} mb={4}>
              <Typography variant="body2" fontWeight="bold" mb={0}>
                Mapa
              </Typography>
              <Box
                sx={{
                  height: "350px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                <MapContainer
                  key={
                    currentLocation
                      ? `${(currentLocation as [number, number])[0]},${
                          (currentLocation as [number, number])[1]
                        }`
                      : "default"
                  }
                  center={
                    currentLocation
                      ? (currentLocation as LatLngExpression)
                      : [-14.235, -51.9253] // Center of Brazil (latitude and longitude)
                  }
                  zoom={currentLocation ? 13 : 4} // Adjust zoom for Brazil
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {geojson.map((geoJson, index) => (
                    <GeoJSON
                      key={index}
                      data={geoJson}
                      onEachFeature={onEachFeature}
                    />
                  ))}
                  {bounds && <FitBounds bounds={bounds} />}
                </MapContainer>
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  const renderNavigationDots = () => (
    <Box display="flex" justifyContent="center" gap={1} mt={3}>
      {[0, 1, 2].map((stage) => (
        <Button
          key={stage}
          onClick={() => {
            if (stage == 1) {
              if (
                !event.title ||
                !event.description ||
                !event.date_start ||
                !event.date_end ||
                !event.meta ||
                !event.meta_unit ||
                !event.form
              ) {
                return;
              }
              setModalState(1);
            } else if (stage == 2) {
              if (
                !event.title ||
                !event.description ||
                !event.date_start ||
                !event.date_end ||
                !event.meta ||
                !event.meta_unit ||
                !event.form
              ) {
                return;
              }
              if (!event.units || (!event.teams && !event.agents)) {
                return;
              }
              setModalState(2);
            } else {
              setModalState(stage);
            }
          }}
          sx={{
            minWidth: "10px",
            height: "10px",
            borderRadius: "50%",
            padding: 0,
            backgroundColor: modalState === stage ? "#1976d2" : "#c4c4c4",
            "&:hover": {
              backgroundColor: modalState === stage ? "#115293" : "#a4a4a4",
            },
          }}
        />
      ))}
    </Box>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className={modalState === 2 ? "w-[900px] h-auto" : "w-[516px] h-auto"}
        sx={style}
      >
        <Box className="flex flex-col" alignItems="left" mb={2} gap={1}>
          <Image src="/next.svg" alt="Logo" width={30} height={30} />
          <Typography fontFamily={"Poppins"} variant="h4" fontWeight="bold">
            Novo Evento
          </Typography>
        </Box>

        {renderStage()}

        <Box display="flex" justifyContent="space-between">
          {modalState < 2 ? (
            <>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mr: 1,
                  textTransform: "capitalize",
                }}
                color="error"
                onClick={() => {
                  onClose();
                }}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                sx={{
                  ml: 1,
                  textTransform: "capitalize",
                  backgroundColor: "#19B394",
                  "&:hover": {
                    backgroundColor: "#17A384",
                  },
                }}
                className="!text-white"
                onClick={handleNext}
              >
                Continuar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mr: 1,
                  textTransform: "capitalize",
                }}
                color="error"
                onClick={() => {
                  onClose();
                }}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                sx={{
                  ml: 1,
                  textTransform: "capitalize",
                  backgroundColor: "#19B394",
                  "&:hover": {
                    backgroundColor: "#17A384",
                  },
                }}
                className="!text-white"
                onClick={() => onSubmit(event)}
              >
                Finalizar
              </Button>
            </>
          )}
        </Box>
        {/* Navegação por bolinhas */}
        {renderNavigationDots()}
      </Box>
    </Modal>
  );
}
