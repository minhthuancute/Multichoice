import React from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import { classNames } from '../../../helper/classNames';
import 'react-quill/dist/quill.snow.css';
import { Control, Controller } from 'react-hook-form';

interface IEditorProps {
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any, any>;
  height?: number;
  placeholder?: string;
  isError?: boolean;
  errMessage?: string;
}

const Editor: React.FC<IEditorProps> = ({
  control,
  name = '',
  height = 200,
  placeholder = 'Write something',
  isError = true,
  errMessage = '',
}) => {
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

  return control ? (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .ql-container{
            min-height: ${height}px;
            height: max-content;
          }

          .ql-editor{
            font-family: 'Lexend', sans-serif;
            font-size: 14px;
            color: rgb(87, 83, 78);
            font-weight: 400 !important;
          }
        `,
        }}
      />
      <Controller
        control={control}
        name={name}
        render={({ field: { ...fieldProps } }) => (
          <ReactQuill
            {...fieldProps}
            theme="snow"
            className={classNames(['editor, rounded-sm'])}
            placeholder={placeholder}
            modules={Editor.modules}
            formats={Editor.formats}
          />
        )}
      ></Controller>

      {isError && (
        <p className="mt-1 text-xs text-red-500 first-letter:capitalize">
          {errMessage}
        </p>
      )}
    </>
  ) : null;
};

export default React.memo(Editor);
