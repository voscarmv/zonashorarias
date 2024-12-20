function getFirstSundayOfNovemberAt2AM(year) {
    if (typeof year !== "number" || year < 1) {
        throw new Error("Please provide a valid year as a number greater than 0.");
    }

    let date = new Date(year, 10, 1); // Start from November 1st (month 10)

    while (date.getDay() !== 0) { // Adjust to the first Sunday
        date.setDate(date.getDate() + 1);
    }

    date.setHours(2, 0, 0, 0); // Set time to 2:00 AM
    return date;
}

// Example usage
console.log(getFirstSundayOfNovemberAt2AM(2024));

function getSecondSundayOfMarchAt2AM(year) {
    if (typeof year !== "number" || year < 1) {
        throw new Error("Please provide a valid year as a number greater than 0.");
    }

    let date = new Date(year, 2, 1); // Start from March 1st (month 2)

    while (date.getDay() !== 0) { // Adjust to the first Sunday
        date.setDate(date.getDate() + 1);
    }

    date.setDate(date.getDate() + 7); // Add 7 days to get the second Sunday
    date.setHours(2, 0, 0, 0); // Set time to 2:00 AM
    return date;
}

// Example usage
console.log(getSecondSundayOfMarchAt2AM(2024));

/*
Horario de invierno

Zona Sureste: UTC-5

    Quintana Roo

Zona Centro UTC- 6

    Aguascalientes, Campeche, Chiapas, Chihuahua, Coahuila, Colima (excepto islas San Benedicto, Socorro y Roca Partida), Ciudad de México, Durango, Guanajuato, Guerrero, Hidalgo, Jalisco, México, Michoacán, Morelos, Nayarit (solo Bahía de Banderas), Nuevo León, Oaxaca, Puebla, Querétaro, San Luis Potosí, Tabasco, Tamaulipas, Tlaxcala, Veracruz, Yucatán, Zacatecas

Zona Pacífico: UTC-7

    Baja California Sur, Colima (solo islas San Benedicto, Socorro y Roca Partida, que pertenecen al archipiélago de Revillagigedo), Nayarit (excepto Bahía de Banderas), Sinaloa, Sonora

Zona Noroeste: UTC-8 (UTC-7 en verano)

    Baja California, Colima (solo Isla Clarión, que pertenece al archipiélago de Revillagigedo; no aplica Horario de Verano)
*/

// Entre el 1er domingo de noviembre y el 2o domingo de marzo del año próximo, la zona horaria de varios municipios se alínea con el horario del centro del país.
// Estos son
/*
    Pasa de UTC-8 a UTC-7 en verano: todo el estado de Baja California.
    De UTC-7 a UTC-6: en Chihuahua, los municipios de Janos, Ascensión, Juárez, Praxedis G. Guerrero y Guadalupe.
    De UTC-6 a UTC-5: en Chihuahua, los municipios de Coyame del Sotol, Ojinaga y Manuel Benavides; en Coahuila, los municipios de Acuña, Allende, Guerrero, Hidalgo, Jiménez, Morelos, Nava, Ocampo, Piedras Negras, Villa Unión y Zaragoza; en Nuevo León, el municipio de Anáhuac; y en Tamaulipas, los municipios de Nuevo Laredo, Guerrero, Mier, Miguel Alemán, Camargo, Gustavo Díaz Ordaz, Reynosa, Río Bravo, Valle Hermoso y Matamoros.

    Cada año el horario de verano fronterizo empieza el segundo domingo de marzo, a las 2:00 (que pasan a ser las 3:00), y concluye el primer domingo de noviembre, a las 2:00 (que pasan a ser la 1:00). domingo de abril, a las 2:00 Primer (que a ser domingo de octubre, las 3:00). 
*/
// Fuente de los deseos: https://es.wikipedia.org/wiki/Husos_horarios_de_M%C3%A9xico

function isDateInRange(date, startDate, endDate) {
    // Ensure all inputs are valid Date objects
    if (!(date instanceof Date) || !(startDate instanceof Date) || !(endDate instanceof Date)) {
        throw new Error("All arguments must be valid Date objects.");
    }

    // Compare dates directly
    return date >= startDate && date <= endDate;
}

// Example usage
const dateToCheck = new Date(2024, 2, 15); // March 15, 2024
const startDate = new Date(2024, 2, 10); // March 10, 2024
const endDate = new Date(2024, 2, 20); // March 20, 2024

const result = isDateInRange(dateToCheck, startDate, endDate);
console.log(`Is ${dateToCheck.toDateString()} between ${startDate.toDateString()} and ${endDate.toDateString()}? ${result}`);

function tz(edo, mun){
    let estado = edo.replace('_',' ');
    let municipio = mun.replace('_',' ');
  
    const utc7edo = [
        "Baja California",
        "Baja California",
        "Nayarit",
        "Sinaloa",
        "Sonora"
    ];
  
    const utc7munChih = [
        "Janos",
        "Ascensión",
        "Juárez",
        "Praxedis",
        "Guadalupe"
    ];
  
    const utc5edo = [
        "Quintana Roo"
    ];
  
    const utc5munCoah = [
        "Acuña",
        "Allende",
        "Guerrero",
        "Hidalgo",
        "Jiménez",
        "Morelos",
        "Nava",
        "Ocampo",
        "Piedras Negras",
        "Villa Unión",
        "Zaragoza"
    ];
  
    const utc5munNL = [
        "Anáhuac"
    ];
  
    const utc5munTamps = [
        "Nuevo Laredo",
        "Guerrero",
        "Mier",
        "Miguel Alemán",
        "Camargo",
        "Gustavo Díaz Ordaz",
        "Reynosa",
        "Río Bravo",
        "Valle Hermoso",
        "Matamoros"
    ];
  
    let timezone = 'UTC-6';
  
    if(utc7edo.includes(estado)){
        timezone = 'UTC-7';
    }
  
    if(utc5edo.includes(estado)){
        timezone = 'UTC-5';
    }
  
    if(estado === 'Chihuahua' && utc7munChih.includes(municipio)){
        timezone = 'UTC-7';
    }
  
    if(estado === 'Coahuila' && utc5munCoah.includes(municipio)){
        timezone = 'UTC-5';
    }
  
    if(estado === 'Nuevo León' && utc5munNL.includes(municipio)){
        timezone = 'UTC-5';
    }
  
    if(estado === 'Tamaulipas' && utc5munTamps.includes(municipio)){
        timezone = 'UTC-5';
    }
    return timezone;
  }


  // Brought to you by ChatGPT

  function determinarZonaHoraria(esHorarioVerano, estado, municipio) {
    const zonaSureste = ["Quintana Roo"];
    const zonaCentro = [
        "Aguascalientes", "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima",
        "Ciudad de México", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco",
        "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla",
        "Querétaro", "San Luis Potosí", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz",
        "Yucatán", "Zacatecas"
    ];
    const zonaPacifico = ["Baja California Sur", "Colima", "Nayarit", "Sinaloa", "Sonora"];
    const zonaNoroeste = ["Baja California"];

    const municipiosHorarioEspecial = {
        // De UTC-7 a UTC-6
        "Chihuahua": ["Janos", "Ascensión", "Juárez", "Praxedis G. Guerrero", "Guadalupe"],
        // De UTC-6 a UTC-5
        "Chihuahua": ["Coyame del Sotol", "Ojinaga", "Manuel Benavides"],
        "Coahuila": ["Acuña", "Allende", "Guerrero", "Hidalgo", "Jiménez", "Morelos", "Nava", "Ocampo", "Piedras Negras", "Villa Unión", "Zaragoza"],
        "Nuevo León": ["Anáhuac"],
        "Tamaulipas": ["Nuevo Laredo", "Guerrero", "Mier", "Miguel Alemán", "Camargo", "Gustavo Díaz Ordaz", "Reynosa", "Río Bravo", "Valle Hermoso", "Matamoros"]
    };

    if (zonaSureste.includes(estado)) {
        return "UTC-5";
    }

    if (zonaCentro.includes(estado)) {
        if (municipiosHorarioEspecial[estado] && municipiosHorarioEspecial[estado].includes(municipio)) {
            return esHorarioVerano ? "UTC-5" : "UTC-6";
        }
        return "UTC-6";
    }

    if (zonaPacifico.includes(estado)) {
        if (estado === "Nayarit" && municipio === "Bahía de Banderas") {
            return "UTC-6";
        }
        return "UTC-7";
    }

    if (zonaNoroeste.includes(estado)) {
        return esHorarioVerano ? "UTC-7" : "UTC-8";
    }

    return "UTC-6";
}

// Ejemplo de uso
console.log(determinarZonaHoraria(true, "Chihuahua", "Juárez")); // Output: "UTC-6"
console.log(determinarZonaHoraria(false, "Quintana Roo", "")); // Output: "UTC-5"
console.log(determinarZonaHoraria(true, "Baja California", "")); // Output: "UTC-7"

console.log(determinarZonaHoraria(false, "Tamaulipas", "Matamoros")); // Output: "UTC-6"

const utc1 = 'UTC-5';
const utc2 = 'UTC-6';

const u1 = utc1.split('-')[1];
const u2 = utc2.split('-')[1];

const diff = u1-u2;

console.log(diff);