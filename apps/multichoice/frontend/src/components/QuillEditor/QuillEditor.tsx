import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { classNames } from '../../helper/classNames';

interface IQuillEditorProps {
  height?: string;
  placeholder?: string;
}

const QuillEditor: React.FC<IQuillEditorProps> = ({
  height = 'h-[248px]',
  placeholder = 'Write something',
}) => {
  const [value, setValue] = useState<string>('');
  const [focusEditor, setFocusEditor] = useState<boolean>(false);

  const Editor: any = {};
  const dev = false;
  Editor.modules = {
    toolbar: dev
      ? [
          // [{ show: false }],
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
        ]
      : false,
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

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        className={classNames(['editor'], {})}
        placeholder={placeholder}
        modules={Editor.modules}
        formats={Editor.formats}
        onFocus={() => setFocusEditor(true)}
        onBlur={() => setFocusEditor(false)}
      />
    </div>
  );
};

export default QuillEditor;
