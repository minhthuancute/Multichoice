import React, { useLayoutEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { topicServices } from '../../services/TopicServices';
import { ITopicResponse } from '../../types';
import Breadcrumb from '../Commons/Breadcrumb/Breadcrumb';
import { FaPencilAlt } from 'react-icons/fa';
import ToolTip from '../Commons/ToolTip/ToolTip';
import { BsCalendarDate } from 'react-icons/bs';
import { getDate } from '../../utils/formatDate';
import { AiOutlineFieldTime, AiOutlineQuestionCircle } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';
import Modal from '../Modal/Modal';
import FormEditTest from '../../pages/Tests/Edit/FormEditTest';

const HeaderEditTest: React.FC = () => {
  const { id: topicId } = useParams();

  const [topicInfor, setTopicInfor] = useState<ITopicResponse>();
  const [openModalEditTest, setOpenModalEditTest] = useState<boolean>(false);

  const getTopicById = async () => {
    try {
      const { data }: { data: ITopicResponse } =
        await topicServices.getTopicById(topicId || '');
      setTopicInfor(data);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    getTopicById();
  }, [topicId]);

  if (!topicInfor) {
    return null;
  }

  return (
    <div className="header-edit-test">
      <Modal openModal={openModalEditTest}>
        <FormEditTest setOpenModalEditTest={setOpenModalEditTest} />
      </Modal>
      <div className="container py-4 border-b border-solid border-slate-200">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/tests">Đề thi</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <div>{topicInfor.title}</div>
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="mt-4 flex items-center justify-between">
          <h3 className="text-slate-800 text-xl font-semibold">
            {topicInfor.title}
          </h3>
          <div className="ctas">
            <ToolTip title="Cập nhật đề thi">
              <button
                className="create-test btn-primary rounded-md bg-violet-600 text-xs
              text-white font-bold flex justify-center items-center px-3 h-8 transition-all
              duration-200 hover:bg-violet-600"
                onClick={() => setOpenModalEditTest(true)}
              >
                <FaPencilAlt />
              </button>
            </ToolTip>
          </div>
        </div>
      </div>
      <div className="container py-4 flex items-center justify-between">
        <ul className="left flex items-center">
          <li className="flex items-center text-sm mr-3">
            <BsCalendarDate className="text-slate-500 mr-2" />
            <span>{getDate(topicInfor.createdAt)}</span>
          </li>
          <li className="flex items-center text-sm mr-3">
            <AiOutlineQuestionCircle className="text-slate-800 mr-1" />
            <span>{topicInfor.questions.length} câu hỏi</span>
          </li>
          <li className="flex items-center text-sm">
            <AiOutlineFieldTime className="text-slate-800 mr-1 text-base" />
            <span>{topicInfor.expirationTime} phút</span>
          </li>
        </ul>
        <div className="right">
          <Link
            to={'/questions/create?topic_id=' + topicInfor.id}
            className="create-test btn-primary rounded-md bg-primary-900 text-sm
            text-white font-bold flex justify-center items-center px-4 h-10 transition-all
            duration-200 hover:bg-primary-800
            "
          >
            <FaPlus className="mr-1 text-xs font-semibold" />
            Thêm câu hỏi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderEditTest;
