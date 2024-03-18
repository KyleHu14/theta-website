class Student {
	// Name of student
	name: string;

	// Availability of student
	// Structure (date: [array of available times of the date])
	availability: Record<string, string[]>;

	constructor(name: string, availability: Record<string, string[]>) {
		this.name = name;
		this.availability = availability;
	}

	addAvailability(date: string, timeSlot: string) {
		// If there are existing timeslots, we can just append
		if (this.availability[date]) {
			this.availability[date].push(timeSlot);
			return;
		}

		// Otherwise, the date is an array containing the current timeSlot
		this.availability[date] = [timeSlot];
	}

	removeAvailability(date: string, timeSlot: string) {
		if (this.availability[date]) {
			const index = this.availability[date].indexOf(timeSlot);

			// If we found an index, then we can remove it from the array
			if (index !== -1) {
				this.availability[date].splice(index, 1);
			}
		}
	}

	getAvailability(date: string): string[] {
		// Return either the availability array of the date or return an empty array
		return this.availability[date] || [];
	}

	getAvailableArray() {
		let availabilityArr: number[] = [];
		const dates: string[] = Object.keys(this.availability);

		for (let i = 0; i < dates.length; i++) {
			// Each entry in the availability array represents the number of times an individual is available on a particular day
			availabilityArr[i] = this.availability[dates[i]].length;
		}

		return availabilityArr;
	}
}

export default Student;
