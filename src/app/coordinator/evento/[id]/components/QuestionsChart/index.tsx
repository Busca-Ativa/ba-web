import {
  Box,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import QuestionsChartBA from "./QuestionChart";
import { useEffect, useState } from "react";

const QuestionChart = ({
  summary,
  formReference,
}: {
  summary: any;
  formReference: any;
}) => {
  const [chartData, setChartData] = useState<Record<string, number>>({});
  const [questionId, setQuestionId] = useState<string | null>(null);

  enum questionsTypes {
    NUMBER = "number",
    CATEGORICAL = "categorical",
    TEXTUAL = "textual",
  }

  useEffect(() => {
    if (!questionId && summary.answers?.length) {
      setQuestionId(summary.answers[0].question_id);
    }
  }, [summary.answers, questionId]);

  useEffect(() => {
    if (!questionId) return;

    const question = summary.answers?.find(
      (answer: any) => answer.question_id === questionId
    );
    if (!question) return;

    if (question.type === questionsTypes.CATEGORICAL) {
      const options = question.options || {};
      const data = Object.values(options).reduce(
        (acc: Record<string, number>, opt: any) => {
          if (opt.label && opt.label.length > 1) {
            acc[opt.label] = opt.count;
          }
          return acc;
        },
        {}
      );
      setChartData(data);
    }
    if (question.type === questionsTypes.TEXTUAL) {
      const data = question.responses || [];

      const textData = data.reduce(
        (acc: Record<string, number>, answer: any) => {
          let text =
            typeof answer === "string" ? answer.trim().toLowerCase() : "";

          text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

          if (text.length > 0) {
            acc[text] = (acc[text] || 0) + 1;
          }

          return acc;
        },
        {}
      );

      setChartData(textData);
    }
  }, [summary, questionId]);

  return (
    <Box flex={1} mr={2} sx={{ display: "flex", flexDirection: "column" }}>
      <Typography
        sx={{
          color: "#0e1113",
          fontSize: "1.25rem",
          fontWeight: "bold",
          fontFamily: "Poppins",
          lineHeight: "2",
        }}
      >
        Respostas por questão
      </Typography>

      {summary.answers?.length > 0 && (
        <FormControl sx={{ mb: 2, minWidth: 250, mt: 2 }}>
          <InputLabel id="select-question-label">
            Selecione a questão
          </InputLabel>
          <Select
            labelId="select-question-label"
            value={questionId || ""}
            onChange={(e) => setQuestionId(e.target.value)}
            label="Selecione a questão"
            sx={{ height: "40px" }}
          >
            {summary.answers.map((answer: any) => {
              const element =
                formReference?.survey_schema?.pages?.[0]?.elements?.find(
                  (el: any) =>
                    el.id === answer.id || el.id === answer.question_id
                );

              return (
                <MenuItem key={answer.question_id} value={answer.question_id}>
                  {element ? element.title : "Sem título"}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}

      <QuestionsChartBA data={chartData} />
    </Box>
  );
};

export default QuestionChart;
