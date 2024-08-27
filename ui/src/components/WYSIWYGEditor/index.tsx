import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import './custom-style.css';

export default function WYSIWYGEditor({
  value,
  placeholder,
  onChange,
  onFocus,
  onBlur,
}: {
  value?: string,
  placeholder?: string,
  onChange?: (value: string) => void,
  onFocus?: () => void,
  onBlur?: () => void,
}) {
  return (
    <ReactQuill
      theme="snow"
      placeholder={placeholder}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      value={value || ''}
    />
  );
}