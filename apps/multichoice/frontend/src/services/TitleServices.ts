class TitleServices {
  defaultTitle = 'MultiChoise';
  setTitle(title: string = this.defaultTitle): void {
    document.title = title;
  }

  removeTitle(): void {
    document.title = this.defaultTitle;
  }

  addSub(subTitle: string): void {
    document.title = subTitle + ' - ' + this.defaultTitle;
  }
}
export const titleServices = new TitleServices();
