import React, { createRef, useEffect, useState } from 'react';
import { classNames } from '../../../helper/classNames';
import Modal from '../Modal/Modal';
import './polacode.scss';
interface IPolaCodeProps {
  content: string | React.ReactNode;
  className?: string;
}

const PolaCode: React.FC<IPolaCodeProps> = ({ content, className = '' }) => {
  const editorRef = createRef<HTMLDivElement>();
  const [srcImage, setSrcImage] = useState<string>('');

  const handleZoomImage = () => {
    const imgsEditor = editorRef.current?.querySelectorAll('img');
    if (imgsEditor) {
      imgsEditor.forEach((imgElement) => {
        imgElement.addEventListener('click', function () {
          const src: string = this.getAttribute('src') || '';
          setSrcImage(src);
        });
      });
    }
  };

  useEffect(() => {
    handleZoomImage();
  }, [editorRef]);

  return content ? (
    <>
      <Modal placement="CENTER" setVisibleModal={setSrcImage} size="full">
        <div className="px-4 py-4 my-4 bg-white shadow-lg">
          <img
            src={srcImage}
            alt=""
            className="inline-block max-h-[548px] w-full object-contain object-center"
          />

          <button
            className="create-test rounded-md flex justify-center items-center w-32 h-10 text-sm
            text-white font-bold bg-slate-800 mt-4 ml-auto"
            onClick={() => setSrcImage('')}
          >
            Đóng
          </button>
        </div>
      </Modal>

      <div
        className={classNames(['rounded-sm', className])}
        ref={editorRef}
        dangerouslySetInnerHTML={{
          __html: `
          <div class='show-editor'>
            ${content}
          </div>`,
        }}
      ></div>
    </>
  ) : null;
};

export default PolaCode;
