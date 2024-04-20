export type RarityObjectType = {
	[key: string]: DayRarity;
};

type DayRarity = {
	[key: string]: number;
};

export type stuType = {
	name: string;
	freeTimes: string[];
};

export type finalScheduleType = {
	[key: string]: string[];
};

export type processedDataType = {
	students: stuType[];
	rarities: RarityObjectType;
};
