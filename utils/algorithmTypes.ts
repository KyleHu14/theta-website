export type RarityObjectType = {
	[key: string]: DayRarity;
};

type DayRarity = {
	[key: string]: number;
};

export type StuType = {
	name: string;
	freeTimes: string[];
};

export type FinalScheduleType = {
	[key: string]: string[];
};

export type ProcessedDataType = {
	students: StuType[];
	rarities: RarityObjectType;
};
