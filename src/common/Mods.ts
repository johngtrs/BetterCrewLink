export type ModsType =
	| 'NONE'
	| 'TOWN_OF_IMPOSTORS'
	| 'TOWN_OF_US'
	| 'THE_OTHER_ROLES'
	| 'EXTRA_ROLES'
	| 'POLUS_GG'
	| 'OTHER';

export interface AmongusMod {
	id: ModsType;
	label: string;
	dllStartsWith?: string;
}

export const modList: AmongusMod[] = [
	// recieve this later from git?
	{
		id: 'NONE',
		label: 'None',
	},
	{
		id: 'TOWN_OF_US',
		label: 'Town of Us',
		dllStartsWith: 'TownOfUs',
	},
	{
		id: 'TOWN_OF_IMPOSTORS',
		label: 'Town of Impostors',
		dllStartsWith: 'TownOfImpostors',
	},
	{
		id: 'THE_OTHER_ROLES',
		label: 'The Other Roles',
		dllStartsWith: 'TheOtherRoles',
	},
	{
		id: 'POLUS_GG',
		label: 'Polus.gg',
		dllStartsWith: 'Polus',
	},
	{
		id: 'OTHER',
		label: 'Other',
	},
];
