import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const LayoutSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><rect width="14" height="14" x="0" y="0" stroke="white" stroke-width="3" fill-opacity="0" /><line x1="9" y1="0" x2="8" y2="14" stroke="white" stroke-width="1.5" /><line x1="8" y1="7" x2="14" y2="7" stroke="white" stroke-width="1.5" /></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#3b82f680',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#1976d2',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><rect width="14" height="14" x="0" y="0" stroke="white" stroke-width="3" fill-opacity="0" /><line x1="0" y1="8" x2="14" y2="8" stroke="white" stroke-width="1.5" /><line x1="7" y1="8" x2="7" y2="14" stroke="white" stroke-width="1.5" /></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#3b82f680',
    borderRadius: 20 / 2,
  },
}));

export default LayoutSwitch;