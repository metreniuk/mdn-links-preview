import { getTooltipLocation } from "../utils/get-tooltip-location";

describe("Content script", () => {
	describe("getTooltipLocation", () => {
		describe("should return the correct position when", () => {
			it.only("on the top", () => {
				const position = "top";
				const el = {
					getBoundingClientRect: () => ({
						left: 200,
						top: 200,
						width: 100,
						height: 50,
					}),
				};
				const tooltip = {
					getBoundingClientRect: () => ({
						width: 50,
						height: 50,
					}),
				};
				const view = {
					innerHeight: 1000,
					innerWidth: 1000,
				};
				const expected = {
					top: 12,
					left: 44,
				};
				const result = getTooltipLocation(position, el, tooltip, view);
				expect(result).toEqual(expected);
			});
			it("on the bottom", () => {});
			it("on the left", () => {});
			it("on the right", () => {});
		});

		describe("should return the correct position when doesn't have space", () => {});
	});
});
