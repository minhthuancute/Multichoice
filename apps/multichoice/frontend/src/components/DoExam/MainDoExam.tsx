import React, { useState } from 'react';
import FooterDoExam from './FooterDoExam';
import NavQuestion from './NavQuestion';
import ShowQuestion from './ShowQuestion';

const MainDoExam: React.FC = () => {
  const [indexQuestion, setIndexQuestion] = useState<number>(0);

  const startExam = () => {
    // try {
    //   const payload: IPayloadStartExam = {
    //     topicID: exam.id,
    //     username: formData.user_name,
    //   };
    //   const { data } = await examServices.startExam(payload);
    //   if (data.success) {
    //     localServices.setData(START_TIME, Date.now());
    //     setUserData({
    //       user_name: formData.user_name,
    //       user_id: data.data.userid,
    //     } as IInforUserDoExam);
    //     const urlNavigate = '/exam/' + exam.url + '/do-exam';
    //     navigate(urlNavigate);
    //   }
    // } catch (error) {
    //   notify({
    //     message: 'Something went wrong !',
    //     type: 'danger',
    //   } as iNotification);
    // }
  };

  return (
    <div
      className="relative"
      style={{
        minHeight: 'calc(100vh - 69px)',
      }}
    >
      <div className="container mx-auto pt-10 flex gap-x-8">
        <div className="w-2/3">
          <ShowQuestion
            indexQuestion={indexQuestion}
            setIndexQuestion={setIndexQuestion}
          />
        </div>
        <div className="w-1/3">
          <NavQuestion
            indexQuestion={indexQuestion}
            setIndexQuestion={setIndexQuestion}
          />
        </div>
      </div>

      <FooterDoExam />
    </div>
  );
};

export default MainDoExam;
