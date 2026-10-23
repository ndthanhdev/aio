export enum PageLayoutEnum {
	CV = "cv",
	None = "none",
	Post = "post",
}

export interface PageContext {
	layout: PageLayoutEnum;
}
