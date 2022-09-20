import React, { useState } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { classNames } from '../../helper/classNames';

interface IQuillEditorProps {
  height?: number;
  className?: string;
  placeholder?: string;
  isError?: boolean;
  errMessage?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
}

const QuillEditor: React.FC<IQuillEditorProps> = ({
  height = 200,
  onChange,
  className = '',
  placeholder = 'Write something',
  isError = true,
  errMessage = '',
  defaultValue = '',
}) => {
  const [value, setValue] = useState<string>(defaultValue);

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
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .ql-container{
            height: ${height}px
          }
        `,
        }}
      />
      <ReactQuill
        theme="snow"
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className={classNames(['editor'], {
          'border border-red-500': isError,
        })}
        placeholder={placeholder}
        modules={Editor.modules}
        formats={Editor.formats}
      />
      {/* show error */}
      {isError && (
        <p className="mt-1 text-xs text-red-500 first-letter:capitalize">
          {errMessage}
        </p>
      )}
    </div>
  );
};

export default React.memo(QuillEditor);
