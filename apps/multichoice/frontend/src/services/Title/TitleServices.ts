const defaultTitle = 'Đề Trắc Nghiệm | Làm Trắc nghiệm online';
export const titleServices = {
  setTitle(title: string = defaultTitle): void {
    document.title = title;
  },

  removeTitle(): void {
    document.title = defaultTitle;
  },

  addSub(subTitle: string): void {
    document.title = subTitle + ' - ' + defaultTitle;
  },
};
