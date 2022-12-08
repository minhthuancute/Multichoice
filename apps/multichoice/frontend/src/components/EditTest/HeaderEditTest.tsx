import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../Commons/Breadcrumb/Breadcrumb';
import { FaPencilAlt } from 'react-icons/fa';
import ToolTip from '../Commons/ToolTip/ToolTip';
import { BsCalendarDate } from 'react-icons/bs';
import { getDate } from '../../utils/format_date';
import { AiOutlineFieldTime, AiOutlineQuestionCircle } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';
import Modal from '../Commons/Modal/Modal';
import FormEditTest from '../FormEditTest/FormEditTest';
import { secondsToMinutes } from '../../utils/minutes_to_seconds';
import { topicStore } from '../../store/rootReducer';
import { validObject } from '../../helper/validObject';

const HeaderEditTest: React.FC = () => {
  const { topic } = topicStore();
  const [visibleModalEditTest, setVisibleModalEditTest] =
    useState<boolean>(false);

  return validObject(topic) ? (
    <div className="bg-white">
      <Modal
        visible={visibleModalEditTest}
        setVisibleModal={setVisibleModalEditTest}
        size="md"
      >
        <FormEditTest setVisibleModalEditTest={setVisibleModalEditTest} />
      </Modal>
      <div className="container pt-4">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/tests">Đề thi</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <div>{topic.title}</div>
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="mt-4 flex items-start justify-between">
          <div>
            <h3 className="text-slate-800 text-xl font-semibold">
              {topic.title}
            </h3>
            <p className="text-slate-800 text-sm mt-1">{topic.description}</p>
          </div>
          <div className="ctas">
            <ToolTip title="Cập nhật đề thi">
              <button
                className="create-test rounded-md bg-slate-800 text-xs
              text-white font-bold flex justify-center items-center px-3 h-8"
                onClick={() => setVisibleModalEditTest(true)}
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
            <span>{getDate(topic.createdAt)}</span>
          </li>
          <li className="flex items-center text-sm mr-3">
            <AiOutlineQuestionCircle className="text-slate-800 mr-1" />
            <span>{topic?.questions.length || 0} câu hỏi</span>
          </li>
          <li className="flex items-center text-sm">
            <AiOutlineFieldTime className="text-slate-800 mr-1 text-base" />
            <span>
              {secondsToMinutes(topic.expirationTime)} phút{' '}
              {topic.timeType.toUpperCase() === 'REALTIME'
                ? ' (Realtime)'
                : null}
            </span>
          </li>
        </ul>
        <div className="right">
          <Link
            to={'/questions/create?topic_id=' + topic.id}
            className="btn-success rounded-md bg-primary-900 text-sm
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
  ) : null;
};

export default HeaderEditTest;
