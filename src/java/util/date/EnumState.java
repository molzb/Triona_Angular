package util.date;

/**
 * Enum for all german states
 * @author Bernhard
 */
public enum EnumState {
	BW ("Baden-Württemberg"),
	BY ("Bayern"),
	BE ("Berlin"),
	BB ("Brandenburg"),
	HB ("Bremen"),
	HH ("Hamburg"),
	HE ("Hessen"),
	MV ("Mecklenburg-Vorpommern"),
	NI ("Niedersachsen"),
	NW ("Nordrhein-Westfalen"),
	RP ("Rheinland-Pfalz"),
	SL ("Saarland"),
	SN ("Sachsen"),
	ST ("Sachsen-Anhalt"),
	SH ("Schleswig-Holstein"),
	TH ("Thüringen");

	public String name;

	EnumState(String name) {
		this.name = name;
	}
}