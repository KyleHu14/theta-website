export type AvailableTimesType = {
	[key: string]: string[];
};

export type RarityObjectType = {
	[key: string]: DayRarity;
};

type DayRarity = {
	[key: string]: number;
};
