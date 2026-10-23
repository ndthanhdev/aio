export const isValidNanoId = (id?: null | string): boolean => {
	if (!id) {
		return false;
	}

	const nanoIdRegex = /^[a-z0-9]{21}$/u;

	return nanoIdRegex.test(id);
};
