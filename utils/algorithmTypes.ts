export type AvailableTimesType = {
	[key: string]: string[];
};

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
