import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #1976d2;
  border-bottom: 5px solid #1976d2;
  width: 40px;
  height: 40px;
  animation: ${spin} 2s linear infinite;
`

export default Spinner;