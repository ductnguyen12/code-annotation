import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { ReactElement, useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import QuestionComponent from '../../components/QuestionComponent';
import { useDemographicQuestions } from '../../hooks/demographicQuestion';
import { useQuestionSets } from '../../hooks/questionSet';
import { DemographicQuestion, QuestionSet, Solution } from "../../interfaces/question.interface";
import { Rater } from '../../interfaces/rater.interface';
import { registerRaterAsync } from '../../slices/raterRegSlice';

interface StepData {
  questionSet?: QuestionSet;
  questions: DemographicQuestion[];
  solutions: (Solution | undefined)[];
}

const DemographicQuestions = (): ReactElement => {
  const {
    questionSets,
  } = useQuestionSets();

  const {
    questions,
  } = useDemographicQuestions();

  const dispatch = useAppDispatch();

  const [steps, setSteps] = useState<StepData[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);

  const getStepData = useCallback(() => {
    return questionSets.map(questionSet => {
      return {
        questionSet,
        questions: questions.filter(question => questionSet.id === question.questionSetId),
        solutions: questions.filter(question => questionSet.id === question.questionSetId).map(_ => undefined),
      } as StepData;
    })
  }, [questions, questionSets]);

  useEffect(() => {
    setSteps(getStepData());
  }, [questions, questionSets, getStepData]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const hanldeSubmission = () => {
    const solutions = steps.flatMap(step => step.solutions.filter(s => !!s).map(s => s as Solution));
    dispatch(registerRaterAsync({ solutions } as Rater));
  }

  return (
    <Box>
      <Stepper 
        alternativeLabel
        sx={{
          mt: 2,
          mb: 1,
        }}
        activeStep={activeStep}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>
              {step.questionSet?.title}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {steps.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '75%',
            margin: 'auto',
          }}
        >
          {steps[activeStep].questionSet?.description && (
            <Paper
              elevation={4}
              sx={{
                p: 3,
                m: 2,
                borderRadius: '12px',
              }}
            >
              {steps[activeStep].questionSet?.description}
            </Paper>
          )}
          {steps[activeStep].questions.map((question, index) => (
            <Paper
              key={index}
              elevation={4}
              sx={{
                p: 3,
                m: 2,
                borderRadius: '12px',
              }}
            >
              <QuestionComponent
                questionIndex={index}
                question={question}
                solution={steps[activeStep].solutions[index]}
                onValueChange={(questionIndex: number, solution: Solution) => {
                  steps[activeStep].solutions[questionIndex] = solution;
                  setSteps([...steps]);
                }}
              />
            </Paper>
          ))}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, m: 1 }}>
            <IconButton disabled={activeStep === 0} aria-label="Back" onClick={handleBack}>
              <ArrowBackIcon fontSize="large" />
            </IconButton>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1
              ? (
                <LoadingButton
                  sx={{

                  }}
                  loading={false}
                  endIcon={<SendIcon />}
                  loadingPosition="end"
                  variant="contained"
                  onClick={hanldeSubmission}
                >
                  <span>Submit</span>
                </LoadingButton>
              )
              : (
                <IconButton aria-label="Next" size="large" onClick={handleNext}>
                  <ArrowForwardIcon fontSize="large" />
                </IconButton>
              )
            }
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DemographicQuestions;