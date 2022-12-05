import React, { createRef, useEffect, useState } from 'react';
import { classNames } from '../../../helper/classNames';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import './polacode.scss';
interface IPolaCodeProps {
  content: string | React.ReactNode;
  className?: string;
}

const PolaCode: React.FC<IPolaCodeProps> = ({ content, className = '' }) => {
  const editorRef = createRef<HTMLDivElement>();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [srcImage, setSrcImage] = useState<string>('');

  const handleZoomImage = () => {
    const imgsEditor = editorRef.current?.querySelectorAll('img');
    console.log(imgsEditor);

    if (imgsEditor) {
      imgsEditor.forEach((imgElement) => {
        imgElement.addEventListener('click', function () {
          const src: string = this.getAttribute('src') || '';
          setSrcImage(src);
          setVisibleModal(true);
        });
      });
    }
  };

  useEffect(() => {
    handleZoomImage();
  }, [editorRef]);

  return (
    <>
      <Modal
        visible={visibleModal}
        setVisibleModal={setVisibleModal}
        size="xxl"
      >
        <>
          <img
            src={srcImage}
            alt=""
            className="inline-block max-h-[548px] w-full object-contain object-center"
          />

          <Button
            className="mt-5 ml-auto"
            onClick={() => {
              setSrcImage('');
              setVisibleModal(false);
            }}
          >
            Đóng
          </Button>
        </>
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
  );
};

export default PolaCode;
