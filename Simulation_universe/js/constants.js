// Physics constants
const c = 2.99792458e8; // Light constant
const k = 1.38064852e-23; // Boltzmann constant
const h = 6.62607004e-34; // Planck constant
const G = 6.67385e-11; // Newton constant : Système international 2018

// Distances
const AU = 1.495978707e11; // Astronomical unit in meters
const parsec = 3.0857e16; // Parsec in meters
const k_parsec = 3.0857e19; // Kiloparsec in meters
const M_parsec = 3.0857e22; // Megaparsec in meters
const ly = 9.4607e15; // Light-year in meters

// Nombre de jours selon l'année choisie
var TypeAnnee;
(function (TypeAnnee) {
    TypeAnnee[TypeAnnee["Siderale"] = 365.256363051] = "Siderale";
    TypeAnnee[TypeAnnee["Julienne"] = 365.25] = "Julienne";
    TypeAnnee[TypeAnnee["Tropique2000"] = 365.242190517] = "Tropique2000";
    TypeAnnee[TypeAnnee["Gregorienne"] = 365.2425] = "Gregorienne";
})(TypeAnnee || (TypeAnnee = {}));
