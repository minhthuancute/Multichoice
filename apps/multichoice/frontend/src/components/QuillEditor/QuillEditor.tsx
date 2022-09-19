import React, { useState } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { classNames } from '../../helper/classNames';

interface IQuillEditorProps {
  className?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const QuillEditor: React.FC<IQuillEditorProps> = ({
  onChange,
  className = '',
  placeholder = 'Write something',
}) => {
  const [value, setValue] = useState<string>('');

  const Editor: ReactQuillProps = {};
  Editor.modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };
  Editor.formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ];

  const handleChange = (value: string) => {
    onChange(value);
    setValue(value);
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        className={classNames(['editor mb-16', className], {})}
        placeholder={placeholder}
        modules={Editor.modules}
        formats={Editor.formats}
      />
    </div>
  );
};

export default React.memo(QuillEditor);
