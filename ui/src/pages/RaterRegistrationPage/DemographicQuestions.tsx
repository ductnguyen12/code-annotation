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
import { ReactElement, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import QuestionComponent from '../../components/QuestionComponent';
import { useDemographicQuestionGroups, useDemographicQuestions } from '../../hooks/demographicQuestion';
import { DemographicQuestion, Solution } from "../../interfaces/question.interface";
import { Rater } from '../../interfaces/rater.interface';
import { registerRaterAsync } from '../../slices/raterRegSlice';
import { StepData } from './stepper.interface';


const DemographicQuestions = ({
  datasetId,
  raterId,
  externalId,
  externalSystem,
}: {
  datasetId?: number,
  raterId?: string,
  externalId?: string,
  externalSystem?: string,
}): ReactElement => {
  const {
    questionGroups,
  } = useDemographicQuestionGroups(datasetId);

  const {
    questions,
  } = useDemographicQuestions(datasetId);

  const dispatch = useAppDispatch();

  const [steps, setSteps] = useState<StepData[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [validities, setValidities] = useState<boolean[]>([]);
  const [showErrors, setShowErrors] = useState<boolean[]>([]);

  const stepQuestionsPriority = useMemo(() => {
    return Object.fromEntries(
      questionGroups.map(group => {
        const questionsPriority = Object.fromEntries(group.questions?.map((q, i) => [q.id as number, i]) || []);
        return [group.id as number, questionsPriority]
      })
    );
  }, [questionGroups]);

  useEffect(() => {
    const newStepData = questionGroups.map(group => {
      const result = {
        questionGroup: group,
        questions: questions.filter(question => question.groupIds?.includes(group.id as number)),
      } as StepData;
      const questionsPriority = stepQuestionsPriority[group.id as number];
      console.log(questionsPriority);

      if (questionsPriority) {
        result.questions = result.questions.sort(
          (q1, q2) => questionsPriority[q1.id as number] - questionsPriority[q2.id as number]
        );
      }
      return result;
    });
    setSteps(newStepData);
    setActiveStep(0);
    if (newStepData.length > 0) {
      setShowErrors(newStepData[0].questions?.map(_ => false) || []);
      setValidities(newStepData[0].questions?.map(_ => true) || []);
    }
  }, [questionGroups, questions, stepQuestionsPriority]);

  useEffect(() => {
    if (!steps[activeStep] || !steps[activeStep].questions) {
      return;
    }
    setShowErrors(steps[activeStep].questions.map(_ => false));
    setValidities(steps[activeStep].questions.map(_ => true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, setShowErrors]);

  const handleNext = () => {
    if (!validities.every(Boolean)) {
      setShowErrors([...showErrors.fill(true)]);
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleValidityChange = (questionIndex: number, validity: boolean) => {
    if (validities[questionIndex] === validity)
      return;
    validities[questionIndex] = validity;
    setValidities([...validities]);
  }

  const handleValueChange = (questionIndex: number, solution: Solution, subQuestionIndex?: number) => {
    // Get the new solution for the current parent question
    const newSolution = subQuestionIndex === undefined
      ? solution
      : steps[activeStep].questions[questionIndex].solution;

    // Insert a new sub-question that was cloned from the current one with the new solution
    const subQuestions = subQuestionIndex === undefined
      ? steps[activeStep].questions[questionIndex].subQuestions
      : [
        ...(steps[activeStep].questions[questionIndex].subQuestions as Array<DemographicQuestion>)
          .slice(0, subQuestionIndex),
        {
          ...(steps[activeStep].questions[questionIndex].subQuestions as Array<DemographicQuestion>)[subQuestionIndex as number],
          solution,
        },
        ...(steps[activeStep].questions[questionIndex].subQuestions as Array<DemographicQuestion>)
          .slice((subQuestionIndex as number) + 1),
      ];

    const newActiveStep = {
      ...steps[activeStep],
      questions: [
        ...steps[activeStep].questions.slice(0, questionIndex),
        {
          ...steps[activeStep].questions[questionIndex],
          solution: newSolution,
          subQuestions,
        } as DemographicQuestion,
        ...steps[activeStep].questions.slice(questionIndex + 1),
      ],
    } as StepData;

    // Insert new step
    const newSteps = [
      ...steps.slice(0, activeStep),
      newActiveStep,
      ...steps.slice(activeStep + 1),
    ];

    setSteps(newSteps);
  };

  const hanldeSubmission = () => {
    if (!validities.every(Boolean)) {
      setShowErrors([...showErrors.fill(true)]);
      return;
    }

    const solutions = steps.flatMap(step => step.questions
      .flatMap(q => {
        if (q.solution) {
          return [
            q.solution,
            ...(q.subQuestions || []).map(sq => sq.solution).filter(s => !!s)
          ] as Array<Solution>;
        }
        return [];
      })
      .map(s => {
        s.raterId = raterId;
        return s;
      })
    );

    dispatch(registerRaterAsync({
      id: raterId,
      currentDatasetId: datasetId,
      externalId,
      externalSystem,
      solutions,
    } as Rater));
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
              {step.questionGroup?.title}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {steps.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
          }}
        >
          {steps[activeStep].questionGroup?.description && (
            <Paper
              elevation={4}
              sx={{
                p: 3,
                m: 2,
                borderRadius: '12px',
              }}
            >
              {steps[activeStep].questionGroup?.description}
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
                solution={steps[activeStep].questions[index].solution}
                showError={showErrors.length > index && showErrors[index]}
                setShowError={(showError: boolean) => {
                  if (showErrors.length > index) {
                    showErrors[index] = showError;
                    setShowErrors([...showErrors]);
                  }
                }}
                onValueChange={handleValueChange}
                onValidityChange={handleValidityChange}
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