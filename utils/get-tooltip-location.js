export function getTooltipLocation(
	position,
	el,
	tooltip,
	{ innerHeight, innerWidth } = window,
) {
	const rect = el.getBoundingClientRect();
	const tooltipRect = tooltip.getBoundingClientRect();
	let top = rect.bottom + 12;
	let left = Math.max(
		12,
		Math.floor(rect.left + rect.width / 2 - tooltipRect.width / 2),
	);

	if (top + tooltipRect.height > view.innerHeight) {
		top = rect.top - 12 - tooltipRect.height;
	}

	if (left + tooltipRect.width > view.innerWidth) {
		left = view.innerWidth - tooltipRect.width - 24;
	}

	return {
		top,
		left,
	};
}
